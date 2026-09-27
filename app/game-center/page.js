"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function CentrumGryPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAdminPanel() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

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

      const { data: submissions } = await supabase
        .from("submissions")
        .select("patrol_id, point_id");

      const participantsWithProgress = (patrols || []).map((participant) => {
        const completed = (submissions || []).filter(
          (submission) => submission.patrol_id === participant.id
        );

        return {
          ...participant,
          completedCount: completed.length,
        };
      });

      setParticipants(participantsWithProgress);
      setLoading(false);
    }

    loadAdminPanel();
  }, [router]);

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          Ładowanie centrum gry...
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
  const finishedParticipants = participants.filter(
    (participant) => participant.completedCount >= 5
  ).length;

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <p style={styles.small}>CENTRUM GRY</p>
          <h1>Panel organizatora 🎯</h1>
          <p>Zarządzaj przebiegiem gry.</p>
        </header>

        <div style={styles.stats}>
          <div style={styles.stat}>
            <strong>{totalParticipants}</strong>
            <span>uczestników</span>
          </div>

          <div style={styles.stat}>
            <strong>{finishedParticipants}</strong>
            <span>ukończyło grę</span>
          </div>
        </div>

        <section style={styles.card}>
          <h2>Uczestnicy</h2>

          {participants.length === 0 ? (
            <p>Brak zarejestrowanych uczestników.</p>
          ) : (
            <div>
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  style={styles.participant}
                >
                  <div>
                    <strong>{participant.name}</strong>
                    <div style={styles.email}>
                      {participant.email}
                    </div>
                  </div>

                  <div style={styles.progress}>
                    {participant.completedCount} / 5
                  </div>
                </div>
              ))}
            </div>
          )}
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
    maxWidth: "800px",
    margin: "0 auto",
  },

  header: {
    background: "#111827",
    color: "white",
    padding: "28px",
    borderRadius: "20px",
    marginBottom: "20px",
  },

  small: {
    fontSize: "12px",
    opacity: 0.7,
    letterSpacing: "1px",
    margin: 0,
  },

  stats: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "20px",
  },

  stat: {
    background: "white",
    padding: "24px",
    borderRadius: "16px",
    textAlign: "center",
  },

  card: {
    background: "white",
    padding: "24px",
    borderRadius: "18px",
    boxShadow: "0 3px 15px rgba(0,0,0,0.05)",
  },

  participant: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    padding: "16px 0",
    borderBottom: "1px solid #eee",
  },

  email: {
    color: "#777",
    fontSize: "13px",
    marginTop: "4px",
  },

  progress: {
    fontWeight: "bold",
    whiteSpace: "nowrap",
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