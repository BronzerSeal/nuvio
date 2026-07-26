"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import React from "react";

export function Logo() {
  const { theme, systemTheme } = useTheme();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  const isDarkTheme = React.useMemo(() => {
    if (!mounted) return true;
    const currentTheme = theme === "system" ? systemTheme : theme;
    return currentTheme === "dark";
  }, [theme, systemTheme, mounted]);

  if (!mounted) {
    return (
      <Image
        src="/logo-text.png"
        width={160}
        height={100}
        alt="Logo"
        className="mb-2 z-10"
        priority
      />
    );
  }

  return (
    <Image
      src={isDarkTheme ? "/logo-text-white.png" : "/logo-text.png"}
      width={160}
      height={100}
      alt="Logo"
      className="mb-2 z-10"
      priority
    />
  );
}
