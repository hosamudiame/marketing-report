"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TrafficCard from "@/components/cards/TrafficCard";
import ChannelMixCard from "@/components/cards/ChannelMixCard";
import PerformanceCard from "@/components/cards/PerformanceCard";
import RevenueCard from "@/components/cards/RevenueCard";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

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

const SUGGESTIONS = [
  "What drove signups this week?",
  "How is ROAS trending?",
  "Which channel is performing best?",
  "What's the retention rate?",
  "Give me a weekly highlight summary",
  "How is the funnel performing?",
  "What's happening with outflows?",
  "Compare this week to last week",
];

interface ChatMsg { role: "user" | "ai"; text: string }

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.55, delay, ease },
});


export default function GeneralSummaryPage() {
  const [tab, setTab] = useState<"dashboard" | "chat">("dashboard");
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [hoveringDownload, setHoveringDownload] = useState(false);
  const [copied, setCopied] = useState(false);

  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, thinking]);
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  function send(text?: string) {
    const q = (text ?? input).trim();
    if (!q || thinking) return;
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setThinking(true);
    timerRef.current = setTimeout(() => {
      setMsgs((m) => [...m, { role: "ai", text: getReply(q) }]);
      setThinking(false);
    }, 900);
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadReport() {
    if (downloading || downloaded) return;
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    }, 1800);
  }

  return (
    <>
      {/* Page header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          alignItems: "flex-start",
          columnGap: 14,
          marginBottom: 22,
          maxWidth: 960,
          width: "100%",
        }}
      >
        <div>
          <motion.h1
            {...fadeUp(0)}
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontWeight: 600,
              fontSize: 28,
              margin: "0 0 10px",
              color: "var(--ink)",
              letterSpacing: "0.01em",
            }}
          >
            Marketing Report
          </motion.h1>

          <motion.div
            {...fadeUp(0.08)}
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontWeight: 500,
              fontSize: 16,
              color: "var(--muted)",
              marginBottom: 18,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            For the period
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3790CC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", margin: "0 2px", flexShrink: 0 }}>
              <path d="M3.75 7.75C3.75 6.09315 5.09315 4.75 6.75 4.75H17.25C18.9069 4.75 20.25 6.09315 20.25 7.75V17.25C20.25 18.9069 18.9069 20.25 17.25 20.25H6.75C5.09315 20.25 3.75 18.9069 3.75 17.25V7.75Z" />
              <path d="M7.75 4.75V2.75" />
              <path d="M16.25 4.75V2.75" />
              <path d="M9.25 12.7749L10.9 14.4249L14.75 10.575" />
            </svg>
            Apr 19th – 25th, 2026
          </motion.div>

          {/* Tabs */}
          <motion.div
            {...fadeUp(0.16)}
            style={{
              display: "inline-flex",
              gap: 2,
              background: "var(--chip)",
              padding: "2px 3px",
              borderRadius: 999,
              marginBottom: 26,
              position: "relative",
            }}
          >
            {(["dashboard", "chat"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  position: "relative",
                  zIndex: 1,
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 11.5,
                  padding: "4px 14px",
                  borderRadius: 999,
                  color: tab === t ? "var(--ink)" : "var(--muted)",
                  cursor: "pointer",
                  border: "none",
                  background: "transparent",
                  boxShadow: "none",
                  textTransform: "capitalize",
                  transition: "color 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {tab === t && (
                  <motion.span
                    layoutId="summary-tab-pill"
                    transition={{ type: "spring", stiffness: 520, damping: 38 }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 999,
                      background: "var(--tab-pill)",
                      boxShadow: "var(--tooltip-shadow)",
                    }}
                  />
                )}
                <span style={{ position: "relative", zIndex: 1 }}>{t}</span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* Header actions */}
        <motion.div
          {...fadeUp(0.24)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 8,
            width: "100%",
          }}
        >
          <div style={{ position: "relative", display: "inline-flex" }}>

          <button
            onClick={copyLink}
            title="Copy link"
            style={{
              width: 34,
              height: 34,
              borderRadius: 999,
              background: copied ? "var(--accent)" : "var(--chip)",
              border: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: copied ? "#fff" : "var(--ink)",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => { if (!copied) { const el = e.currentTarget as HTMLElement; const isDark = document.documentElement.classList.contains("dark"); el.style.background = isDark ? "var(--accent)" : "#ede9ff"; el.style.color = isDark ? "#fff" : "var(--accent)"; } }}
            onMouseLeave={(e) => { if (!copied) { const el = e.currentTarget as HTMLElement; el.style.background = "var(--chip)"; el.style.color = "var(--ink)"; } }}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.svg
                  key="check"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M4.75 12.75L9.25 17.25L19.25 6.75" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="link"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ transform: "scaleX(-1)" }}
                >
                  <path d="M9.75027 5.52371L10.7168 4.55722C13.1264 2.14759 17.0332 2.14759 19.4428 4.55722C21.8524 6.96684 21.8524 10.8736 19.4428 13.2832L18.4742 14.2519M5.52886 9.74513L4.55722 10.7168C2.14759 13.1264 2.1476 17.0332 4.55722 19.4428C6.96684 21.8524 10.8736 21.8524 13.2832 19.4428L14.2478 18.4782M9.5 14.5L14.5 9.5" />
                </motion.svg>
              )}
            </AnimatePresence>
          </button>
          </div>
          <button
            onClick={downloadReport}
            onMouseEnter={() => setHoveringDownload(true)}
            onMouseLeave={() => setHoveringDownload(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: downloaded ? "var(--accent)" : downloading ? "var(--accent-soft)" : hoveringDownload ? "var(--accent)" : "var(--btn-primary)",
              color: (downloaded || (!downloading && hoveringDownload)) ? "#fff" : downloading ? "var(--accent)" : "var(--btn-primary-text)",
              fontFamily: "var(--font-geist-mono)",
              fontSize: 12.5,
              padding: "9px 14px 9px 16px",
              borderRadius: 999,
              border: "none",
              cursor: downloading || downloaded ? "not-allowed" : "pointer",
              transition: "background 0.15s",
              opacity: downloading ? 0.8 : 1,
            }}
          >
            {downloading ? "Downloading..." : downloaded ? "Downloaded" : "Download report"}
            {downloading ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite" }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                <style>{`@keyframes spin { from { transform-origin: center; transform: rotate(0deg); } to { transform-origin: center; transform: rotate(360deg); } }`}</style>
              </svg>
            ) : downloaded ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.75 12.75L9.25 17.25L19.25 6.75" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.38803 19.923L5.72852 19.2548H5.72852L5.38803 19.923ZM4.07698 18.612L3.40873 18.9525H3.40873L4.07698 18.612ZM19.923 18.612L19.2548 18.2715V18.2715L19.923 18.612ZM18.612 19.923L18.2715 19.2548H18.2715L18.612 19.923ZM19.923 5.38803L19.2548 5.72852V5.72852L19.923 5.38803ZM18.612 4.07698L18.9525 3.40873V3.40873L18.612 4.07698ZM4.07698 5.38803L4.74524 5.72852L4.07698 5.38803ZM5.38803 4.07698L5.72852 4.74524L5.38803 4.07698ZM19.5 8.55V15.45H21V8.55H19.5ZM15.45 19.5H8.55V21H15.45V19.5ZM4.5 15.45V8.55H3V15.45H4.5ZM8.55 4.5H15.45V3H8.55V4.5ZM8.55 19.5C7.69755 19.5 7.10331 19.4994 6.64068 19.4616C6.1868 19.4245 5.92604 19.3554 5.72852 19.2548L5.04754 20.5913C5.49175 20.8176 5.97189 20.912 6.51853 20.9566C7.05641 21.0006 7.7223 21 8.55 21V19.5ZM3 15.45C3 16.2777 2.99942 16.9436 3.04336 17.4815C3.08803 18.0281 3.18238 18.5082 3.40873 18.9525L4.74524 18.2715C4.6446 18.074 4.57546 17.8132 4.53838 17.3593C4.50058 16.8967 4.5 16.3025 4.5 15.45H3ZM5.72852 19.2548C5.30516 19.039 4.96095 18.6948 4.74524 18.2715L3.40873 18.9525C3.76825 19.6581 4.34193 20.2317 5.04754 20.5913L5.72852 19.2548ZM19.5 15.45C19.5 16.3025 19.4994 16.8967 19.4616 17.3593C19.4245 17.8132 19.3554 18.074 19.2548 18.2715L20.5913 18.9525C20.8176 18.5082 20.912 18.0281 20.9566 17.4815C21.0006 16.9436 21 16.2777 21 15.45H19.5ZM15.45 21C16.2777 21 16.9436 21.0006 17.4815 20.9566C18.0281 20.912 18.5082 20.8176 18.9525 20.5913L18.2715 19.2548C18.074 19.3554 17.8132 19.4245 17.3593 19.4616C16.8967 19.4994 16.3025 19.5 15.45 19.5V21ZM19.2548 18.2715C19.0391 18.6948 18.6948 19.039 18.2715 19.2548L18.9525 20.5913C19.6581 20.2317 20.2318 19.6581 20.5913 18.9525L19.2548 18.2715ZM21 8.55C21 7.7223 21.0006 7.05641 20.9566 6.51853C20.912 5.97189 20.8176 5.49175 20.5913 5.04754L19.2548 5.72852C19.3554 5.92604 19.4245 6.1868 19.4616 6.64068C19.4994 7.10331 19.5 7.69755 19.5 8.55H21ZM15.45 4.5C16.3025 4.5 16.8967 4.50058 17.3593 4.53838C17.8132 4.57546 18.074 4.6446 18.2715 4.74524L18.9525 3.40873C18.5082 3.18238 18.0281 3.08803 17.4815 3.04336C16.9436 2.99942 16.2777 3 15.45 3V4.5ZM20.5913 5.04754C20.2318 4.34193 19.6581 3.76825 18.9525 3.40873L18.2715 4.74524C18.6948 4.96095 19.0391 5.30516 19.2548 5.72852L20.5913 5.04754ZM4.5 8.55C4.5 7.69755 4.50058 7.10331 4.53838 6.64068C4.57546 6.1868 4.6446 5.92604 4.74524 5.72852L3.40873 5.04754C3.18238 5.49175 3.08803 5.97189 3.04336 6.51853C2.99942 7.05641 3 7.7223 3 8.55H4.5ZM8.55 3C7.7223 3 7.05641 2.99942 6.51853 3.04336C5.97189 3.08803 5.49175 3.18238 5.04754 3.40873L5.72852 4.74524C5.92604 4.6446 6.1868 4.57546 6.64068 4.53838C7.10331 4.50058 7.69755 4.5 8.55 4.5V3ZM4.74524 5.72852C4.96095 5.30516 5.30516 4.96095 5.72852 4.74524L5.04754 3.40873C4.34193 3.76825 3.76825 4.34193 3.40873 5.04754L4.74524 5.72852Z" fill="currentColor"/>
                <path d="M9 20.25V21H10.5V20.25H9ZM10.5 3.75V3H9V3.75H10.5ZM10.5 20.25V3.75H9V20.25H10.5Z" fill="currentColor"/>
              </svg>
            )}
          </button>
        </motion.div>
      </div>

      {tab === "chat" && <style>{`#chat-dock { display: none !important; } #bottom-blur { display: none !important; }`}</style>}

      {/* Chart grid / Chat panel */}
      <AnimatePresence mode="wait">
        {tab === "dashboard" ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 6, filter: "blur(1.5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, filter: "blur(1px)" }}
            transition={{ duration: 0.16, ease }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gridAutoRows: "470px",
              maxWidth: 960,
              width: "100%",
              gap: 20,
            }}
          >
            {([TrafficCard, ChannelMixCard, PerformanceCard, RevenueCard] as const).map((Card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.55, delay: 0.3 + i * 0.08, ease }}
                style={{ display: "flex", flexDirection: "column", height: "100%" }}
              >
                <Card />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 6, filter: "blur(1.5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, filter: "blur(1px)" }}
            transition={{ duration: 0.16, ease }}
            style={{ maxWidth: 954, width: "100%", display: "flex", flexDirection: "column", height: 680 }}
          >
            <style>{`
              @keyframes aiDotPulse {
                0%,80%,100%{opacity:.28;transform:translateY(0)}
                40%{opacity:1;transform:translateY(-2px)}
              }
              .chat-thread::-webkit-scrollbar { display: none; }
              .chat-thread { scrollbar-width: none; }
            `}</style>

            {/* Empty state */}
            {msgs.length === 0 && !thinking && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease }}
                style={{ display: "flex", flexDirection: "column", gap: 28, paddingBottom: 40 }}
              >
                <div>
                  <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 22, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.02em", marginBottom: 8 }}>
                    What do you want to know?
                  </div>
                  <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
                    Ask me anything about sign-ups, revenue, ROAS, channel mix, or retention for Apr 19–25.
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {SUGGESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      style={{
                        fontFamily: "var(--font-geist-mono)",
                        fontSize: 12.5,
                        padding: "9px 16px",
                        borderRadius: 999,
                        background: "var(--card)",
                        border: "1px solid var(--line)",
                        color: "var(--ink-2)",
                        cursor: "pointer",
                        transition: "border-color 0.15s, color 0.15s",
                      }}
                      onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = "var(--accent)"; el.style.color = "var(--accent)"; }}
                      onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = "var(--line)"; el.style.color = "var(--ink-2)"; }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Message thread */}
            {(msgs.length > 0 || thinking) && (
              <div className="chat-thread" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingBottom: 24 }}>
                {msgs.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease }}
                    style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}
                  >
                    <span style={{
                      fontFamily: "var(--font-geist-mono)",
                      fontSize: 13,
                      lineHeight: 1.6,
                      letterSpacing: "-0.01em",
                      padding: "10px 14px",
                      borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      maxWidth: "72%",
                      background: m.role === "user" ? "var(--accent)" : "var(--card)",
                      border: "none",
                      color: m.role === "user" ? "#fff" : "var(--ink)",
                      wordBreak: "break-word",
                    }}>
                      {m.text}
                    </span>
                  </motion.div>
                ))}
                {thinking && (
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "10px 14px",
                      borderRadius: "16px 16px 16px 4px",
                      background: "var(--card)",
                      border: "1px solid var(--line)",
                    }}>
                      {[0,1,2].map((d) => (
                        <span key={d} style={{ width: 4, height: 4, borderRadius: "50%", background: "#bbb", display: "block", animation: "aiDotPulse 1s ease-in-out infinite", animationDelay: `${d * 0.15}s` }} />
                      ))}
                    </span>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}

            {/* Input container */}
            <div style={{ marginTop: "auto", position: "relative", zIndex: 20 }}>
              <div style={{
                background: "var(--card)",
                border: "1px solid var(--line)",
                borderRadius: 16,
                padding: "12px 14px 10px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}>
                <input
                  type="text"
                  placeholder="Ask anything about this report…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  style={{
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 13,
                    color: "var(--ink)",
                    padding: "2px 4px",
                    width: "100%",
                  }}
                />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {/* Left: attachment + audio */}
                  <div style={{ display: "flex", gap: 2 }}>
                    <button
                      title="Attach file"
                      style={inputIconBtn}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--ink)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.1529 11.4118L12.3529 20.2118C10.2941 22.2706 6.97059 22.2706 4.91176 20.2118C2.85294 18.1529 2.85294 14.8294 4.91176 12.7706L13.7118 3.97059C15.0588 2.62353 17.2353 2.62353 18.5824 3.97059C19.9294 5.31765 19.9294 7.49412 18.5824 8.84118L9.78235 17.6412C9.10882 18.3147 8.02059 18.3147 7.34706 17.6412C6.67353 16.9676 6.67353 15.8794 7.34706 15.2059L15.1765 7.37647" />
                      </svg>
                    </button>
                    <button
                      title="Voice input"
                      style={inputIconBtn}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--ink)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="2" width="6" height="11" rx="3" />
                        <path d="M5 10.5C5 14.0899 7.91015 17 11.5 17H12.5C16.0899 17 19 14.0899 19 10.5" />
                        <path d="M12 17V21" />
                        <path d="M9 21h6" />
                      </svg>
                    </button>
                  </div>

                  {/* Right: send */}
                  <button
                    onClick={() => send()}
                    style={{
                      width: 30, height: 30, borderRadius: 999,
                      background: input.trim() && !thinking ? "var(--accent)" : "var(--line)",
                      border: "none",
                      cursor: input.trim() && !thinking ? "pointer" : "default",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, transition: "background 0.15s",
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke={input.trim() && !thinking ? "#fff" : "var(--muted-2)"}
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const inputIconBtn: React.CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: 8,
  background: "none",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--muted)",
  transition: "color 0.15s",
  padding: 0,
};
