"use client";

import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import useTheme from "next-theme";

export default function DashProfile() {
  const { theme } = useTheme();
  console.log(theme);
  return (
    <div className="flex justify-center items-center w-full">
      <UserProfile
        appearance={{ baseTheme: theme === "dark" ? dark : undefined }}
        routing="hash"
      />
    </div>
  );
}
