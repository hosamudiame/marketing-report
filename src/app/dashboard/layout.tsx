import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";
import ChatDock from "@/components/ChatDock";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Topbar />
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", maxWidth: 1440, margin: "0 auto", position: "relative" }}>
      <div style={{ display: "flex" }}>
        {/* Spacer: holds layout space for the fixed sidebar */}
        <div style={{ marginLeft: 230, width: 240, flexShrink: 0 }} />

        {/* Sidebar: fixed so it always stays in view */}
        <div
          style={{
            position: "fixed",
            left: "calc(max(0px, (100vw - 1440px) / 2) + 230px)",
            top: 0,
            width: 240,
            height: "100vh",
            zIndex: 20,
          }}
        >
          <div style={{ transform: "scale(0.75) translateZ(0)", transformOrigin: "top left", width: 240, paddingTop: 134 }}>
            <Sidebar />
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            paddingTop: 134,
            width: "calc((min(100vw, 1440px) - 230px - 240px) / 0.75)",
            transform: "scale(0.75)",
            transformOrigin: "top left",
            gap: "0 48px",
            position: "relative",
            marginBottom: "calc(-25vh - 20px)",
          }}
        >
          <main style={{ paddingLeft: 0, paddingRight: 0, minWidth: 0, paddingBottom: 0 }}>
            {children}
          </main>
        </div>
      </div>
      <div
        id="bottom-blur"
        style={{
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
        }}
      />
      <ChatDock />
    </div>
    </>
  );
}
