import { useEffect, useRef } from "react";
import type { Severity } from "@contracts/clause-library";

/**
 * ContractField
 * -------------
 * A perspective-projected field of contract pages drifting through ink space,
 * with a scan plane sweeping down through them. Flagged lines light up in
 * their severity colour as the scan crosses each page.
 *
 * Written against the 2D canvas API with a hand-rolled projection rather than
 * pulling in a WebGL library: the geometry is a dozen textured quads, so the
 * dependency would cost more than it saves.
 */

type FocusMode = Severity | "all";

type Line = {
  /** Vertical position on the page, 0 (top) to 1 (bottom). */
  v: number;
  /** Fraction of the page width this line runs to. */
  width: number;
  /** Left inset as a fraction of page width. */
  indent: number;
  severity: Severity | null;
  /** Flagged lines that have a suggested replacement draw a second green line. */
  replaced: boolean;
};

type Page = {
  x: number;
  y: number;
  z: number;
  /** Rotation about the page's own normal, radians. */
  spin: number;
  /** Per-page drift speed multiplier. */
  bob: number;
  phase: number;
  lines: Line[];
};

const PAGE_W = 1.32;
const PAGE_H = 1.78;
const PAGE_COUNT = 11;

const SEVERITY_RGB: Record<Severity, [number, number, number]> = {
  critical: [179, 49, 28],
  high: [192, 112, 27],
  medium: [156, 133, 20],
  low: [74, 124, 99],
};

const INSERT_RGB: [number, number, number] = [46, 139, 101];

/** Deterministic PRNG so the composition is identical on every load. */
function makeRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function buildPages(): Page[] {
  const rand = makeRandom(20260818);
  const severities: Severity[] = ["critical", "high", "medium", "low"];
  const pages: Page[] = [];

  for (let i = 0; i < PAGE_COUNT; i++) {
    const lineCount = 13 + Math.floor(rand() * 5);
    const lines: Line[] = [];

    // Two or three flagged lines per page, spread out so they read clearly.
    const flagged = new Set<number>();
    const flagCount = 2 + Math.floor(rand() * 2);
    while (flagged.size < flagCount) {
      flagged.add(1 + Math.floor(rand() * (lineCount - 2)));
    }

    for (let l = 0; l < lineCount; l++) {
      const isFlagged = flagged.has(l);
      lines.push({
        v: (l + 1) / (lineCount + 1),
        width: isFlagged ? 0.62 + rand() * 0.22 : 0.34 + rand() * 0.52,
        indent: l === 0 ? 0 : rand() < 0.18 ? 0.08 : 0,
        severity: isFlagged
          ? severities[Math.floor(rand() * severities.length)]
          : null,
        replaced: isFlagged && rand() < 0.62,
      });
    }

    const ring = i / PAGE_COUNT;
    pages.push({
      // Spread wide and biased upward so the headline sits on clean ink.
      x: (rand() - 0.5) * 7.0,
      y: (rand() - 0.5) * 3.0 + 0.55,
      // Kept inside the camera frustum: every page lands between roughly
      // 2.0 and 5.9 units of depth, so none are culled behind the lens.
      z: -0.55 - ring * 4.05 - rand() * 0.45,
      spin: (rand() - 0.5) * 0.5,
      bob: 0.5 + rand() * 0.7,
      phase: rand() * Math.PI * 2,
      lines,
    });
  }

  return pages.sort((a, b) => a.z - b.z);
}

export default function ContractField({
  focus = "all",
  className = "",
}: {
  focus?: FocusMode;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const focusRef = useRef<FocusMode>(focus);

  useEffect(() => {
    focusRef.current = focus;
  }, [focus]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const pages = buildPages();
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let running = true;

    // Pointer parallax, eased toward the target rather than snapping.
    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    let scrollFactor = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const onPointerLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
    };

    const onScroll = () => {
      scrollFactor = Math.min(window.scrollY / Math.max(height, 1), 1.2);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) frame = requestAnimationFrame(draw);
    };

    /** Project a point on a page into screen space. */
    const project = (
      page: Page,
      u: number,
      v: number,
      rotX: number,
      rotY: number,
      lift: number,
      focal: number,
    ): [number, number, number] => {
      // Local page coordinates, centred.
      const lx = (u - 0.5) * PAGE_W;
      const ly = (0.5 - v) * PAGE_H;

      // Spin about the page normal.
      const cs = Math.cos(page.spin);
      const sn = Math.sin(page.spin);
      const x = lx * cs - ly * sn + page.x;
      const y = lx * sn + ly * cs + page.y + lift;
      const z = page.z;

      // World yaw.
      const cy = Math.cos(rotY);
      const sy = Math.sin(rotY);
      const x1 = x * cy + z * sy;
      const z1 = -x * sy + z * cy;

      // World pitch.
      const cx = Math.cos(rotX);
      const sx = Math.sin(rotX);
      const y1 = y * cx - z1 * sx;
      const z2 = y * sx + z1 * cx;

      // Camera sits at +6.4 on Z looking down -Z.
      const zc = z2 + 6.4;
      const scale = focal / Math.max(zc, 0.35);
      return [width / 2 + x1 * scale, height / 2 - y1 * scale, zc];
    };

    const draw = (time: number) => {
      if (!running) return;

      const t = reducedMotion ? 4200 : time;
      const focal = Math.max(width, height) * 0.52;

      // Ease pointer toward target for weight.
      eased.x += (pointer.x - eased.x) * 0.045;
      eased.y += (pointer.y - eased.y) * 0.045;

      const rotY = reducedMotion
        ? -0.34
        : t * 0.000042 + eased.x * 0.3 + scrollFactor * 0.42;
      const rotX = reducedMotion
        ? 0.1
        : 0.09 + eased.y * 0.16 + Math.sin(t * 0.00019) * 0.03;

      // Scan plane travels top to bottom through the field, in page-Y units.
      const scanY = reducedMotion
        ? 0.55
        : 2.6 - (((t * 0.00016) % 1) * 5.2);

      ctx.clearRect(0, 0, width, height);

      // Depth-sorted, far to near.
      const ordered = pages
        .map((page) => {
          const lift = reducedMotion
            ? 0
            : Math.sin(t * 0.00021 * page.bob + page.phase) * 0.16;
          const [, , depth] = project(page, 0.5, 0.5, rotX, rotY, lift, focal);
          return { page, lift, depth };
        })
        .filter((entry) => entry.depth > 0.5)
        .sort((a, b) => b.depth - a.depth);

      for (const { page, lift, depth } of ordered) {
        const corners = [
          project(page, 0, 0, rotX, rotY, lift, focal),
          project(page, 1, 0, rotX, rotY, lift, focal),
          project(page, 1, 1, rotX, rotY, lift, focal),
          project(page, 0, 1, rotX, rotY, lift, focal),
        ];

        // Fade with distance so the far pages sink into the ink.
        const fade = Math.max(0, Math.min(1, 1.5 - depth / 5.4));
        if (fade <= 0.02) continue;

        // Backface / edge-on pages get dimmer, which reads as real rotation.
        const edgeX = corners[1][0] - corners[0][0];
        const edgeY = corners[1][1] - corners[0][1];
        const edgeLen = Math.hypot(edgeX, edgeY);
        const foreshorten = Math.min(
          1,
          edgeLen / (PAGE_W * (focal / Math.max(depth, 0.35))),
        );
        const facing = 0.25 + foreshorten * 0.75;

        // Scan proximity, in world Y.
        const pageWorldY = page.y + lift;
        const scanDelta = Math.abs(pageWorldY - scanY);
        const scanGlow = Math.max(0, 1 - scanDelta / 0.85);

        ctx.beginPath();
        ctx.moveTo(corners[0][0], corners[0][1]);
        for (let i = 1; i < corners.length; i++) {
          ctx.lineTo(corners[i][0], corners[i][1]);
        }
        ctx.closePath();

        // Page body: barely-there paper, brighter as the scan crosses it.
        const bodyAlpha = (0.045 + scanGlow * 0.055) * fade * facing;
        ctx.fillStyle = `rgba(241, 242, 238, ${bodyAlpha.toFixed(4)})`;
        ctx.fill();

        ctx.lineWidth = Math.max(0.6, 1.1 * fade);
        ctx.strokeStyle = `rgba(241, 242, 238, ${(0.16 * fade * facing + scanGlow * 0.22 * fade).toFixed(4)})`;
        ctx.stroke();

        // Ruled lines.
        const lineWeight = Math.max(
          0.8,
          (focal / Math.max(depth, 0.35)) * 0.021,
        );

        for (const line of page.lines) {
          const start = project(
            page,
            line.indent,
            line.v,
            rotX,
            rotY,
            lift,
            focal,
          );
          const end = project(
            page,
            line.indent + line.width,
            line.v,
            rotX,
            rotY,
            lift,
            focal,
          );

          const active = focusRef.current;
          const inFocus =
            active === "all" || (line.severity !== null && line.severity === active);
          const dimmed = active !== "all" && !inFocus;

          if (line.severity && !dimmed) {
            const [r, g, b] = SEVERITY_RGB[line.severity];
            // Flagged lines hold a base presence and flare with the scan.
            const alpha =
              (0.42 + scanGlow * 0.55) * fade * facing * (inFocus ? 1 : 0.5);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(4)})`;
            ctx.lineWidth = lineWeight * 1.5;
            ctx.beginPath();
            ctx.moveTo(start[0], start[1]);
            ctx.lineTo(end[0], end[1]);
            ctx.stroke();

            // The replacement clause, drawn just beneath the struck line.
            if (line.replaced && scanGlow > 0.12) {
              const offset = project(
                page,
                line.indent,
                line.v + 0.028,
                rotX,
                rotY,
                lift,
                focal,
              );
              const offsetEnd = project(
                page,
                line.indent + line.width * 0.86,
                line.v + 0.028,
                rotX,
                rotY,
                lift,
                focal,
              );
              const [ir, ig, ib] = INSERT_RGB;
              ctx.strokeStyle = `rgba(${ir}, ${ig}, ${ib}, ${(scanGlow * 0.85 * fade * facing).toFixed(4)})`;
              ctx.lineWidth = lineWeight * 1.5;
              ctx.beginPath();
              ctx.moveTo(offset[0], offset[1]);
              ctx.lineTo(offsetEnd[0], offsetEnd[1]);
              ctx.stroke();
            }
          } else {
            const alpha =
              (0.13 + scanGlow * 0.15) * fade * facing * (dimmed ? 0.4 : 1);
            ctx.strokeStyle = `rgba(203, 212, 222, ${alpha.toFixed(4)})`;
            ctx.lineWidth = lineWeight;
            ctx.beginPath();
            ctx.moveTo(start[0], start[1]);
            ctx.lineTo(end[0], end[1]);
            ctx.stroke();
          }
        }
      }

      if (!reducedMotion) frame = requestAnimationFrame(draw);
    };

    resize();
    onScroll();
    frame = requestAnimationFrame(draw);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reducedMotion) requestAnimationFrame(draw);
    });
    resizeObserver.observe(canvas);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      role="presentation"
    />
  );
}
