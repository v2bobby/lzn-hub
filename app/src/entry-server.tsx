/* eslint-disable react-refresh/only-export-components -- build-time module, never hot-reloaded */
/**
 * Build-time renderer. scripts/prerender.mjs imports the bundled version of
 * this file to write a complete HTML page for every public route, so crawlers
 * and visitors without JavaScript get the full content.
 */
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { TRPCProvider } from "@/providers/trpc";
import App from "./App";

export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <TRPCProvider>
          <App />
        </TRPCProvider>
      </StaticRouter>
    </StrictMode>,
  );
}

export { PAGES } from "@/lib/pages";
export {
  buildHead,
  buildShellHead,
  buildDataFiles,
  buildSitemap,
  buildLlmsTxt,
  SHARE_IMAGE,
} from "@/lib/seo";
