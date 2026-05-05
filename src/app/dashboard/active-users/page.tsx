export default function activeusersPage() {
  return (
    <div>
      <h1
        style={{
          fontFamily: "var(--font-geist-sans)",
          fontWeight: 500,
          fontSize: 34,
          letterSpacing: "-0.02em",
          margin: "0 0 6px",
          color: "var(--ink)",
        }}
      >
        active users
      </h1>
      <p
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: 12,
          color: "var(--ink-2)",
          marginBottom: 32,
        }}
      >
        For the period — Apr 19th – 25th, 2026
      </p>
      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 14,
          padding: "48px 32px",
          textAlign: "center",
          fontFamily: "var(--font-geist-mono)",
          fontSize: 13,
          color: "var(--muted)",
        }}
      >
        active users data coming soon.
      </div>
    </div>
  );
}
