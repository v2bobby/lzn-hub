import { useEffect } from "react";
import { SITE_URL } from "@/lib/site";

function setMeta(selector: string, create: () => HTMLElement, apply: (el: HTMLElement) => void) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  apply(el);
}

/**
 * Keeps <title>, the meta description and the canonical link in step with the
 * current route during client-side navigation. The first load already has the
 * right tags: they are written into each page's HTML at build time.
 */
export function useDocumentMeta(
  title: string,
  description?: string,
  canonicalPath?: string,
) {
  useEffect(() => {
    document.title = title;

    if (description) {
      setMeta(
        'meta[name="description"]',
        () => Object.assign(document.createElement("meta"), { name: "description" }),
        (el) => el.setAttribute("content", description),
      );
    }

    if (canonicalPath) {
      const href = canonicalPath === "/" ? `${SITE_URL}/` : `${SITE_URL}${canonicalPath}`;
      setMeta(
        'link[rel="canonical"]',
        () => Object.assign(document.createElement("link"), { rel: "canonical" }),
        (el) => el.setAttribute("href", href),
      );
    }
  }, [title, description, canonicalPath]);
}
