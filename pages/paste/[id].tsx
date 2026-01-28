import { GetServerSideProps } from "next";

type PasteProps = {
  content?: string;
  error?: string;
};

export default function PastePage({ content, error }: PasteProps) {
  if (error) {
    return (
      <div style={{ padding: "40px", color: "white", background: "black" }}>
        <h1>❌ Paste not available</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", background: "black", minHeight: "100vh" }}>
      <h1 style={{ color: "white" }}>Pastebin Lite</h1>
      <pre
        style={{
          marginTop: "20px",
          padding: "20px",
          background: "#111",
          color: "#0f0",
          whiteSpace: "pre-wrap",
          borderRadius: "6px",
        }}
      >
        {content}
      </pre>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/pastes/${id}`
    );

    if (!res.ok) {
      return { props: { error: "Paste expired or not found" } };
    }

    const data = await res.json();
    return { props: { content: data.content } };
  } catch {
    return { props: { error: "Server error" } };
  }
};
