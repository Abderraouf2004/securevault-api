import { ShieldCheck } from "lucide-react";
import { Avatar, Badge, Card } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, isAdmin } = useAuth();

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Profile</h1>
        <p className="mt-1 text-sm text-muted">Your account and session details.</p>
      </header>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Avatar name={user?.id.slice(0, 2) ?? "U"} size={48} />
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-ink">
              Account <Badge tone={isAdmin ? "brand" : "neutral"}>{isAdmin ? "Administrator" : "Member"}</Badge>
            </p>
            <p className="mt-1 font-mono text-xs text-muted">{user?.id}</p>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-2.5 rounded-sm bg-vault-50 px-4 py-3 text-xs text-vault-700">
          <ShieldCheck size={15} className="mt-0.5 shrink-0" />
          <p>
            The API doesn't expose a "my profile" endpoint yet, so this page can only show what's in your session
            token (your user ID and whether you're an admin). Add <code className="font-mono">GET /users/me</code>{" "}
            to the backend to show your name, email and avatar here too.
          </p>
        </div>
      </Card>
    </div>
  );
}
