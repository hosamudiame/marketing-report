"use client";

import { useState, useEffect } from "react";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";
import ChatDock from "@/components/ChatDock";

const SIDEBAR_W = 240;
const LEFT_MAX  = 230;   // left gutter at 1440px
const DESIGN_W  = 1440;
const SCALE     = 0.75;
const LEFT_MIN  = 24;    // sidebar never closer than this to the left edge

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [vw, setVw] = useState(DESIGN_W);

  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Left margin shrinks linearly as viewport narrows, never below LEFT_MIN
  const sidebarLeft   = Math.max(LEFT_MIN, LEFT_MAX - (DESIGN_W - vw));
  const spacer        = sidebarLeft + SIDEBAR_W;
  // Logical width so that (contentLogical * SCALE) fills exactly (vw - spacer) px
  const contentLogical = Math.round((vw - spacer) / SCALE);

  return (
    <>
      <Topbar />
      <div style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        maxWidth: DESIGN_W,
        margin: "0 auto",
        position: "relative",
      }}>
        {/* overflowX:hidden suppresses the layout-vs-visual gap that transform:scale creates */}
        <div style={{ display: "flex", overflowX: "hidden" }}>

          {/* Spacer — shrinks with viewport so content keeps its width */}
          <div style={{ width: spacer, flexShrink: 0 }} />

          {/* Sidebar — fixed, left position slides proportionally */}
          <div style={{
            position: "fixed",
            left: `calc(max(0px, (100vw - ${DESIGN_W}px) / 2) + ${sidebarLeft}px)`,
            top: 0,
            width: SIDEBAR_W,
            height: "100vh",
            zIndex: 20,
          }}>
            <div style={{
              transform: `scale(${SCALE}) translateZ(0)`,
              transformOrigin: "top left",
              width: SIDEBAR_W,
              paddingTop: 134,
            }}>
              <Sidebar />
            </div>
          </div>

          {/* Content — flexShrink:0 ensures the explicit width wins over flex */}
          <div style={{
            flexShrink: 0,
            paddingTop: 134,
            width: contentLogical,
            transform: `scale(${SCALE})`,
            transformOrigin: "top left",
            gap: "0 48px",
            position: "relative",
            marginBottom: "calc(-25vh - 20px)",
          }}>
            <main style={{ paddingLeft: 0, paddingRight: 0, minWidth: 0, paddingBottom: 0 }}>
              {children}
            </main>
          </div>
        </div>

        <div id="bottom-blur" style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 100,
          background: "linear-gradient(to bottom, transparent, var(--bg))",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          maskImage: "linear-gradient(to bottom, transparent, black 60%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 60%)",
          pointerEvents: "none",
          zIndex: 10,
          overflow: "hidden",
        }} />
        <ChatDock />
      </div>
    </>
  );
}
