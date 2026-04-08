"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Dumbbell, Weight, Utensils, Settings, LogOut, BarChart3, BookOpen, Sparkles, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

const navItems = [
  { href: "/a/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/a/analytics", label: "Analizy", icon: BarChart3 },
  { href: "/a/plans", label: "Plany", icon: Dumbbell },
  { href: "/a/workout-library", label: "Biblioteka", icon: BookOpen },
  { href: "/a/nutrition", label: "Odżywianie", icon: Leaf },
  { href: "/a/diet", label: "Dieta", icon: Utensils },
  { href: "/a/tips", label: "Porady", icon: Sparkles },
  { href: "/a/weight", label: "Waga", icon: Weight },
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

// Bottom navigation bar shown only on mobile
const mobileNavItems = [
  { href: "/a/dashboard", label: "Główna", icon: LayoutDashboard },
  { href: "/a/analytics", label: "Analizy", icon: BarChart3 },
  { href: "/a/plans", label: "Plany", icon: Dumbbell },
  { href: "/a/weight", label: "Waga", icon: Weight },
  { href: "/a/diet", label: "Dieta", icon: Utensils },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-around h-16 px-2">
        {mobileNavItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || (href !== "/a/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors min-w-0",
                active ? "text-[var(--neon)]" : "text-muted-foreground"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
