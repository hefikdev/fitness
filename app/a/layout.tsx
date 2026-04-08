import { TRPCProvider } from "@/lib/trpc/client";
import { verifySession } from "@/lib/dal";
import { AppSidebar, MobileNav } from "@/components/app-sidebar";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await verifySession();

  return (
    <TRPCProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex-1 min-h-screen overflow-auto pb-16 md:pb-0">
          {children}
        </div>
      </div>
      <MobileNav />
    </TRPCProvider>
  );
}
