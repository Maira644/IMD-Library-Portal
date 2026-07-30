// src/main.tsx
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "sonner";

import { AppRouter } from "@/router";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { BrowserRouter } from "react-router-dom";

import "./styles.css";

function PointerEventsWatchdog() {
  useEffect(() => {
    const clearStuckLock = () => {
      const hasOpenOverlay = document.querySelector(
        '[data-state="open"][role="dialog"], [data-state="open"][role="menu"], [data-state="open"][role="alertdialog"]',
      );
      if (!hasOpenOverlay && document.body.style.pointerEvents === "none") {
        document.body.style.pointerEvents = "";
      }
    };

    // Catch it the instant body's style attribute changes
    const observer = new MutationObserver(clearStuckLock);
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    // Extra safety net in case the mutation is missed for any reason
    const interval = setInterval(clearStuckLock, 300);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return null;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SearchProvider>
            <PointerEventsWatchdog />
            <AppRouter />
            <Toaster position="top-right" richColors closeButton />
          </SearchProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);