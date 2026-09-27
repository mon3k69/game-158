"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage("Nieprawidłowy e-mail lub hasło.");
      return;
    }

    router.push("/game");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
        background: "#f5f5f5",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "white",
          padding: "32px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h1>Gra ZHP</h1>

        <p>Zaloguj się i kontynuuj grę.</p>

        <label>Adres e-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="twoj@email.com"
          required
          style={inputStyle}
        />

        <label>Hasło</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Twoje hasło"
          required
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            marginTop: "8px",
            border: "none",
            borderRadius: "10px",
            background: "#111",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          {loading ? "Logowanie..." : "Zaloguj się"}
        </button>

        {message && (
          <p
            style={{
              marginTop: "20px",
              padding: "12px",
              background: "#f0f0f0",
              borderRadius: "8px",
            }}
          >
            {message}
          </p>
        )}

        <p style={{ marginTop: "24px" }}>
          Nie masz konta?{" "}
          <a href="/register">Zarejestruj się</a>
        </p>
      </form>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "6px",
  marginBottom: "16px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "16px",
  boxSizing: "border-box",
};