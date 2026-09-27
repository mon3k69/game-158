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
    <main style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <p style={styles.eyebrow}>⚜️ GRA ZHP</p>
        <h1 style={styles.title}>Gra ZHP</h1>

        <p style={styles.subtitle}>Zaloguj się i kontynuuj grę.</p>

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
          placeholder="Twoje hasło"
          required
          style={inputStyle}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Logowanie..." : "Zaloguj się"}
        </button>

        {message && <p style={styles.message}>{message}</p>}

        <p style={styles.footerText}>
          Nie masz konta?{" "}
          <a href="/register" style={styles.link}>
            Zarejestruj się
          </a>
        </p>
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

  footerText: {
    marginTop: "24px",
    color: "var(--color-text-muted)",
  },

  link: {
    color: "var(--color-forest)",
    fontWeight: "700",
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
