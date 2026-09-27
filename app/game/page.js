"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function GamePage() {
  const router = useRouter();

  const [patrol, setPatrol] = useState(null);
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGame() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: patrolData, error: patrolError } = await supabase
        .from("patrols")
        .select("id, name, email")
        .eq("user_id", user.id)
        .single();

      if (patrolError) {
        console.error(patrolError);
        setError("Nie udało się pobrać danych patrolu.");
        setLoading(false);
        return;
      }

      const { data: pointsData, error: pointsError } = await supabase
        .from("points")
        .select(
          "id, name, description, task, qr_code, sort_order, requires_photo, requires_answer"
        )
        .order("sort_order", { ascending: true });

      if (pointsError) {
        console.error(pointsError);
        setError("Nie udało się pobrać punktów gry.");
        setLoading(false);
        return;
      }

      setPatrol(patrolData);
      setPoints(pointsData || []);
      setLoading(false);
    }

    loadGame();
  }, [router]);

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <p>Ładowanie gry...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <h1>Ups!</h1>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <p style={styles.small}>TWÓJ PATROL</p>
          <h1 style={styles.title}>{patrol.name} 🏕️</h1>
          <p style={styles.subtitle}>
            Przed Wami 5 zadań. Powodzenia!
          </p>
        </header>

        <section>
          {points.map((point, index) => (
            <div key={point.id} style={styles.pointCard}>
              <div style={styles.number}>{index + 1}</div>

              <div style={styles.pointContent}>
                <h2 style={styles.pointTitle}>{point.name}</h2>

                <p style={styles.description}>
                  {point.description}
                </p>

                <div style={styles.taskBox}>
                  <strong>Zadanie:</strong>
                  <p style={{ marginBottom: 0 }}>{point.task}</p>
                </div>

                <div style={styles.requirements}>
                  {point.requires_photo && (
                    <span style={styles.badge}>📷 Zdjęcie</span>
                  )}

                  {point.requires_answer && (
                    <span style={styles.badge}>✏️ Odpowiedź</span>
                  )}
                </div>

                <button
                  style={styles.button}
                  onClick={() => alert("Ten punkt uruchomimy w następnym kroku!")}
                >
                  Rozpocznij punkt
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
    padding: "30px 16px",
  },

  container: {
    maxWidth: "700px",
    margin: "0 auto",
  },

  card: {
    maxWidth: "500px",
    margin: "100px auto",
    background: "white",
    padding: "30px",
    borderRadius: "18px",
    textAlign: "center",
  },

  header: {
    background: "#111827",
    color: "white",
    padding: "28px",
    borderRadius: "20px",
    marginBottom: "20px",
  },

  small: {
    margin: 0,
    fontSize: "12px",
    opacity: 0.7,
    letterSpacing: "1px",
  },

  title: {
    margin: "8px 0",
    fontSize: "30px",
  },

  subtitle: {
    margin: 0,
    opacity: 0.85,
  },

  pointCard: {
    display: "flex",
    gap: "18px",
    background: "white",
    padding: "20px",
    marginBottom: "16px",
    borderRadius: "18px",
    boxShadow: "0 3px 15px rgba(0,0,0,0.06)",
  },

  number: {
    minWidth: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#111827",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "18px",
  },

  pointContent: {
    flex: 1,
  },

  pointTitle: {
    marginTop: 0,
    marginBottom: "8px",
    fontSize: "21px",
  },

  description: {
    color: "#555",
  },

  taskBox: {
    background: "#f3f4f6",
    padding: "14px",
    borderRadius: "12px",
    marginTop: "14px",
    lineHeight: 1.5,
  },

  requirements: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "14px",
  },

  badge: {
    background: "#e5e7eb",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "13px",
  },

  button: {
    width: "100%",
    marginTop: "16px",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    background: "#111827",
    color: "white",
    fontSize: "15px",
    cursor: "pointer",
  },
};