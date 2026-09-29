"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");

    if (password !== password2) {
      setMessage("Hasła nie są takie same.");
      return;
    }

    if (password.length < 6) {
      setMessage("Hasło musi mieć co najmniej 6 znaków.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          patrol_name: name,
        },
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(
      "Konto zostało utworzone. Sprawdź swoją skrzynkę e-mail i potwierdź adres."
    );
    setRegistered(true);
  }

  return (
    <main style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <p style={styles.eyebrow}>⚜️ NOWY ODKRYWCA</p>
        <h1 style={styles.title}>Dołącz do gry</h1>

        <p style={styles.subtitle}>Podaj pseudonim i utwórz swoje konto.</p>

        <label style={styles.label}>Twój pseudonim</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="np. Błyskawica"
          required
          style={inputStyle}
        />

        <label style={styles.label}>Adres e-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="twoj@email.com"
          required
          style={inputStyle}
        />

        <label style={styles.label}>Hasło</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimum 6 znaków"
          required
          style={inputStyle}
        />

        <label style={styles.label}>Powtórz hasło</label>
        <input
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          placeholder="Powtórz hasło"
          required
          style={inputStyle}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Tworzenie konta..." : "Zarejestruj się"}
        </button>

        {message && <p style={styles.message}>{message}</p>}

        {registered && (
          <div style={styles.spamNotice}>
            📬 <strong>Nie widzisz maila?</strong> Sprawdź folder{" "}
            <strong>SPAM / Oferty</strong> — czasem wiadomość tam trafia.
          </div>
        )}
      </form>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    background: "var(--color-cream)",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "var(--color-paper)",
    padding: "32px",
    borderRadius: "20px",
    boxShadow: "var(--shadow-card-lg)",
    border: "1px solid var(--color-khaki-light)",
  },

  eyebrow: {
    margin: "0 0 4px",
    fontSize: "12px",
    letterSpacing: "2px",
    fontWeight: "700",
    color: "var(--color-forest)",
  },

  title: {
    color: "var(--color-forest-dark)",
  },

  subtitle: {
    color: "var(--color-text-muted)",
    marginTop: "8px",
  },

  label: {
    display: "block",
    marginTop: "16px",
    marginBottom: "6px",
    fontWeight: "600",
    color: "var(--color-text)",
    fontSize: "14px",
  },

  button: {
    width: "100%",
    padding: "14px",
    marginTop: "24px",
    border: "none",
    borderRadius: "12px",
    background: "var(--color-orange)",
    color: "white",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(217,118,31,0.35)",
  },

  message: {
    marginTop: "20px",
    padding: "12px",
    background: "var(--color-khaki-light)",
    color: "var(--color-forest-dark)",
    borderRadius: "10px",
  },

  spamNotice: {
    marginTop: "12px",
    padding: "14px 16px",
    background: "var(--color-orange-light)",
    border: "1px dashed var(--color-orange)",
    color: "var(--color-orange-dark)",
    borderRadius: "10px",
    fontSize: "14px",
    lineHeight: 1.5,
  },
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid var(--color-khaki)",
  borderRadius: "10px",
  fontSize: "16px",
  boxSizing: "border-box",
  background: "white",
  color: "var(--color-text)",
};
