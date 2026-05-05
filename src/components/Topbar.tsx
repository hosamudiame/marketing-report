"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getInitialDark } from "@/lib/theme";
import { motion, AnimatePresence } from "framer-motion";

const PULL_THRESHOLD = 72;

export default function Topbar() {
  const [seconds, setSeconds] = useState(0);
  const [pulling, setPulling] = useState(false);
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(getInitialDark());
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  const startY = useRef<number | null>(null);
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => {
        const next = s + 1;
        if (next >= 30 && next % 30 === 0) {
          setShowBanner(true);
          if (bannerTimer.current) clearTimeout(bannerTimer.current);
          bannerTimer.current = setTimeout(() => setShowBanner(false), 30000);
        }
        return next;
      });
    }, 1000);
    return () => {
      clearInterval(id);
      if (bannerTimer.current) clearTimeout(bannerTimer.current);
    };
  }, []);

  const label =
    seconds < 60
      ? `Refreshed ${seconds}s ago`
      : `Refreshed ${Math.floor(seconds / 60)}m ago`;

  const triggerRefresh = useCallback(() => {
    setRefreshing(true);
    setPullY(0);
    setPulling(false);
    setTimeout(() => {
      setSeconds(0);
      setRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) startY.current = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (startY.current === null) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta > 0) {
        setPulling(true);
        setPullY(Math.min(delta * 0.45, PULL_THRESHOLD + 20));
      }
    };
    const onTouchEnd = () => {
      if (pullY >= PULL_THRESHOLD) triggerRefresh();
      else { setPullY(0); setPulling(false); }
      startY.current = null;
    };

    const onMouseDown = (e: MouseEvent) => {
      if (window.scrollY === 0 && e.clientY < 60) startY.current = e.clientY;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (startY.current === null || e.buttons !== 1) return;
      const delta = e.clientY - startY.current;
      if (delta > 0) {
        setPulling(true);
        setPullY(Math.min(delta * 0.45, PULL_THRESHOLD + 20));
      }
    };
    const onMouseUp = () => {
      if (startY.current !== null) {
        if (pullY >= PULL_THRESHOLD) triggerRefresh();
        else { setPullY(0); setPulling(false); }
        startY.current = null;
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [pullY, triggerRefresh]);

  const progress = Math.min(pullY / PULL_THRESHOLD, 1);
  const rotation = progress * 270;

  return (
    <>
      {/* Pull indicator */}
      <AnimatePresence>
        {(pulling || refreshing) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: pullY > 0 ? pullY : 8 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              position: "fixed",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              background: "#fff",
              borderRadius: "50%",
              boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
              pointerEvents: "none",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={progress >= 1 || refreshing ? "#4da765" : "#b8b8b2"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: `rotate(${refreshing ? 0 : rotation}deg)`,
                transition: refreshing ? "none" : "transform 0.05s linear",
                animation: refreshing ? "spin 0.7s linear infinite" : "none",
              }}
            >
              <path d="M21 12a9 9 0 1 1-3-6.7" />
              <path d="M21 4v5h-5" />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Topbar */}
      <AnimatePresence>
      {showBanner && (
      <motion.div
        initial={{ opacity: 0, y: -21 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -21 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 21,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: dark ? "#0c1f0e" : "#e8f6e9",
          zIndex: 100,
        }}
      >
        <AnimatePresence>
          {showBanner && (
            <motion.span
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: dark ? "#4ade80" : "#4da765",
                fontFamily: "var(--font-geist-mono)",
                fontSize: 10,
                lineHeight: 1,
                padding: "0 10px",
                borderRadius: 999,
                letterSpacing: "0.01em",
              }}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke={dark ? "#4ade80" : "#4da765"}
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  opacity: 0.95,
                  transform: "translateY(-0.5px)",
                  animation: refreshing ? "spin 0.7s linear infinite" : "none",
                }}
              >
                <path d="M21 12a9 9 0 1 1-3-6.7" />
                <path d="M21 4v5h-5" />
              </svg>
              {refreshing ? "Refreshing..." : label}
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={() => {
            if (bannerTimer.current) clearTimeout(bannerTimer.current);
            setShowBanner(false);
          }}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 2,
            display: "flex",
            alignItems: "center",
            color: dark ? "#4ade80" : "#4da765",
            opacity: 0.6,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}
