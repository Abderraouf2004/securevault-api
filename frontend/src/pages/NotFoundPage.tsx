import { Link } from "react-router-dom";
import { Button } from "@/components/ui";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-center">
      <p className="font-display text-5xl font-semibold text-ink">404</p>
      <p className="text-sm text-muted">This page doesn't exist.</p>
      <Link to="/">
        <Button variant="secondary" size="sm">
          Back home
        </Button>
      </Link>
    </div>
  );
}
