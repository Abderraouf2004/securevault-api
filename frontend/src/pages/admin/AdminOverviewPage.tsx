import { Users, ShieldCheck, UserCog } from "lucide-react";
import { Card, PageLoader } from "@/components/ui";
import { useUsers } from "@/hooks/useUsers";

export default function AdminOverviewPage() {
  const { data: users, isLoading } = useUsers();

  if (isLoading) return <PageLoader />;

  const total = users?.length ?? 0;
  const admins = users?.filter((u) => u.roleName === "ADMIN").length ?? 0;
  const members = total - admins;
  const adminPct = total ? Math.round((admins / total) * 100) : 0;

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Overview</h1>
        <p className="mt-1 text-sm text-muted">A snapshot of who has access to the vault.</p>
      </header>

      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={Users} label="Total users" value={total} />
        <StatCard icon={UserCog} label="Members" value={members} />
        <StatCard icon={ShieldCheck} label="Administrators" value={admins} />
      </div>

      <Card className="mt-4 p-6">
        <p className="text-sm font-medium text-ink">Role distribution</p>
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-black/5">
          <div className="h-full bg-vault-500" style={{ width: `${adminPct}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>{adminPct}% administrators</span>
          <span>{100 - adminPct}% members</span>
        </div>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) {
  return (
    <Card className="p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-vault-50 text-vault-600">
        <Icon size={16} />
      </div>
      <p className="mt-4 font-display text-3xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </Card>
  );
}
