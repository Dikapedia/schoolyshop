"use client";
import { useEffect } from "react";
import { initializeLocalData } from "@/api/bootstrap";

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeLocalData();
  }, []);
  return <>{children}</>;
}
