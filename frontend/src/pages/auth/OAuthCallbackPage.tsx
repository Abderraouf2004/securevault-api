import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { PageLoader } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";

/**
 * Lands here after Google OAuth. Today the backend's /auth/oauth/google/callback
 * responds with raw JSON instead of redirecting back into the SPA, so this route
 * only works once that handler is changed to redirect to
 * `${FRONTEND_URL}/oauth/callback?accessToken=...` (a token-only response, no
 * refresh token — see README "Backend changes needed" for the exact patch).
 */
export default function OAuthCallbackPage() {
  const [params] = useSearchParams();
  const { applyTokens } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const accessToken = params.get("accessToken") ?? params.get("token");
    if (!accessToken) {
      setError("No token was returned from Google. Please try signing in again.");
      return;
    }
    applyTokens({ accessToken }).then(() => navigate("/app/documents", { replace: true }));
  }, [params, applyTokens, navigate]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <AlertTriangle className="text-danger" />
        <p className="max-w-sm text-sm text-muted">{error}</p>
        <a href="/login" className="text-sm font-medium text-ink underline underline-offset-2">
          Back to sign in
        </a>
      </div>
    );
  }

  return <PageLoader />;
}
