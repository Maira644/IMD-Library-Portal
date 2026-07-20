// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "sonner";

import { AppRouter } from "@/router";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SearchProvider } from "@/contexts/SearchContext";

import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <SearchProvider>
          <AppRouter />
          <Toaster position="top-right" richColors closeButton />
        </SearchProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
