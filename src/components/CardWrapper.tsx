"use client";

import { ReactNode, useState } from "react";

interface Props {
  title: string;
  description?: string;
  legend?: ReactNode;
  insight: string;
  explanationTitle: string;
  explanationBody: string;
  sourceLabel?: string;
  children: ReactNode;
}

export default function CardWrapper({
  title,
  description,
  legend,
  insight,
  explanationTitle,
  explanationBody,
  sourceLabel = "Go to source",
  children,
}: Props) {
  const [linkHovered, setLinkHovered] = useState(false);

  return (
    <div
      style={{
        background: "var(--card)",
        borderRadius: 0,
        border: "1px solid var(--card-border)",
        padding: "22px 22px 16px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-geist-sans)",
          fontWeight: 500,
          fontSize: 15,
          margin: "0 0 4px",
          color: "var(--ink)",
        }}
      >
        {title}
      </h3>

      {description && (
        <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 16px" }}>
          {description}
        </p>
      )}

      {legend}

      <div
        style={{
          flex: "1 1 auto",
          minHeight: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

        }}
      >
        {children}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          paddingTop: 14,
          marginBottom: 12,
        }}
      >
        <span style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: 11,
          color: "var(--muted)",
          whiteSpace: "nowrap",
        }}>
          {insight}
        </span>
        <div style={{ flex: 1, height: 0, borderTop: "1px dashed var(--line)" }} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <h4
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontWeight: 500,
            fontSize: 13.5,
            margin: "0 0 6px",
            color: "var(--ink)",
          }}
        >
          {explanationTitle}
        </h4>
        <p style={{ margin: 0, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.55 }}>
          {explanationBody}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 12,
          marginTop: "auto",
        }}
      >
        <a
          href="#"
          onMouseEnter={() => setLinkHovered(true)}
          onMouseLeave={() => setLinkHovered(false)}
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: 12.5,
            color: linkHovered ? "var(--accent)" : "var(--muted-2)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            transition: "color 0.18s",
          }}
        >
          <span style={{ textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: 3 }}>
            {sourceLabel}
          </span>{" "}
          <span style={{
            display: "inline-block",
            transition: "transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
            transform: linkHovered ? "translate(3px, -3px)" : "translate(0, 0)",
          }}>↗</span>
        </a>
        <div style={{ display: "flex", gap: 10, alignItems: "center", color: "var(--muted)" }}>
          <button
            style={iconBtnStyle}
            title="Fullscreen"
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M8.25 3.75H6.75C5.09315 3.75 3.75 5.09315 3.75 6.75V8.25M15.75 3.75H17.25C18.9069 3.75 20.25 5.09315 20.25 6.75V8.25M20.25 15.75V17.25C20.25 18.9069 18.9069 20.25 17.25 20.25H15.75M8.25 20.25H6.75C5.09315 20.25 3.75 18.9069 3.75 17.25V15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            style={iconBtnStyle}
            title="AI Insight"
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 3C15.1014 3 17.7271 3.80507 19.591 5.36647C21.4709 6.94126 22.5 9.22327 22.5 12C22.5 14.7767 21.4709 17.0587 19.591 18.6335C17.7271 20.1949 15.1014 21 12 21C10.3067 21 8.42959 20.8376 6.7664 20.0781C6.74404 20.0912 6.72083 20.1047 6.69679 20.1185C6.41782 20.2781 6.02 20.4795 5.54319 20.6457C4.60162 20.9739 3.26058 21.1944 1.92768 20.56C1.72423 20.4632 1.57509 20.28 1.52152 20.0611C1.46794 19.8423 1.5156 19.6109 1.65131 19.431C3.09394 17.5191 2.66561 16.3505 2.64764 16.3014C2.64764 16.3014 2.64624 16.2977 2.64195 16.2874L2.63379 16.2682L2.62187 16.2398C2.54586 16.0568 2.27093 15.3813 2.01377 14.5754C1.76423 13.7934 1.50001 12.7949 1.50001 12C1.50001 9.22327 2.5291 6.94126 4.40901 5.36647C6.27295 3.80507 8.8986 3 12 3ZM6.5 12C6.5 12.5523 6.94772 13 7.5 13C8.05229 13 8.5 12.5523 8.5 12C8.5 11.4477 8.05229 11 7.5 11C6.94772 11 6.5 11.4477 6.5 12ZM11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12ZM16.5 13C15.9477 13 15.5 12.5523 15.5 12C15.5 11.4477 15.9477 11 16.5 11C17.0523 11 17.5 11.4477 17.5 12C17.5 12.5523 17.0523 13 16.5 13Z" fill="currentColor"/>
            </svg>
          </button>
          <button
            style={iconBtnStyle}
            title="Capture"
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M15.4649 5.75L14.8157 6.12554C14.9497 6.35729 15.1971 6.5 15.4649 6.5V5.75ZM8.53513 5.75V6.5C8.80285 6.5 9.05028 6.35729 9.18433 6.12554L8.53513 5.75ZM2 8.75V17.25H3.5V8.75H2ZM5.75 21H18.25V19.5H5.75V21ZM22 17.25V8.75H20.5V17.25H22ZM12 4.5C13.202 4.5 14.2526 5.15216 14.8157 6.12554L16.1141 5.37446C15.2939 3.95663 13.7591 3 12 3V4.5ZM9.18433 6.12554C9.74741 5.15216 10.798 4.5 12 4.5V3C10.2409 3 8.70609 3.95663 7.88592 5.37446L9.18433 6.12554ZM18.25 5H15.4649V6.5H18.25V5ZM8.53513 5H5.75V6.5H8.53513V5ZM22 8.75C22 6.67893 20.3211 5 18.25 5V6.5C19.4926 6.5 20.5 7.50736 20.5 8.75H22ZM18.25 21C20.3211 21 22 19.3211 22 17.25H20.5C20.5 18.4926 19.4926 19.5 18.25 19.5V21ZM2 17.25C2 19.3211 3.67893 21 5.75 21V19.5C4.50736 19.5 3.5 18.4926 3.5 17.25H2ZM3.5 8.75C3.5 7.50736 4.50736 6.5 5.75 6.5V5C3.67893 5 2 6.67893 2 8.75H3.5ZM14.5 12.5C14.5 13.8807 13.3807 15 12 15V16.5C14.2091 16.5 16 14.7091 16 12.5H14.5ZM12 15C10.6193 15 9.5 13.8807 9.5 12.5H8C8 14.7091 9.79086 16.5 12 16.5V15ZM9.5 12.5C9.5 11.1193 10.6193 10 12 10V8.5C9.79086 8.5 8 10.2909 8 12.5H9.5ZM12 10C13.3807 10 14.5 11.1193 14.5 12.5H16C16 10.2909 14.2091 8.5 12 8.5V10Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

const iconBtnStyle: React.CSSProperties = {
  width: 18,
  height: 18,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "var(--muted)",
  padding: 0,
  transition: "color 0.15s",
};

