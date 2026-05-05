// ─── Weekly Traffic (Bar chart) ──────────────────────────────────────────────
// 25 data points — bi-weekly Apr 2025 → Apr 2026
export const trafficData = [
  { week: "Apr W1",  visits: 780000 },
  { week: "Apr W3",  visits: 720000 },
  { week: "May W1",  visits: 810000 },
  { week: "May W3",  visits: 650000 },
  { week: "Jun W1",  visits: 740000 },
  { week: "Jun W3",  visits: 860000 },
  { week: "Jul W1",  visits: 790000 },
  { week: "Jul W3",  visits: 680000 },
  { week: "Aug W1",  visits: 870000 },
  { week: "Aug W3",  visits: 760000 },
  { week: "Sep W1",  visits: 820000 },
  { week: "Sep W3",  visits: 700000 },
  { week: "Oct W1",  visits: 750000 },
  { week: "Oct W3",  visits: 900000 },
  { week: "Nov W1",  visits: 830000 },
  { week: "Nov W3",  visits: 720000 },
  { week: "Dec W1",  visits: 890000 },
  { week: "Dec W3",  visits: 770000 },
  { week: "Jan W1",  visits: 850000 },
  { week: "Jan W3",  visits: 730000 },
  { week: "Feb W1",  visits: 920000 },
  { week: "Feb W3",  visits: 800000 },
  { week: "Mar W1",  visits: 870000 },
  { week: "Mar W3",  visits: 750000 },
  { week: "Apr W1",  visits: 940000 },
];

export const trafficXLabels = [
  { index: 0,  label: "Apr" },
  { index: 4,  label: "Jun" },
  { index: 8,  label: "Aug" },
  { index: 12, label: "Oct" },
  { index: 16, label: "Dec" },
  { index: 20, label: "Feb" },
  { index: 24, label: "Apr" },
  { index: 48, label: "Apr" },
];

// ─── Acquisition Channel Mix (Pie chart) ─────────────────────────────────────
export const channelData = [
  { name: "Paid Social (FinTok)", value: 24, color: "#e53935" },
  { name: "Influencer Referrals", value: 22, color: "#ec407a" },
  { name: "Organic Search",       value: 18, color: "#26a69a" },
  { name: "Referral Program",     value: 14, color: "#42a5f5" },
  { name: "Direct / Brand",       value: 10, color: "#66bb6a" },
  { name: "Podcast Ads",          value:  7, color: "#26c6da" },
  { name: "Email Campaigns",      value:  3, color: "#ff7043" },
  { name: "Community (Discord)",  value:  2, color: "#f48fb1" },
];

// ─── Campaign Performance Radar ───────────────────────────────────────────────
export const radarData = [
  { metric: "Reach",        current: 10, benchmark: 65 },
  { metric: "Engagement",   current: 60, benchmark: 72 },
  { metric: "Conversion",   current: 65, benchmark: 65 },
  { metric: "Retention",    current: 58, benchmark: 74 },
  { metric: "Viral Coeff.", current: 55, benchmark: 60 },
  { metric: "AUM Growth",   current: 60, benchmark: 70 },
];

// ─── Revenue vs. CAC (Line chart) ────────────────────────────────────────────
// Monthly — trading fee revenue vs. blended customer acquisition cost (total spend)
export const revenueData = [
  { month: "Apr",  revenue: 110000000, adSpend: 210000000 },
  { month: "May",  revenue: 160000000, adSpend: 230000000 },
  { month: "Jun",  revenue: 140000000, adSpend: 200000000 },
  { month: "Jul",  revenue: 230000000, adSpend: 240000000 },
  { month: "Aug",  revenue: 280000000, adSpend: 260000000 },
  { month: "Sep",  revenue: 340000000, adSpend: 290000000 },
  { month: "Oct",  revenue: 420000000, adSpend: 350000000 },
  { month: "Nov",  revenue: 360000000, adSpend: 330000000 },
  { month: "Dec",  revenue: 390000000, adSpend: 360000000 },
  { month: "Jan",  revenue: 410000000, adSpend: 350000000 },
  { month: "Feb",  revenue: 450000000, adSpend: 360000000 },
  { month: "Mar",  revenue: 490000000, adSpend: 370000000 },
  { month: "Apr",  revenue: 540000000, adSpend: 380000000 },
];

// ─── Nav items ───────────────────────────────────────────────────────────────
export const navItems = [
  { label: "General summary", href: "/dashboard/general-summary" },
  { label: "Funnel", href: "/dashboard/funnel" },
  { label: "Weekly Highlight", href: "/dashboard/weekly-highlight" },
  { label: "Channels", href: "/dashboard/channels" },
  { label: "Influencers", href: "/dashboard/influencers" },
  { label: "Active Users", href: "/dashboard/active-users" },
  { label: "AUM", href: "/dashboard/aum" },
  { label: "Outflows", href: "/dashboard/outflows" },
  { label: "Community", href: "/dashboard/community" },
];

// ─── Formatters ──────────────────────────────────────────────────────────────
export function formatVisits(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}m`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}k`;
  return `${v}`;
}

export function formatMoney(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(0)}m`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}k`;
  return `$${v}`;
}
