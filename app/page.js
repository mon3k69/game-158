export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "16px",
          textAlign: "center",
          maxWidth: "500px",
        }}
      >
        <h1>Gra ZHP 🏕️</h1>

        <p>
          Gra terenowa dla patroli.
        </p>

        <a
          href="/login"
          style={{
            display: "inline-block",
            marginTop: "20px",
            padding: "12px 20px",
            borderRadius: "8px",
            background: "#111",
            color: "white",
            textDecoration: "none",
          }}
        >
          Zaloguj się
        </a>

        <br />

        <a
          href="/register"
          style={{
            display: "inline-block",
            marginTop: "12px",
          }}
        >
          Zarejestruj patrol
        </a>
      </div>
    </main>
  );
}