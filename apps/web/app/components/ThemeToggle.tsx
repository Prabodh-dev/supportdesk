"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "helpdesk-theme";
const THEMES = ["day", "dusk"] as const;

type ThemeName = (typeof THEMES)[number];

function getStoredTheme(): ThemeName {
  if (typeof window === "undefined") return "day";
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "dusk" ? "dusk" : "day";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeName>("day");

  useEffect(() => {
    const initial = getStoredTheme();
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  function toggleTheme() {
    const next = theme === "day" ? "dusk" : "day";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <button className="btn btn--ghost theme-toggle" onClick={toggleTheme}>
      {theme === "day" ? "Switch to Dusk" : "Switch to Day"}
    </button>
  );
}
