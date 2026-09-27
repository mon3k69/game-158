"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

export default function ParticipantDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [participant, setParticipant] = useState(null);
  const [points, setPoints] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadParticipant();
  }, []);

  async function loadParticipant() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    // Check admin access
    const { data: admin } = await supabase
      .from("admins")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!admin) {
      setError("Brak uprawnień organizatora.");
      setLoading(false);
      return;
    }

    setAuthorized(true);

    // Load participant
    const { data: participantData, error: participantError } =
      await supabase
        .from("patrols")
        .select("id, name, email, created_at")
        .eq("id", params.id)
        .maybeSingle();

    if (participantError || !participantData) {
      setError("Nie znaleziono uczestnika.");
      setLoading(false);
      return;
    }

    // Load points
    const { data: pointsData, error: pointsError } = await supabase
      .from("points")
      .select(
        "id, name, description, task, sort_order, requires_photo, requires_answer"
      )
      .order("sort_order", { ascending: true });

    if (pointsError) {
      console.error(pointsError);
      setError("Nie udało się pobrać punktów.");
      setLoading(false);
      return;
    }

    // Load submissions
    const { data: submissionsData, error: submissionsError } =
      await supabase
        .from("submissions")
        .select(
          "id, point_id, answer, photo_url, submitted_at"
        )
        .eq("patrol_id", params.id)
        .order("submitted_at", { ascending: true });

    if (submissionsError) {
      console.error(submissionsError);
      setError("Nie udało się pobrać zgłoszeń.");
      setLoading(false);
      return;
    }

    setParticipant(participantData);
    setPoints(pointsData || []);
    setSubmissions(submissionsData || []);
    setLoading(false);
  }

  function getSubmission(pointId) {
    return submissions.find(
      (submission) => submission.point_id === pointId
    );
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.loading}>
          Ładowanie...
        </div>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <h1>Brak dostępu</h1>
          <p>{error}</p>

          <button
            onClick={() => router.push("/game-center")}
            style={styles.button}
          >
            Powrót
          </button>
        </div>
      </main>
    );
  }

  if (!participant) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <h1>Błąd</h1>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  const completedCount = points.filter(
    (point) => getSubmission(point.id)
  ).length;

  const progress =
    points.length > 0
      ? Math.round((completedCount / points.length) * 100)
      : 0;

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        <button
          onClick={() => router.push("/game-center")}
          style={styles.backButton}
        >
          ← Game Center
        </button>

        {/* PARTICIPANT HEADER */}

        <section style={styles.header}>
          <div>
            <div style={styles.label}>
              PARTICIPANT
            </div>

            <h1 style={styles.title}>
              {participant.name}
            </h1>

            <p style={styles.email}>
              {participant.email}
            </p>
          </div>

          <div style={styles.bigProgress}>
            <strong>
              {completedCount} / {points.length}
            </strong>

            <span>
              completed
            </span>
          </div>
        </section>

        {/* PROGRESS BAR */}

        <section style={styles.card}>
          <div style={styles.progressHeader}>
            <strong>Progress</strong>
            <span>{progress}%</span>
          </div>

          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progress}%`,
              }}
            />
          </div>
        </section>

        {/* POINTS */}

        <section style={styles.card}>
          <h2>Points</h2>

          <div style={styles.points}>
            {points.map((point, index) => {
              const submission = getSubmission(point.id);
              const completed = Boolean(submission);

              return (
                <div
                  key={point.id}
                  style={{
                    ...styles.point,
                    ...(completed
                      ? styles.pointCompleted
                      : {}),
                  }}
                >
                  <div style={styles.pointTop}>
                    <div style={styles.pointTitle}>
                      <span style={styles.pointNumber}>
                        {completed ? "✓" : index + 1}
                      </span>

                      <div>
                        <strong>
                          {point.name}
                        </strong>

                        <div style={styles.pointDescription}>
                          {point.description}
                        </div>
                      </div>
                    </div>

                    <span
                      style={
                        completed
                          ? styles.completedBadge
                          : styles.pendingBadge
                      }
                    >
                      {completed
                        ? "Completed"
                        : "Not completed"}
                    </span>
                  </div>

                  {completed && (
                    <div style={styles.submission}>

                      {submission.answer && (
                        <div style={styles.answer}>
                          <strong>
                            Answer
                          </strong>

                          <p>
                            {submission.answer}
                          </p>
                        </div>
                      )}

                      {submission.photo_url && (
                        <div style={styles.photoInfo}>
                          📷 Photo submitted
                        </div>
                      )}

                      <div style={styles.date}>
                        Submitted:{" "}
                        {new Date(
                          submission.submitted_at
                        ).toLocaleString("pl-PL")}
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </section>

      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
    padding: "24px 16px",
  },

  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },

  backButton: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: "8px 0",
    marginBottom: "15px",
    fontSize: "15px",
  },

  header: {
    background: "#111827",
    color: "white",
    padding: "28px",
    borderRadius: "20px",
    marginBottom: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  label: {
    fontSize: "11px",
    letterSpacing: "2px",
    opacity: 0.6,
    marginBottom: "8px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
  },

  email: {
    margin: "6px 0 0",
    opacity: 0.7,
  },

  bigProgress: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: "100px",
  },

  card: {
    background: "white",
    borderRadius: "18px",
    padding: "24px",
    marginBottom: "16px",
    boxShadow: "0 3px 15px rgba(0,0,0,0.05)",
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },

  progressBar: {
    height: "10px",
    background: "#e5e7eb",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "#111827",
    borderRadius: "999px",
  },

  points: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  point: {
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "18px",
  },

  pointCompleted: {
    borderColor: "#bbf7d0",
  },

  pointTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px",
  },

  pointTitle: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
  },

  pointNumber: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#111827",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontSize: "13px",
    fontWeight: "bold",
  },

  pointDescription: {
    color: "#6b7280",
    fontSize: "13px",
    marginTop: "4px",
  },

  completedBadge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    whiteSpace: "nowrap",
  },

  pendingBadge: {
    background: "#f3f4f6",
    color: "#6b7280",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    whiteSpace: "nowrap",
  },

  submission: {
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid #eee",
  },

  answer: {
    background: "#f9fafb",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "10px",
  },

  answer: {
    background: "#f9fafb",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "10px",
  },

  photoInfo: {
    marginBottom: "10px",
  },

  date: {
    color: "#9ca3af",
    fontSize: "12px",
  },

  loading: {
    textAlign: "center",
    padding: "80px 20px",
  },

  button: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "10px",
    background: "#111827",
    color: "white",
    cursor: "pointer",
  },
};