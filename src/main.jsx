import { StrictMode } from "react";
import { BrowserRouter } from "react-router";
import { createRoot } from "react-dom/client";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./index.css";
import "./components/table.css";
import App from "./App.jsx";
import { AppProvider } from "./context/context.jsx";
import { WebSocketProvider } from "./context/WebSocketProvider.jsx";
import { DeviceProvider } from "./context/DeviceContext.jsx";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppProvider>
     
          <App />

    </AppProvider>
  </BrowserRouter>
);
