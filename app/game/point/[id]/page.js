"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

async function resizeImage(file, maxSize = 1600, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let width = img.width;
      let height = img.height;

      if (width > maxSize || height > maxSize) {
        const scale = Math.min(
          maxSize / width,
          maxSize / height
        );

        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(
              new Error("Nie udało się zmniejszyć zdjęcia.")
            );
            return;
          }

          resolve(
            new File(
              [blob],
              "photo.jpg",
              { type: "image/jpeg" }
            )
          );
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(
        new Error("Nie udało się odczytać zdjęcia.")
      );
    };

    img.src = objectUrl;
  });
}

export default function PointPage() {
  const { id } = useParams();
  const router = useRouter();

  const [point, setPoint] = useState(null);
  const [patrol, setPatrol] = useState(null);
  const [answer, setAnswer] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadPoint() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: patrolData, error: patrolError } = await supabase
        .from("patrols")
        .select("id, name")
        .eq("user_id", user.id)
        .single();

      if (patrolError) {
        console.error(patrolError);
        setMessage("Nie udało się pobrać danych gracza.");
        setLoading(false);
        return;
      }

      const { data: pointData, error: pointError } = await supabase
        .from("points")
        .select(
          "id, name, description, task, requires_photo, requires_answer"
        )
        .eq("id", id)
        .eq("active", true)
        .single();

      if (pointError) {
        console.error(pointError);
        setMessage("Nie znaleziono tego punktu.");
        setLoading(false);
        return;
      }

      setPatrol(patrolData);
      setPoint(pointData);
      setLoading(false);
    }

    if (id) {
      loadPoint();
    }
  }, [id, router]);

  async function submitPoint() {
    setMessage("");

    if (point.requires_answer && !answer.trim()) {
      setMessage("Wpisz odpowiedź przed wysłaniem.");
      return;
    }

    if (point.requires_photo && !photo) {
      setMessage("Dodaj zdjęcie przed wysłaniem.");
      return;
    }

    setSending(true);

    let photoPath = null;

    if (photo) {
      const fileName = `punkt-${point.id}-${Date.now()}.jpg`;
      const filePath = `${patrol.id}/${fileName}`;
      const resizedFile = await resizeImage(photo);

      const { error: uploadError } = await supabase.storage
        .from("submissions")
        .upload(filePath, resizedFile);

      if (uploadError) {
        console.error(uploadError);
        setMessage("Nie udało się wysłać zdjęcia.");
        setSending(false);
        return;
      }

      photoPath = filePath;
    }

    const { error } = await supabase.from("submissions").insert({
      patrol_id: patrol.id,
      point_id: point.id,
      answer: answer.trim() || null,
      photo_url: photoPath,
    });

    if (error) {
      console.error(error);
      setMessage("Nie udało się zapisać wykonania punktu.");
      setSending(false);
      return;
    }

    setSending(false);
    setMessage("Punkt został zaliczony! 🎉");

    setTimeout(() => {
      router.push("/game");
    }, 1200);
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <p>Ładowanie punktu...</p>
        </div>
      </main>
    );
  }

  if (!point) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <h1>Ups!</h1>
          <p>{message || "Nie znaleziono punktu."}</p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <button
          onClick={() => router.push("/game")}
          style={styles.backButton}
        >
          ← Wróć do gry
        </button>

        <div style={styles.number}>PUNKT {point.id}</div>

        <h1>{point.name}</h1>

        <p style={styles.description}>{point.description}</p>

        <div style={styles.task}>
          <strong>Twoje zadanie:</strong>
          <p>{point.task}</p>
        </div>

        {point.requires_answer && (
          <div>
            <label style={styles.label}>Twoja odpowiedź</label>

            {point.id === 6 ? (
              <div style={styles.answerButtons}>
                <button
                  type="button"
                  onClick={() => setAnswer("Tak")}
                  style={{
                    ...styles.answerButton,
                    ...(answer === "Tak" ? styles.answerButtonSelected : {}),
                  }}
                >
                  Tak
                </button>

                <button
                  type="button"
                  onClick={() => setAnswer("Nie")}
                  style={{
                    ...styles.answerButton,
                    ...(answer === "Nie" ? styles.answerButtonSelected : {}),
                  }}
                >
                  Nie
                </button>
              </div>
            ) : (
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Wpisz tutaj odpowiedź..."
                rows={5}
                style={styles.textarea}
              />
            )}
          </div>
        )}

        {point.requires_photo && (
          <div style={styles.photoSection}>
            <label style={styles.label}>Twoje zdjęcie</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              style={styles.fileInput}
            />

            {photo && (
              <p style={styles.photoSelected}>
                Wybrano: {photo.name}
              </p>
            )}
          </div>
        )}

        <button
          onClick={submitPoint}
          disabled={sending}
          style={styles.submitButton}
        >
          {sending ? "Wysyłanie..." : "Zalicz punkt ✅"}
        </button>

        {message && (
          <div style={styles.message}>
            {message}
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

  card: {
    maxWidth: "600px",
    margin: "0 auto",
    background: "var(--color-paper)",
    padding: "28px",
    borderRadius: "20px",
    boxShadow: "var(--shadow-card-lg)",
    border: "1px solid var(--color-khaki-light)",
  },

  backButton: {
    border: "none",
    background: "transparent",
    padding: 0,
    marginBottom: "25px",
    cursor: "pointer",
    fontSize: "15px",
    color: "var(--color-forest)",
    fontWeight: "700",
  },

  number: {
    display: "inline-block",
    background: "var(--color-forest)",
    color: "white",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "1px",
  },

  description: {
    color: "var(--color-text-muted)",
    fontSize: "17px",
    lineHeight: 1.5,
  },

  task: {
    background: "var(--color-khaki-light)",
    padding: "18px",
    borderRadius: "14px",
    margin: "24px 0",
    lineHeight: 1.5,
    color: "var(--color-text)",
  },

  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "8px",
    color: "var(--color-text)",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid var(--color-khaki)",
    borderRadius: "10px",
    fontSize: "16px",
    resize: "vertical",
    background: "white",
    color: "var(--color-text)",
  },

  photoSection: {
    marginTop: "22px",
  },

  fileInput: {
    width: "100%",
    padding: "12px",
    border: "1px solid var(--color-khaki)",
    borderRadius: "10px",
    boxSizing: "border-box",
    background: "white",
  },

  photoSelected: {
    marginTop: "10px",
    color: "var(--color-text-muted)",
  },

  submitButton: {
    width: "100%",
    marginTop: "24px",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "var(--color-orange)",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(217,118,31,0.35)",
  },

  message: {
    marginTop: "18px",
    padding: "12px",
    background: "var(--color-khaki-light)",
    color: "var(--color-forest-dark)",
    borderRadius: "10px",
    textAlign: "center",
  },
  
   answerButtons: {
    display: "flex",
    gap: "12px",
    marginTop: "10px",
  },

  answerButton: {
    flex: 1,
    padding: "16px",
    border: "2px solid var(--color-khaki)",
    borderRadius: "12px",
    background: "white",
    color: "var(--color-text)",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  answerButtonSelected: {
    background: "var(--color-forest)",
    color: "white",
    borderColor: "var(--color-forest)",
  },
};