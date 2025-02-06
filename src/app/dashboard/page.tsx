"use client";

import { useEffect, useState } from "react";
import DashSidebar from "@/components/dash-sidebar";
import DashProfile from "@/components/dash-profile";
import DashPosts from "@/components/dash-posts";
import DashUsers from "@/components/dash-users";
import DashboardComp from "@/components/dashboard-comp";
import { useSearchParams } from "next/navigation";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [searchParams]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile... */}
      {tab === "profile" && <DashProfile />}

      {tab === "posts" && <DashPosts />}

      {tab === "users" && <DashUsers />}
      {tab === "dash" && <DashboardComp />}
    </div>
  );
}
