import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "@fontsource-variable/archivo";
import "@fontsource-variable/newsreader";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import { Toaster } from "@/components/ui/sonner";
import { TRPCProvider } from "@/providers/trpc";
import "./index.css";
import App from "./App";

const app = (
  <StrictMode>
    <BrowserRouter>
      <TRPCProvider>
        <App />
      </TRPCProvider>
    </BrowserRouter>
  </StrictMode>
);

const root = document.getElementById("root")!;

// Public pages arrive with their full HTML already rendered at build time
// (scripts/prerender.mjs). In that case React adopts the existing markup
// instead of rendering it again. Pages without pre-rendered HTML (sign-in,
// workspace, reports) render from scratch.
if (root.firstElementChild) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}

// Toasts live in their own root so they never affect hydration of the page.
const toasterHost = document.createElement("div");
document.body.appendChild(toasterHost);
createRoot(toasterHost).render(
  <Toaster
    position="bottom-right"
    closeButton
    toastOptions={{
      classNames: {
        toast:
          "!rounded-lg !border !border-paper-line !bg-paper-raised !text-ink !font-sans",
        description: "!text-graphite",
        actionButton: "!bg-insert !text-white !rounded-md",
        cancelButton: "!bg-paper-sunk !text-graphite !rounded-md",
      },
    }}
  />,
);
