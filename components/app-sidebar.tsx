"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Dumbbell, Weight, Utensils, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

const navItems = [
  { href: "/a/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/a/plans", label: "Plany", icon: Dumbbell },
  { href: "/a/weight", label: "Waga", icon: Weight },
  { href: "/a/diet", label: "Dieta", icon: Utensils },
  { href: "/a/settings", label: "Ustawienia", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
  }

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen border-r border-border shrink-0">
      <div className="h-16 flex items-center px-5 border-b border-border">
        <span className="heading text-2xl neon">FitForge</span>
      </div>
      <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === href || (href !== "/a/dashboard" && pathname.startsWith(href))
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-border">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <LogOut size={18} />
          Wyloguj się
        </button>
      </div>
    </aside>
  );
}
