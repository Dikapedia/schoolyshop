"use client";
import { useEffect } from "react";
import { initMockData } from "@/mockData";

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initMockData();
  }, []);
  return <>{children}</>;
}
