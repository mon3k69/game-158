export default function Home() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <section style={styles.hero}>
          <div style={styles.heroGlow} />

          <p style={styles.eyebrow}>⚜️ GRA TERENOWA ZHP</p>

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

        <div style={styles.trailDivider}>
          <span>🧭</span>
        </div>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Dla kogo jest ta gra?</h2>

          <div style={styles.grid3}>
            <div style={styles.infoCard}>
              <div style={styles.badgeCircle}>🧒</div>
              <h3 style={styles.infoTitle}>Klasy 1–6</h3>
              <p style={styles.infoText}>
                Gra jest dopasowana do najmłodszych — proste zasady
                i zadania, które każdy da radę wykonać.
              </p>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.badgeCircle}>🌱</div>
              <h3 style={styles.infoTitle}>Bez doświadczenia</h3>
              <p style={styles.infoText}>
                Nie musisz być harcerzem ani nic wcześniej umieć.
                Wszystkiego nauczysz się po drodze.
              </p>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.badgeCircle}>🧭</div>
              <h3 style={styles.infoTitle}>Przygoda i nowe umiejętności</h3>
              <p style={styles.infoText}>
                Poznasz harcerskie triki, zagadki i zadania terenowe —
                świetna zabawa z kolegami z klasy.
              </p>
            </div>
          </div>
        </section>

        <div style={styles.trailDivider}>
          <span>🌲</span>
        </div>

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
          <p style={styles.finalCtaEyebrow}>OGNISKO CZEKA 🔥</p>

          <h2 style={styles.finalCtaTitle}>
            Gotowi na przygodę?
          </h2>

          <p style={styles.finalCtaText}>
            Załóż konto i sprawdź, dokąd zaprowadzi Cię gra!
          </p>

          <a href="/register" style={styles.primaryButtonDark}>
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
    background: "var(--color-cream)",
  },

  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "24px 16px 60px",
  },

  hero: {
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(160deg, var(--color-forest-dark) 0%, var(--color-forest) 100%)",
    color: "white",
    borderRadius: "24px",
    padding: "48px 32px",
    textAlign: "center",
    marginBottom: "8px",
    border: "1px solid var(--color-forest)",
  },

  heroGlow: {
    position: "absolute",
    bottom: "-120px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "360px",
    height: "240px",
    background:
      "radial-gradient(closest-side, rgba(217,118,31,0.35), transparent)",
    pointerEvents: "none",
  },

  eyebrow: {
    margin: 0,
    fontSize: "13px",
    letterSpacing: "2px",
    opacity: 0.85,
    fontWeight: "700",
    color: "var(--color-khaki-light)",
    position: "relative",
  },

  heroTitle: {
    margin: "14px 0 16px",
    fontSize: "34px",
    lineHeight: 1.25,
    position: "relative",
  },

  heroSubtitle: {
    margin: "0 auto",
    maxWidth: "560px",
    fontSize: "17px",
    lineHeight: 1.6,
    opacity: 0.92,
    position: "relative",
  },

  ctaRow: {
    marginTop: "28px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "14px",
    position: "relative",
  },

  primaryButton: {
    display: "inline-block",
    padding: "16px 28px",
    borderRadius: "12px",
    background: "var(--color-orange)",
    color: "white",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "16px",
    boxShadow: "0 6px 18px rgba(217,118,31,0.4)",
  },

  primaryButtonDark: {
    display: "inline-block",
    padding: "14px 26px",
    borderRadius: "12px",
    background: "var(--color-orange)",
    color: "white",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "16px",
    boxShadow: "0 6px 18px rgba(217,118,31,0.35)",
  },

  secondaryLink: {
    color: "white",
    opacity: 0.8,
    textDecoration: "underline",
    fontSize: "14px",
  },

  trailDivider: {
    textAlign: "center",
    margin: "8px 0 24px",
    borderTop: "2px dashed var(--color-khaki)",
    position: "relative",
    height: "1px",
  },

  section: {
    marginBottom: "16px",
  },

  sectionTitle: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: "24px",
    color: "var(--color-forest-dark)",
  },

  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },

  infoCard: {
    background: "var(--color-paper)",
    borderRadius: "18px",
    padding: "24px",
    textAlign: "center",
    boxShadow: "var(--shadow-card)",
    border: "1px solid var(--color-khaki-light)",
  },

  badgeCircle: {
    width: "56px",
    height: "56px",
    lineHeight: "56px",
    margin: "0 auto 12px",
    borderRadius: "50%",
    background: "var(--color-khaki-light)",
    border: "2px dashed var(--color-khaki)",
    fontSize: "26px",
  },

  infoTitle: {
    margin: "0 0 8px",
    fontSize: "18px",
    color: "var(--color-forest-dark)",
  },

  infoText: {
    margin: 0,
    color: "var(--color-text-muted)",
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
    background: "var(--color-paper)",
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "var(--shadow-card)",
    border: "1px solid var(--color-khaki-light)",
  },

  stepNumber: {
    minWidth: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "var(--color-forest)",
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
    color: "var(--color-forest-dark)",
  },

  stepText: {
    margin: 0,
    color: "var(--color-text-muted)",
    fontSize: "14px",
    lineHeight: 1.5,
  },

  finalCta: {
    textAlign: "center",
    background:
      "linear-gradient(160deg, var(--color-forest) 0%, var(--color-forest-dark) 100%)",
    borderRadius: "20px",
    padding: "40px 24px",
    marginTop: "24px",
    border: "1px solid var(--color-forest)",
  },

  finalCtaEyebrow: {
    margin: "0 0 10px",
    fontSize: "13px",
    letterSpacing: "2px",
    fontWeight: "700",
    color: "var(--color-orange-light)",
  },

  finalCtaTitle: {
    margin: "0 0 10px",
    fontSize: "24px",
    color: "white",
  },

  finalCtaText: {
    margin: "0 0 20px",
    color: "var(--color-khaki-light)",
  },
};
