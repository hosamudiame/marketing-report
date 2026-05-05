"use client";

import { useEffect } from "react";
import { applyTheme, getInitialDark } from "@/lib/theme";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyTheme(getInitialDark());
  }, []);

  return <>{children}</>;
}
