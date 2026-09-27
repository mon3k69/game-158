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

      let status = "Nie rozpoczęto";

      if (completedCount > 0 && completedCount < TOTAL_POINTS) {
        status = "W trakcie";
      }

      if (completedCount >= TOTAL_POINTS) {
        status = "Ukończono";
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
          Ładowanie panelu organizatora...
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
    (participant) => participant.status === "Ukończono"
  ).length;

  const inProgressParticipants = participants.filter(
    (participant) => participant.status === "W trakcie"
  ).length;

  const notStartedParticipants = participants.filter(
    (participant) => participant.status === "Nie rozpoczęto"
  ).length;

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}

        <header style={styles.header}>
          <div>
            <div style={styles.label}>⚜️ PANEL GRY</div>

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
                        ...(participant.status === "Ukończono"
                          ? styles.statusCompleted
                          : participant.status === "W trakcie"
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
    background: "var(--color-cream)",
    padding: "24px 16px",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  header: {
    background:
      "linear-gradient(160deg, var(--color-forest-dark) 0%, var(--color-forest) 100%)",
    color: "white",
    padding: "28px",
    borderRadius: "20px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    border: "1px solid var(--color-forest)",
  },

  label: {
    fontSize: "12px",
    letterSpacing: "2px",
    opacity: 0.7,
    marginBottom: "8px",
    color: "var(--color-khaki-light)",
  },

  title: {
    margin: 0,
    fontSize: "30px",
  },

  subtitle: {
    margin: "8px 0 0",
    opacity: 0.8,
  },

  refreshButton: {
    background: "var(--color-orange)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "11px 16px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontWeight: "700",
  },

  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "14px",
    marginBottom: "20px",
  },

  statCard: {
    background: "var(--color-paper)",
    borderRadius: "16px",
    padding: "22px",
    textAlign: "center",
    border: "1px solid var(--color-khaki-light)",
  },

  statNumber: {
    fontSize: "32px",
    fontWeight: "700",
    color: "var(--color-forest-dark)",
  },

  statLabel: {
    marginTop: "4px",
    color: "var(--color-text-muted)",
    fontSize: "14px",
  },

  card: {
    background: "var(--color-paper)",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "var(--shadow-card)",
    border: "1px solid var(--color-khaki-light)",
  },

  sectionHeader: {
    marginBottom: "20px",
  },

  sectionTitle: {
    margin: 0,
    color: "var(--color-forest-dark)",
  },

  sectionDescription: {
    margin: "5px 0 0",
    color: "var(--color-text-muted)",
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
    borderBottom: "1px dashed var(--color-khaki-light)",
  },

  participantInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  email: {
    color: "var(--color-text-muted)",
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
    color: "var(--color-text)",
  },

  progressBar: {
    height: "8px",
    background: "var(--color-khaki-light)",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "var(--color-orange)",
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
    background: "var(--color-khaki-light)",
    color: "var(--color-forest-dark)",
  },

  statusProgress: {
    background: "var(--color-orange-light)",
    color: "var(--color-orange-dark)",
  },

  statusNotStarted: {
    background: "var(--color-cream)",
    color: "var(--color-text-muted)",
  },

  activity: {
    color: "var(--color-text-muted)",
    fontSize: "13px",
  },

  empty: {
    padding: "30px",
    textAlign: "center",
    color: "var(--color-text-muted)",
  },

  loading: {
    textAlign: "center",
    padding: "80px 20px",
  },

  button: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "10px",
    background: "var(--color-forest)",
    color: "white",
    cursor: "pointer",
  },

  detailsButton: {
    border: "none",
    background: "var(--color-forest)",
    color: "white",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
  },
};