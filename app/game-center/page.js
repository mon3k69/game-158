"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const TOTAL_POINTS = 5;

export default function GameCenterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadGameCenter();
  }, []);

  async function loadGameCenter() {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    // Check admin access
    const { data: admin, error: adminError } = await supabase
      .from("admins")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (adminError || !admin) {
      setError("Brak uprawnień organizatora.");
      setLoading(false);
      return;
    }

    setAuthorized(true);

    // Load participants
    const { data: patrols, error: patrolsError } = await supabase
      .from("patrols")
      .select("id, name, email, created_at")
      .order("created_at", { ascending: true });

    if (patrolsError) {
      console.error(patrolsError);
      setError("Nie udało się pobrać uczestników.");
      setLoading(false);
      return;
    }

    // Load submissions
    const { data: submissions, error: submissionsError } = await supabase
      .from("submissions")
      .select("patrol_id, point_id, submitted_at");

    if (submissionsError) {
      console.error(submissionsError);
      setError("Nie udało się pobrać postępów.");
      setLoading(false);
      return;
    }

    const participantsWithProgress = (patrols || []).map((participant) => {
      const participantSubmissions = (submissions || []).filter(
        (submission) => submission.patrol_id === participant.id
      );

      // Count unique completed points
      const completedPointIds = [
        ...new Set(
          participantSubmissions.map(
            (submission) => submission.point_id
          )
        ),
      ];

      const completedCount = completedPointIds.length;

      // Find latest activity
      const latestSubmission = participantSubmissions
        .map((submission) => submission.submitted_at)
        .filter(Boolean)
        .sort()
        .reverse()[0];

      let status = "Not started";

      if (completedCount > 0 && completedCount < TOTAL_POINTS) {
        status = "In progress";
      }

      if (completedCount >= TOTAL_POINTS) {
        status = "Completed";
      }

      return {
        ...participant,
        completedCount,
        status,
        latestActivity: latestSubmission || null,
      };
    });

    setParticipants(participantsWithProgress);
    setLoading(false);
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.loading}>
          Loading Game Center...
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
            onClick={() => router.push("/game")}
            style={styles.button}
          >
            Wróć do gry
          </button>
        </div>
      </main>
    );
  }

  const totalParticipants = participants.length;

  const completedParticipants = participants.filter(
    (participant) => participant.status === "Completed"
  ).length;

  const inProgressParticipants = participants.filter(
    (participant) => participant.status === "In progress"
  ).length;

  const notStartedParticipants = participants.filter(
    (participant) => participant.status === "Not started"
  ).length;

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}

        <header style={styles.header}>
          <div>
            <div style={styles.label}>GAME CENTER</div>

            <h1 style={styles.title}>
              Panel organizatora 🎯
            </h1>

            <p style={styles.subtitle}>
              Monitoruj przebieg gry i postęp uczestników.
            </p>
          </div>

          <button
            onClick={loadGameCenter}
            style={styles.refreshButton}
          >
            ↻ Odśwież
          </button>
        </header>

        {/* STATISTICS */}

        <section style={styles.stats}>

          <div style={styles.statCard}>
            <div style={styles.statNumber}>
              {totalParticipants}
            </div>

            <div style={styles.statLabel}>
              Uczestników
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statNumber}>
              {completedParticipants}
            </div>

            <div style={styles.statLabel}>
              Ukończyło
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statNumber}>
              {inProgressParticipants}
            </div>

            <div style={styles.statLabel}>
              W trakcie
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statNumber}>
              {notStartedParticipants}
            </div>

            <div style={styles.statLabel}>
              Nie rozpoczęło
            </div>
          </div>

        </section>

        {/* PARTICIPANTS */}

        <section style={styles.card}>

          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>
                Uczestnicy
              </h2>

              <p style={styles.sectionDescription}>
                Aktualny postęp gry.
              </p>
            </div>
          </div>

          {participants.length === 0 ? (
            <div style={styles.empty}>
              Brak zarejestrowanych uczestników.
            </div>
          ) : (
            <div style={styles.table}>

              {participants.map((participant) => {

                const progress =
                  (participant.completedCount / TOTAL_POINTS) * 100;

                return (
                  <div
                    key={participant.id}
                    style={styles.participant}
                  >

                    <div style={styles.participantInfo}>

                      <strong>
                        {participant.name}
                      </strong>

                      <span style={styles.email}>
                        {participant.email}
                      </span>

                    </div>

                    <div style={styles.progressContainer}>

                      <div style={styles.progressText}>
                        {participant.completedCount} / {TOTAL_POINTS}
                      </div>

                      <div style={styles.progressBar}>
                        <div
                          style={{
                            ...styles.progressFill,
                            width: `${progress}%`,
                          }}
                        />
                      </div>

                    </div>

                    <div
                      style={{
                        ...styles.status,
                        ...(participant.status === "Completed"
                          ? styles.statusCompleted
                          : participant.status === "In progress"
                          ? styles.statusProgress
                          : styles.statusNotStarted),
                      }}
                    >
                      {participant.status}
                    </div>

                    <div style={styles.activity}>
                      {participant.latestActivity
                        ? formatDate(participant.latestActivity)
                        : "—"}
                    </div>
                    <button
                    onClick={() =>
                        router.push(
                        `/game-center/participant/${participant.id}`
                        )
                    }
                    style={styles.detailsButton}
                    >
                    Szczegóły
                    </button>
                  </div>
                );
              })}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}

function formatDate(date) {
  return new Date(date).toLocaleString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
    padding: "24px 16px",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  header: {
    background: "#111827",
    color: "white",
    padding: "28px",
    borderRadius: "20px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  label: {
    fontSize: "12px",
    letterSpacing: "2px",
    opacity: 0.6,
    marginBottom: "8px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
  },

  subtitle: {
    margin: "8px 0 0",
    opacity: 0.75,
  },

  refreshButton: {
    background: "white",
    color: "#111827",
    border: "none",
    borderRadius: "10px",
    padding: "11px 16px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "14px",
    marginBottom: "20px",
  },

  statCard: {
    background: "white",
    borderRadius: "16px",
    padding: "22px",
    textAlign: "center",
  },

  statNumber: {
    fontSize: "32px",
    fontWeight: "700",
  },

  statLabel: {
    marginTop: "4px",
    color: "#6b7280",
    fontSize: "14px",
  },

  card: {
    background: "white",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 3px 15px rgba(0,0,0,0.05)",
  },

  sectionHeader: {
    marginBottom: "20px",
  },

  sectionTitle: {
    margin: 0,
  },

  sectionDescription: {
    margin: "5px 0 0",
    color: "#6b7280",
  },

  table: {
    display: "flex",
    flexDirection: "column",
  },

  participant: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr 140px 140px 100px",
    gap: "20px",
    alignItems: "center",
    padding: "16px 0",
    borderBottom: "1px solid #eee",
  },

  participantInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  email: {
    color: "#6b7280",
    fontSize: "13px",
  },

  progressContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  progressText: {
    fontSize: "13px",
    fontWeight: "600",
  },

  progressBar: {
    height: "8px",
    background: "#e5e7eb",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "#111827",
    borderRadius: "999px",
  },

  status: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    textAlign: "center",
  },

  statusCompleted: {
    background: "#dcfce7",
    color: "#166534",
  },

  statusProgress: {
    background: "#fef3c7",
    color: "#92400e",
  },

  statusNotStarted: {
    background: "#f3f4f6",
    color: "#4b5563",
  },

  activity: {
    color: "#6b7280",
    fontSize: "13px",
  },

  empty: {
    padding: "30px",
    textAlign: "center",
    color: "#6b7280",
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
    detailsButton: {
    border: "none",
    background: "#111827",
    color: "white",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
  },
};