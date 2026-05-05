"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { navItems } from "@/lib/data";
import { useState, useEffect } from "react";
import { applyTheme, getInitialDark } from "@/lib/theme";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function Sidebar() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(getInitialDark());
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    applyTheme(next);
  }

  return (
    <aside
      style={{
        width: 240,
        paddingTop: 0,
        height: "calc(100vh - 100px)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease }}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 0 16px" }}
      >
        <h4 style={{ fontFamily: "var(--font-geist-mono)", fontWeight: 500, fontSize: 14, color: "var(--ink)", margin: 0, letterSpacing: "-0.01em" }}>
          Index
        </h4>
        <button
          onClick={toggleTheme}
          title={dark ? "Switch to light" : "Switch to dark"}
          style={{
            width: 26, height: 26, borderRadius: "50%",
            background: "var(--chip)",
            border: "1px solid var(--line)",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--muted)",
            transition: "color 0.15s, background 0.15s",
            flexShrink: 0,
          }}
        >
          {!dark ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>
      </motion.div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map((item, i) => {
          const active = pathname === item.href;
          const isAUM = item.label === "AUM";
          const color = active ? "var(--accent)" : "var(--muted-2)";
          return (
            <motion.li
              key={item.href}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.05 + i * 0.04, ease }}
            >
              <Link
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 0",
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 16,
                  color: active ? "var(--accent)" : "var(--ink-2)",
                  textDecoration: "none",
                  transition: "color 0.12s",
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.color = "#9b8ff9";
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.color = "var(--ink-2)";
                }}
              >
                {isAUM ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0, transition: "stroke 0.12s" }}
                  >
                    <path d="M7.75 9.75H16.25M7.75 9.75C6.09315 9.75 4.75 11.0931 4.75 12.75V18.25C4.75 19.9069 6.09315 21.25 7.75 21.25H16.25C17.9069 21.25 19.25 19.9069 19.25 18.25V12.75C19.25 11.0931 17.9069 9.75 16.25 9.75M7.75 9.75V7.25C7.75 4.90279 9.65279 3 12 3C14.3472 3 16.25 4.90279 16.25 7.25V9.75" />
                    <path d="M12 14V17" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0, transition: "stroke 0.12s" }}
                  >
                    <path d="M19.75 17.75V6.25C19.75 4.59315 18.4069 3.25 16.75 3.25H7.25C5.59315 3.25 4.25 4.59315 4.25 6.25V17.75C4.25 19.4069 5.59315 20.75 7.25 20.75H16.75C18.4069 20.75 19.75 19.4069 19.75 17.75Z" />
                    <path d="M8.75 7.75H15.25" />
                    <path d="M8.75 11.75H12.25" />
                  </svg>
                )}
                {item.label}
              </Link>
            </motion.li>
          );
        })}
      </ul>

      {/* Author */}
      <motion.div
        initial={{ opacity: 0, y: 120 }}
        animate={{ opacity: 1, y: 110 }}
        transition={{ duration: 0.5, delay: 0.5, ease }}
        style={{
          marginTop: "auto",
          paddingBottom: 24,
          fontFamily: "var(--font-geist-mono)",
          fontSize: 13,
          color: "var(--muted)",
          lineHeight: 1.7,
        }}
      >
        <div>Author:</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: dark ? "#2d1020" : "#FFEAF3",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              color: dark ? "#f472b6" : "#D8488E",
              fontFamily: "var(--font-geist-mono)",
              fontWeight: 600,
            }}
          >
            G
          </span>
          Gideon I.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, paddingLeft: 2 }}>
          <span style={{ color: "var(--muted-2)", fontSize: 13, transform: "translateY(-1px)" }}>↳</span>
          Approved by
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              background: "var(--chip)",
              border: "none",
              padding: "1px 7px 1px 4px",
              borderRadius: 999,
              color: "var(--ink-2)",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34973C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="7.75" r="4.5" />
              <path d="M12.0018 12.25C8.22236 12.25 5.87133 14.4212 4.94874 17.2952C4.44232 18.8728 5.84498 20.25 7.50184 20.25H11.252" />
              <path d="M14.75 18.5543L16.9318 20.25L20.75 14.25" />
            </svg>
            Tony O
          </span>
        </div>
      </motion.div>
    </aside>
  );
}
