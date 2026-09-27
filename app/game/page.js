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
          "id, name, description, task, hint, qr_code, sort_order, requires_photo, requires_answer"
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

                    {point.hint && (
                      <span style={styles.badge}>
                        💡 Podpowiedź
                      </span>
                    )}
                  </div>

                  {completed && (
                    <div style={styles.completedText}>
                      ✅ Punkt wykonany
                    </div>
                  )}

                  <button
                    style={completed ? styles.buttonSecondary : styles.button}
                    onClick={() =>
                      router.push(`/game/point/${point.id}`)
                    }
                  >
                    {completed ? "Zobacz / zmień odpowiedź" : "Rozpocznij punkt"}
                  </button>
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
    background: "var(--color-cream)",
    padding: "30px 16px",
  },

  container: {
    maxWidth: "700px",
    margin: "0 auto",
  },

  card: {
    maxWidth: "500px",
    margin: "100px auto",
    background: "var(--color-paper)",
    padding: "30px",
    borderRadius: "18px",
    textAlign: "center",
    border: "1px solid var(--color-khaki-light)",
  },

  header: {
    background:
      "linear-gradient(160deg, var(--color-forest-dark) 0%, var(--color-forest) 100%)",
    color: "white",
    padding: "28px",
    borderRadius: "20px",
    marginBottom: "20px",
    border: "1px solid var(--color-forest)",
  },

  small: {
    margin: 0,
    fontSize: "12px",
    opacity: 0.75,
    letterSpacing: "1.5px",
    color: "var(--color-khaki-light)",
    fontWeight: "700",
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
    background: "var(--color-orange)",
    borderRadius: "999px",
    transition: "width 0.3s ease",
  },

  pointCard: {
    display: "flex",
    gap: "18px",
    background: "var(--color-paper)",
    padding: "20px",
    marginBottom: "16px",
    borderRadius: "18px",
    boxShadow: "var(--shadow-card)",
    border: "1px solid var(--color-khaki-light)",
  },

  completedCard: {
    opacity: 0.85,
    borderColor: "var(--color-khaki)",
  },

  number: {
    minWidth: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "var(--color-forest)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "18px",
    border: "2px dashed var(--color-khaki)",
  },

  completedNumber: {
    background: "var(--color-orange)",
    border: "2px solid var(--color-orange-light)",
  },

  pointContent: {
    flex: 1,
  },

  pointTitle: {
    marginTop: 0,
    marginBottom: "8px",
    fontSize: "21px",
    color: "var(--color-forest-dark)",
  },

  description: {
    color: "var(--color-text-muted)",
  },

  taskBox: {
    background: "var(--color-khaki-light)",
    padding: "14px",
    borderRadius: "12px",
    marginTop: "14px",
    lineHeight: 1.5,
    color: "var(--color-text)",
  },

  requirements: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "14px",
  },

  badge: {
    background: "var(--color-khaki-light)",
    border: "1px solid var(--color-khaki)",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "13px",
    color: "var(--color-text)",
  },

  button: {
    width: "100%",
    marginTop: "16px",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    background: "var(--color-orange)",
    color: "white",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },

  buttonSecondary: {
    width: "100%",
    marginTop: "10px",
    padding: "12px",
    border: "1px solid var(--color-khaki)",
    borderRadius: "10px",
    background: "var(--color-paper)",
    color: "var(--color-forest-dark)",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },

  completedText: {
    marginTop: "16px",
    padding: "12px",
    background: "var(--color-khaki-light)",
    color: "var(--color-forest-dark)",
    borderRadius: "10px",
    textAlign: "center",
    fontWeight: "bold",
  },

  finish: {
    marginTop: "20px",
    padding: "20px",
    background:
      "linear-gradient(160deg, var(--color-forest) 0%, var(--color-forest-dark) 100%)",
    color: "white",
    borderRadius: "16px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "18px",
    border: "1px solid var(--color-forest)",
  },
};