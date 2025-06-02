// App.js
import React from "react";
import "./App.css";
import "./pages/dashboard/pages/css/Sidebar.css";
import Header from "./components/Header";
import { Route, Routes, useLocation } from "react-router";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./ProtectedRouter";
import { WebSocketProvider } from "./context/WebSocketProvider";
import { AppProvider } from "./context/context";
import RefreshToken from "./components/RefreshToken";

function App() {
  const location = useLocation();
  return (
    <div className="App">
      {location.pathname !== "/login" && <RefreshToken />}
      {location.pathname !== "/login" && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<Dashboard />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
