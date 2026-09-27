export default function Home() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <section style={styles.hero}>
          <p style={styles.eyebrow}>GRA TERENOWA ZHP</p>

          <h1 style={styles.heroTitle}>
            Wyrusz na przygodę i odkryj harcerski świat! 🏕️🔥
          </h1>

          <p style={styles.heroSubtitle}>
            Gra dla uczniów klas 1–6. Nie musisz nic wcześniej umieć —
            wystarczy ciekawość i chęć do zabawy. Ostatnie zadanie
            czeka na Ciebie na prawdziwej zbiórce harcerskiej!
          </p>

          <div style={styles.ctaRow}>
            <a href="/register" style={styles.primaryButton}>
              Zarejestruj się i zacznij grę
            </a>

            <a href="/login" style={styles.secondaryLink}>
              Mam już konto — zaloguj się
            </a>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Dla kogo jest ta gra?</h2>

          <div style={styles.grid3}>
            <div style={styles.infoCard}>
              <div style={styles.infoEmoji}>🧒</div>
              <h3 style={styles.infoTitle}>Klasy 1–6</h3>
              <p style={styles.infoText}>
                Gra jest dopasowana do najmłodszych — proste zasady
                i zadania, które każdy da radę wykonać.
              </p>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.infoEmoji}>🌱</div>
              <h3 style={styles.infoTitle}>Bez doświadczenia</h3>
              <p style={styles.infoText}>
                Nie musisz być harcerzem ani nic wcześniej umieć.
                Wszystkiego nauczysz się po drodze.
              </p>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.infoEmoji}>🧭</div>
              <h3 style={styles.infoTitle}>Przygoda i nowe umiejętności</h3>
              <p style={styles.infoText}>
                Poznasz harcerskie triki, zagadki i zadania terenowe —
                świetna zabawa z kolegami z klasy.
              </p>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Jak to działa?</h2>

          <div style={styles.steps}>
            <div style={styles.step}>
              <div style={styles.stepNumber}>1</div>
              <div>
                <h3 style={styles.stepTitle}>Załóż konto</h3>
                <p style={styles.stepText}>
                  Zarejestruj się samodzielnie — wystarczy pseudonim
                  i e-mail.
                </p>
              </div>
            </div>

            <div style={styles.step}>
              <div style={styles.stepNumber}>2</div>
              <div>
                <h3 style={styles.stepTitle}>Wykonuj zadania</h3>
                <p style={styles.stepText}>
                  Rozwiązuj kolejne punkty gry — zagadki, zdjęcia,
                  małe wyzwania. Każdy punkt to krok bliżej finału.
                </p>
              </div>
            </div>

            <div style={styles.step}>
              <div style={styles.stepNumber}>3</div>
              <div>
                <h3 style={styles.stepTitle}>Dołącz do zbiórki</h3>
                <p style={styles.stepText}>
                  Ostatni punkt gry to zaproszenie na prawdziwą
                  zbiórkę harcerską, gdzie przygoda toczy się dalej —
                  na żywo, razem z innymi uczestnikami!
                </p>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.finalCta}>
          <h2 style={styles.finalCtaTitle}>
            Gotowi na przygodę?
          </h2>

          <p style={styles.finalCtaText}>
            Załóż konto i sprawdź, dokąd zaprowadzi Cię gra!
          </p>

          <a href="/register" style={styles.primaryButtonLight}>
            Zarejestruj się
          </a>
        </section>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f5f5",
  },

  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "24px 16px 60px",
  },

  hero: {
    background: "#111827",
    color: "white",
    borderRadius: "24px",
    padding: "48px 32px",
    textAlign: "center",
    marginBottom: "40px",
  },

  eyebrow: {
    margin: 0,
    fontSize: "13px",
    letterSpacing: "2px",
    opacity: 0.7,
    fontWeight: "700",
  },

  heroTitle: {
    margin: "12px 0 16px",
    fontSize: "34px",
    lineHeight: 1.25,
  },

  heroSubtitle: {
    margin: "0 auto",
    maxWidth: "560px",
    fontSize: "17px",
    lineHeight: 1.6,
    opacity: 0.9,
  },

  ctaRow: {
    marginTop: "28px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "14px",
  },

  primaryButton: {
    display: "inline-block",
    padding: "16px 28px",
    borderRadius: "12px",
    background: "white",
    color: "#111827",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "16px",
  },

  secondaryLink: {
    color: "white",
    opacity: 0.75,
    textDecoration: "underline",
    fontSize: "14px",
  },

  section: {
    marginBottom: "40px",
  },

  sectionTitle: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: "24px",
  },

  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },

  infoCard: {
    background: "white",
    borderRadius: "18px",
    padding: "24px",
    textAlign: "center",
    boxShadow: "0 3px 15px rgba(0,0,0,0.06)",
  },

  infoEmoji: {
    fontSize: "34px",
    marginBottom: "10px",
  },

  infoTitle: {
    margin: "0 0 8px",
    fontSize: "18px",
  },

  infoText: {
    margin: 0,
    color: "#555",
    fontSize: "14px",
    lineHeight: 1.5,
  },

  steps: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  step: {
    display: "flex",
    gap: "18px",
    alignItems: "flex-start",
    background: "white",
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "0 3px 15px rgba(0,0,0,0.06)",
  },

  stepNumber: {
    minWidth: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#111827",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "16px",
    flexShrink: 0,
  },

  stepTitle: {
    margin: "0 0 6px",
    fontSize: "17px",
  },

  stepText: {
    margin: 0,
    color: "#555",
    fontSize: "14px",
    lineHeight: 1.5,
  },

  finalCta: {
    textAlign: "center",
    background: "#dcfce7",
    borderRadius: "20px",
    padding: "36px 24px",
  },

  finalCtaTitle: {
    margin: "0 0 10px",
    fontSize: "24px",
    color: "#166534",
  },

  finalCtaText: {
    margin: "0 0 20px",
    color: "#166534",
  },

  primaryButtonLight: {
    display: "inline-block",
    padding: "14px 26px",
    borderRadius: "12px",
    background: "#166534",
    color: "white",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "16px",
  },
};
