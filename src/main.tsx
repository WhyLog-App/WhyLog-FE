import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import { MeetingsProvider } from "./contexts/MeetingsContext";
import { QueryProvider } from "./hooks/QueryContext";

import Router from "./router";

import "./styles/app.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryProvider>
      <AuthProvider>
        <MeetingsProvider>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </MeetingsProvider>
      </AuthProvider>
    </QueryProvider>
  </React.StrictMode>,
);
