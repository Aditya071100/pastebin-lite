export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "40px",
        fontFamily: "system-ui",
        background: "#000",
        color: "#fff",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "12px" }}>
        Pastebin Lite
      </h1>

      <p style={{ fontSize: "16px", opacity: 0.85 }}>
        A minimal paste-sharing application built with Next.js.
      </p>

      <p style={{ marginTop: "12px", opacity: 0.6 }}>
        Backend APIs are under development.
      </p>
    </main>
  );
}
