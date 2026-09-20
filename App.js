import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [jwtToken, setJwtToken] = useState(localStorage.getItem("jwtToken") || "");

  const clientId = "370396135379-6g6oll34dhrtud2gtmqm6sna1qlqj44j.apps.googleusercontent.com";
  const redirectUri = "http://localhost:3000";

  useEffect(() => {
    // Verifica se veio um token de acesso do Google pela URL
    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      const params = new URLSearchParams(hash.replace("#", "?"));
      const googleToken = params.get("access_token");
      handleTokenExchange(googleToken);
      window.location.hash = ""; // limpa a URL
    }
  }, []);

  useEffect(() => {
    if (jwtToken) {
      try {
        const decoded = jwtDecode(jwtToken);
        setUser(decoded);
      } catch (err) {
        console.error("Erro ao decodificar JWT:", err);
      }
    }
  }, [jwtToken]);

  const handleGoogleLogin = () => {
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=profile email`;
  };

  const handleTokenExchange = async (googleToken) => {
    try {
      const response = await axios.post("http://localhost:4000/api/auth/google", { token: googleToken });
      const { jwt } = response.data;

      localStorage.setItem("jwtToken", jwt);
      setJwtToken(jwt);
    } catch (error) {
      console.error("Erro ao trocar token:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setJwtToken("");
    setUser(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Autenticação com Google OAuth</h1>

        <div>
          {user ? (
            <>
              <h2>Bem-vindo, {user.name || user.email}</h2>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button onClick={handleGoogleLogin}>Login com Google</button>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
