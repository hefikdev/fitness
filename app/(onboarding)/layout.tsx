"use client";

import { TRPCProvider } from "@/lib/trpc/client";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TRPCProvider>{children}</TRPCProvider>;
}