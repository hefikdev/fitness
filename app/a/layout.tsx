import { TRPCProvider } from "@/lib/trpc/client";
import { verifySession } from "@/lib/dal";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await verifySession();

  return <TRPCProvider>{children}</TRPCProvider>;
}
