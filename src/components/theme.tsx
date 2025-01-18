"use client";

import useTheme from "next-theme";
import { useEffect, useState } from "react";

export default function Theme({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-gray-500 min-h-screen">
        {children}
      </div>
    </div>
  );
}
