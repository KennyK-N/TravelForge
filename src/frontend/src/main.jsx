import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { SideBarProvider } from "@context/SidebarContext";
import { AlertProvider } from "@context/AlertContext";

import App from "./App.jsx";
import "@/index.css";
import { UserProvider } from "@context/UserContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <UserProvider>
            <SideBarProvider>
              <AlertProvider>
                <App />
              </AlertProvider>
            </SideBarProvider>
          </UserProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
);
