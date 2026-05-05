"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const CANNED: Record<string, string> = {
  default: "",
  signups: "Weekly sign-ups hit 19.4k this week, the highest ever for Apex Markets. Growth accelerated sharply from Feb after the 'Invest your refund' campaign. Mobile onboarding accounts for 67% of new registrations.",
  channel: "Paid Social (FinTok) + Influencer Referrals drive 46% of new accounts. Organic search is up 12% WoW. The referral program gained 3pts this week following the $10 deposit bonus mechanic.",
  revenue: "Trading fee revenue hit $524k in April — a 188% YoY increase. Blended CAC held steady at $8.65/funded account despite higher spend. Ad spend grew 79% while revenue grew 188%, compressing cost efficiently.",
  radar: "Retention leads at 86 index pts. Viral coefficient crossed benchmark for the first time this quarter. Conversion to first deposit is at 58 index pts — an A/B test on onboarding is live and showing early lift.",
  roas: "ROAS is 3.1× this period — up from 2.5× at the start of the tracked year. Revenue grew 188% while acquisition spend grew only 79%. FinTok campaigns are the highest ROAS channel at 4.2×.",
  aum: "AUM Growth scores 82 index pts vs. a benchmark of 70 — ahead of target. Net inflows exceeded $2.1M this month. Outflows remain flat at 4% of AUM, below the 6% threshold.",
  influencer: "Influencer referrals account for 22% of new accounts this week. FinTok creators drove the highest-converting cohort at 34% funded rate. Top 5 creators contributed 61% of influencer-driven sign-ups.",
  retention: "User retention is the strongest metric this period at 86 index pts, driven by streak rewards and in-app gamification introduced in Q4 2025. 30-day retention sits at 72%, up 6pts MoM.",
  outflow: "Outflows are currently at 4% of AUM — below the 6% alert threshold. No significant withdrawal spikes detected this week. The largest outflow segment is users inactive for 60+ days.",
  community: "Community engagement is up 18% WoW across Discord and in-app forums. The 'Top Trader' leaderboard feature drove a 31% increase in daily active community posts.",
  funnel: "Top-of-funnel traffic is up 22% driven by FinTok impressions. Drop-off at the KYC step decreased by 8pts after the simplified ID flow launched. Funded account conversion sits at 58%.",
  campaign: "The 'Invest your refund' campaign is the top performer this period — 4,200 sign-ups attributed directly. Email re-engagement delivered 890 reactivations at $3.10 CAC.",
  compare: "Compared to last week: sign-ups +4.1%, revenue +9.2%, ROAS +0.2×, retention stable. Channel mix shifted 3pts toward organic, reducing blended CAC by $0.40.",
  highlight: "This week's highlight: viral coefficient crossed benchmark for the first time. Paired with retention at 86 index pts, organic growth loops are strengthening. Watch influencer ROAS — it's up 0.8× WoW.",
};

const DEFAULTS = [
  "New registrations are at an all-time high of 19.4k this week — up 28.4% YoY. Revenue hit $524k in April with ROAS at 3.1×. Retention leads all metrics at 86 index pts.",
  "Hey! This week looks strong — sign-ups up 28.4%, ROAS holding at 3.1×, and retention at 86 index pts. What would you like to dig into?",
  "Happy to help. Top story this week: the 'Invest your refund' campaign drove 4,200 sign-ups. Try asking about ROAS, channels, retention, or the funnel.",
  "Good question! The short answer: growth is accelerating. Revenue is up 188% YoY and CAC is holding at $8.65. Ask me about any specific metric for more detail.",
  "This period's standout metric is retention at 86 index pts — the highest this year. Viral coefficient also crossed benchmark for the first time. What else do you want to know?",
];

let _lastDefaultIdx = -1;
function pickDefault(): string {
  let idx;
  do { idx = Math.floor(Math.random() * DEFAULTS.length); } while (idx === _lastDefaultIdx && DEFAULTS.length > 1);
  _lastDefaultIdx = idx;
  return DEFAULTS[idx];
}

function getReply(q: string): string {
  const l = q.toLowerCase();
  if (l.includes("signup") || l.includes("sign up") || l.includes("registr") || l.includes("new user")) return CANNED.signups;
  if (l.includes("channel") || l.includes("source") || l.includes("organic") || l.includes("social") || l.includes("fintok") || l.includes("mix")) return CANNED.channel;
  if (l.includes("revenue") || l.includes("spend") || l.includes("cost") || l.includes("cac") || l.includes("fee")) return CANNED.revenue;
  if (l.includes("radar") || l.includes("performance") || l.includes("conversion") || l.includes("index") || l.includes("metric")) return CANNED.radar;
  if (l.includes("roas") || l.includes("return on ad")) return CANNED.roas;
  if (l.includes("aum") || l.includes("asset") || l.includes("inflow")) return CANNED.aum;
  if (l.includes("influencer") || l.includes("creator") || l.includes("fintok creator")) return CANNED.influencer;
  if (l.includes("retention") || l.includes("churn") || l.includes("loyal") || l.includes("active")) return CANNED.retention;
  if (l.includes("outflow") || l.includes("withdrawal") || l.includes("withdraw")) return CANNED.outflow;
  if (l.includes("community") || l.includes("discord") || l.includes("forum") || l.includes("engage")) return CANNED.community;
  if (l.includes("funnel") || l.includes("kyc") || l.includes("drop") || l.includes("onboard")) return CANNED.funnel;
  if (l.includes("campaign") || l.includes("email") || l.includes("reactivat")) return CANNED.campaign;
  if (l.includes("compar") || l.includes("last week") || l.includes("vs ") || l.includes("versus")) return CANNED.compare;
  if (l.includes("highlight") || l.includes("summary") || l.includes("tldr") || l.includes("tl;dr") || l.includes("overview")) return CANNED.highlight;
  return pickDefault();
}

interface Message { role: "user" | "ai"; text: string }

export default function ChatDock() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [thinking, setThinking] = useState(false);
  const [visible, setVisible] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(t);
  }, []);

  function send() {
    const q = value.trim();
    if (!q || thinking) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setValue("");
    setOpen(true);
    setThinking(true);
    timerRef.current = setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: getReply(q) }]);
      setThinking(false);
    }, 900);
  }

  return (
    <>
      <style>{`
        @keyframes dotPulse {
          0%,80%,100%{opacity:.25;transform:translateY(0)}
          40%{opacity:1;transform:translateY(-2px)}
        }
        .chat-thread::-webkit-scrollbar { display: none; }
        .chat-thread { scrollbar-width: none; }
      `}</style>

      <motion.div
        id="chat-dock"
        initial={{ opacity: 0, y: 18 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed",
          bottom: 22,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          width: 310,
        }}
      >
        {/* Chat popup */}
        {open && (messages.length > 0 || thinking) && (
          <div
            style={{
              width: "100%",
              background: "var(--card)",
              backdropFilter: "blur(20px)",
              border: "1px solid var(--line)",
              borderRadius: 18,
              boxShadow: "0 16px 48px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px 10px",
                borderBottom: "1px solid var(--line)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img src="/bot.svg" alt="" style={{ width: 26, height: 26, objectFit: "contain" }} />
                <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>
                  Report AI
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "#22c55e" }}>Online</span>
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: "rgba(0,0,0,0.05)",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--muted)",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Thread */}
            <div
              className="chat-thread"
              style={{
                padding: "12px 14px",
                maxHeight: 260,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                    alignItems: "flex-end",
                    gap: 7,
                  }}
                >
                  {m.role === "ai" && (
                    <img src="/bot.svg" alt="" style={{ width: 22, height: 22, objectFit: "contain", flexShrink: 0, marginBottom: 2 }} />
                  )}
                  <span
                    style={{
                      fontFamily: "var(--font-geist-mono)",
                      fontSize: 12,
                      lineHeight: 1.55,
                      padding: "8px 12px",
                      borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                      maxWidth: "78%",
                      background: m.role === "user" ? "var(--accent)" : "var(--chip)",
                      color: m.role === "user" ? "#fff" : "var(--ink)",
                      boxShadow: m.role === "user"
                        ? "0 2px 8px rgba(108,92,247,0.25)"
                        : "none",
                    }}
                  >
                    {m.text}
                  </span>
                </div>
              ))}

              {/* Typing indicator */}
              {thinking && (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 7 }}>
                  <img src="/bot.svg" alt="" style={{ width: 22, height: 22, objectFit: "contain", flexShrink: 0, marginBottom: 2 }} />
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "10px 14px",
                      borderRadius: "14px 14px 14px 4px",
                      background: "var(--chip)",
                    }}
                  >
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        style={{
                          width: 5, height: 5, borderRadius: "50%",
                          background: "var(--muted)", display: "block",
                          animation: "dotPulse 1.1s ease-in-out infinite",
                          animationDelay: `${d * 0.18}s`,
                        }}
                      />
                    ))}
                  </span>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>
        )}

        {/* Input bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "transparent",
            border: "none",
            padding: "9px 14px",
            borderRadius: 999,
            width: "100%",
            position: "relative",
          }}
        >
          {/* glow halo */}
          <div
            style={{
              position: "absolute",
              inset: "-22px -32px",
              background:
                "radial-gradient(closest-side, rgba(255,170,200,0.45), transparent 70%), radial-gradient(closest-side at 80% 50%, rgba(180,200,255,0.35), transparent 70%)",
              zIndex: -1,
              borderRadius: 999,
              filter: "blur(10px)",
            }}
          />
          {/* vertical separator line */}
          <div style={{ width: 2, height: 16, background: "#ff7a9a", flexShrink: 0, borderRadius: 2 }} />
          <input
            type="text"
            placeholder="Ask me about this report…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              flex: 1,
              minWidth: 0,
              fontFamily: "var(--font-geist-mono)",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--ink)",
            }}
          />
          <button
            onClick={send}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              padding: 0,
            }}
          >
            <img src="/bot.svg" alt="" style={{ width: 44, height: 44, objectFit: "contain", display: "block" }} />
          </button>
        </div>
      </motion.div>
    </>
  );
}
