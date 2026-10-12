/**
 * Writes a complete, crawlable HTML file for every public page, plus the
 * public data files, sitemap.xml and llms.txt.
 *
 * Runs after `vite build` (client) and `vite build --ssr` (dist/server):
 *
 *   dist/public/index.html            homepage, fully rendered
 *   dist/public/<page>/index.html     each content page, fully rendered
 *   dist/public/spa.html              empty app shell (noindex) for sign-in,
 *                                     the workspace, reports and unknown URLs
 *   dist/public/data/*.json           open reference data (CORS: *)
 *   dist/public/sitemap.xml, llms.txt
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "dist/public");
const serverEntry = path.join(root, "dist/server/entry-server.js");

const {
  render,
  PAGES,
  buildHead,
  buildShellHead,
  buildDataFiles,
  buildSitemap,
  buildLlmsTxt,
} = await import(pathToFileURL(serverEntry).href);

const templatePath = path.join(publicDir, "index.html");
const template = fs.readFileSync(templatePath, "utf8");

const HEAD_MARKER = "<!--app-head-->";
const ROOT_EMPTY = '<div id="root"></div>';
if (!template.includes(HEAD_MARKER) || !template.includes(ROOT_EMPTY)) {
  throw new Error("index.html is missing the <!--app-head--> marker or the empty #root");
}

function write(relativePath, contents) {
  const target = path.join(publicDir, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents);
  return target;
}

// 1. The empty shell first, while index.html is still the bare template.
write("spa.html", template.replace(HEAD_MARKER, buildShellHead()));

// 2. Every public page.
for (const page of PAGES) {
  const appHtml = render(page.path);
  if (!appHtml.includes("<h1")) {
    throw new Error(`Pre-render of ${page.path} produced no <h1>`);
  }
  const html = template
    .replace(HEAD_MARKER, buildHead(page.path))
    .replace(ROOT_EMPTY, `<div id="root">${appHtml}</div>`);
  const file = page.path === "/" ? "index.html" : `${page.path.slice(1)}/index.html`;
  write(file, html);
}

// 3. Data files, sitemap and llms.txt.
const now = new Date();
const today = now.toISOString().slice(0, 10);
for (const [file, data] of Object.entries(buildDataFiles(now.toISOString()))) {
  write(file.slice(1), `${JSON.stringify(data, null, 2)}\n`);
}
write("sitemap.xml", buildSitemap(today));
write("llms.txt", buildLlmsTxt());

console.log(
  `Pre-rendered ${PAGES.length} pages, spa.html, ${Object.keys(buildDataFiles(today)).length} data files, sitemap.xml and llms.txt`,
);
