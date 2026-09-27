"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function GamePage() {
  const router = useRouter();

  const [patrol, setPatrol] = useState(null);
  const [points, setPoints] = useState([]);
  const [completedPoints, setCompletedPoints] = useState([]);
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
        setError("Nie udało się pobrać danych gracza.");
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

      const { data: submissionsData, error: submissionsError } =
        await supabase
          .from("submissions")
          .select("point_id")
          .eq("patrol_id", patrolData.id);

      if (submissionsError) {
        console.error(submissionsError);
      }

      setPatrol(patrolData);
      setPoints(pointsData || []);
      setCompletedPoints(
        (submissionsData || []).map((submission) => submission.point_id)
      );
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

  const completedCount = completedPoints.length;
  const totalCount = points.length;

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <p style={styles.small}>TWÓJ PSEUDONIM</p>

          <h1 style={styles.title}>
            {patrol.name} 🏕️
          </h1>

          <p style={styles.subtitle}>
            Postęp: {completedCount} / {totalCount}
          </p>

          <div style={styles.progressBackground}>
            <div
              style={{
                ...styles.progress,
                width:
                  totalCount > 0
                    ? `${(completedCount / totalCount) * 100}%`
                    : "0%",
              }}
            />
          </div>
        </header>

        <section>
          {points.map((point, index) => {
            const completed = completedPoints.includes(point.id);

            return (
              <div
                key={point.id}
                style={{
                  ...styles.pointCard,
                  ...(completed ? styles.completedCard : {}),
                }}
              >
                <div
                  style={{
                    ...styles.number,
                    ...(completed ? styles.completedNumber : {}),
                  }}
                >
                  {completed ? "✓" : index + 1}
                </div>

                <div style={styles.pointContent}>
                  <h2 style={styles.pointTitle}>
                    {point.name}
                  </h2>

                  <p style={styles.description}>
                    {point.description}
                  </p>

                  <div style={styles.taskBox}>
                    <strong>Zadanie:</strong>
                    <p style={{ marginBottom: 0 }}>
                      {point.task}
                    </p>
                  </div>

                  <div style={styles.requirements}>
                    {point.requires_photo && (
                      <span style={styles.badge}>
                        📷 Zdjęcie
                      </span>
                    )}

                    {point.requires_answer && (
                      <span style={styles.badge}>
                        ✏️ Odpowiedź
                      </span>
                    )}
                  </div>

                  {completed ? (
                    <div style={styles.completedText}>
                      ✅ Punkt wykonany
                    </div>
                  ) : (
                    <button
                      style={styles.button}
                      onClick={() =>
                        router.push(`/game/point/${point.id}`)
                      }
                    >
                      Rozpocznij punkt
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        {completedCount === totalCount && totalCount > 0 && (
          <div style={styles.finish}>
            🎉 Gratulacje! Wszystkie zadania wykonane!
          </div>
        )}
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
    margin: "10px 0 15px",
    opacity: 0.9,
  },

  progressBackground: {
    width: "100%",
    height: "10px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progress: {
    height: "100%",
    background: "white",
    borderRadius: "999px",
    transition: "width 0.3s ease",
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

  completedCard: {
    opacity: 0.8,
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

  completedNumber: {
    background: "#16a34a",
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

  completedText: {
    marginTop: "16px",
    padding: "12px",
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "10px",
    textAlign: "center",
    fontWeight: "bold",
  },

  finish: {
    marginTop: "20px",
    padding: "20px",
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "16px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "18px",
  },
};