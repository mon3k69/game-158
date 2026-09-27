"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function UpdatePasswordPage() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [sessionValid, setSessionValid] = useState(false);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSessionValid(Boolean(session));
      setChecking(false);
    }

    checkSession();
  }, []);

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

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setMessage("Nie udało się zmienić hasła. Poproś o nowy link resetujący.");
      return;
    }

    setDone(true);

    setTimeout(() => {
      router.push("/game");
    }, 1500);
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <p style={styles.eyebrow}>⚜️ GRA ZHP</p>
        <h1 style={styles.title}>Ustaw nowe hasło</h1>

        {checking && <p style={styles.subtitle}>Sprawdzanie linku...</p>}

        {!checking && done && (
          <p style={styles.subtitle}>
            Hasło zostało zmienione. Przenosimy Cię do gry...
          </p>
        )}

        {!checking && !done && !sessionValid && (
          <>
            <p style={styles.subtitle}>
              Link do resetu hasła wygasł lub jest nieprawidłowy.
            </p>

            <p style={styles.footerText}>
              <a href="/reset-password" style={styles.link}>
                Poproś o nowy link
              </a>
            </p>
          </>
        )}

        {!checking && !done && sessionValid && (
          <form onSubmit={handleSubmit}>
            <p style={styles.subtitle}>Wpisz nowe hasło do swojego konta.</p>

            <label style={styles.label}>Nowe hasło</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 znaków"
              required
              style={inputStyle}
            />

            <label style={styles.label}>Powtórz nowe hasło</label>
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="Powtórz hasło"
              required
              style={inputStyle}
            />

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Zapisywanie..." : "Zmień hasło"}
            </button>

            {message && <p style={styles.message}>{message}</p>}
          </form>
        )}
      </div>
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
