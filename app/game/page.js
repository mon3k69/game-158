"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function GamePage() {
  const router = useRouter();
  const [patrol, setPatrol] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPatrol() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("patrols")
        .select("id, name, email")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setPatrol(data);
      setLoading(false);
    }

    loadPatrol();
  }, [router]);

  if (loading) {
    return <main style={{ padding: "30px" }}>Ładowanie...</main>;
  }

  if (!patrol) {
    return (
      <main style={{ padding: "30px" }}>
        Nie znaleziono danych patrolu.
      </main>
    );
  }

  return (
    <main style={{ padding: "30px" }}>
      <h1>Witaj, {patrol.name}! 👋</h1>

      <p>Jesteś zalogowany jako:</p>

      <strong>{patrol.email}</strong>

      <hr style={{ margin: "30px 0" }} />

      <h2>Gra terenowa</h2>
      <p>
        Tutaj za chwilę pojawi się mapa, punkty i zadania.
      </p>
    </main>
  );
}