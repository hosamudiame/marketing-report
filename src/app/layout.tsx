import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Marketing Report",
  description: "Weekly marketing performance dashboard",
};

const themeScript = `
(function(){
  var dark={
    "--bg":"#0c0c0c","--bg-soft":"#131313","--card":"#171717","--chip":"#242424",
    "--line":"#2a2a2a","--line-2":"#1e1e1e","--ink":"#eeeeee","--ink-2":"#c4c4c4",
    "--muted":"#6a6a6a","--muted-2":"#4a4a4a","--mint":"#172917","--mint-ink":"#4ade80",
    "--accent":"#8b7cf8","--accent-soft":"#2a1f6e","--card-border":"rgba(255,255,255,0.07)",
    "--tab-pill":"#2e2e2e","--btn-primary":"#fff","--btn-primary-text":"#0c0c0c",
    "--tooltip-shadow":"0 4px 20px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.4)"
  };
  var saved=localStorage.getItem("theme");
  var isDark=saved?saved==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;
  if(isDark){
    var root=document.documentElement;
    root.classList.add("dark");
    Object.keys(dark).forEach(function(k){root.style.setProperty(k,dark[k]);});
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
