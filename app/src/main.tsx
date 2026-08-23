import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import { TRPCProvider } from "@/providers/trpc";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <TRPCProvider>
        <App />
        <Toaster
          position="bottom-right"
          closeButton
          toastOptions={{
            classNames: {
              toast:
                "!rounded-lg !border !border-paper-line !bg-paper-raised !text-ink !font-sans",
              description: "!text-graphite",
              actionButton: "!bg-insert !text-white !rounded-sm",
              cancelButton: "!bg-paper-sunk !text-graphite !rounded-sm",
            },
          }}
        />
      </TRPCProvider>
    </BrowserRouter>
  </StrictMode>,
);
