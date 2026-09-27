"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    setLoading(false);

    if (error) {
      setMessage("Nie udało się wysłać linku. Spróbuj ponownie.");
      return;
    }

    setSent(true);
  }

  return (
    <main style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <p style={styles.eyebrow}>⚜️ GRA ZHP</p>
        <h1 style={styles.title}>Resetuj hasło</h1>

        {sent ? (
          <>
            <p style={styles.subtitle}>
              Jeśli konto o podanym adresie istnieje, wysłaliśmy na nie
              link do zresetowania hasła. Sprawdź swoją skrzynkę e-mail.
            </p>

            <p style={styles.footerText}>
              <a href="/login" style={styles.link}>
                Wróć do logowania
              </a>
            </p>
          </>
        ) : (
          <>
            <p style={styles.subtitle}>
              Podaj adres e-mail, na który wyślemy link do ustawienia
              nowego hasła.
            </p>

            <label style={styles.label}>Adres e-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="twoj@email.com"
              required
              style={inputStyle}
            />

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Wysyłanie..." : "Wyślij link resetujący"}
            </button>

            {message && <p style={styles.message}>{message}</p>}

            <p style={styles.footerText}>
              <a href="/login" style={styles.link}>
                Wróć do logowania
              </a>
            </p>
          </>
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
    lineHeight: 1.5,
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
