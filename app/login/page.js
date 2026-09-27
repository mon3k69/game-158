"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("patrols")
      .select("id, name, email")
      .eq("name", name)
      .eq("email", email)
      .eq("code", code)
      .maybeSingle();

    setLoading(false);

    if (error) {
      setMessage("Wystąpił błąd. Spróbuj ponownie.");
      console.error(error);
      return;
    }

    if (!data) {
      setMessage("Nieprawidłowa nazwa patrolu, e-mail lub kod.");
      return;
    }

    setMessage(`Witaj, ${data.name}! Logowanie udane.`);
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

        <p>Wprowadź dane patrolu, aby rozpocząć grę.</p>

        <label>Nazwa patrolu</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="np. Czerwone Wilki"
          required
          style={inputStyle}
        />

        <label>Adres e-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="patrol@example.com"
          required
          style={inputStyle}
        />

        <label>Kod patrolu</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="np. 1234"
          required
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            marginTop: "20px",
            border: "none",
            borderRadius: "10px",
            background: "#111",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          {loading ? "Sprawdzanie..." : "Wejdź do gry"}
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