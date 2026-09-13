import { type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck, type LucideIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export function AppShell({
  navItems,
  sectionLabel,
  children,
}: {
  navItems: NavItem[];
  sectionLabel: string;
  children: ReactNode;
}) {
  const { user, isAdmin, signout } = useAuth();
  const navigate = useNavigate();

  const handleSignout = async () => {
    await signout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="flex w-60 shrink-0 flex-col border-r border-line bg-surface">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-ink text-white">
            <ShieldCheck size={16} />
          </div>
          <div>
            <p className="font-display text-sm font-semibold leading-none text-ink">SecureVault</p>
            <p className="text-[11px] leading-none text-muted mt-1">{sectionLabel}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-ink text-white" : "text-muted hover:bg-black/[0.04] hover:text-ink",
                )
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-line p-3">
          <div className="flex items-center gap-2.5 rounded-sm px-2 py-2">
            <Avatar name={user?.id.slice(0, 2) ?? "U"} size={30} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-ink">{isAdmin ? "Administrator" : "Member"}</p>
              <p className="truncate text-[11px] text-muted">{user?.id.slice(0, 8)}…</p>
            </div>
            <button onClick={handleSignout} title="Sign out" className="text-muted hover:text-danger">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
