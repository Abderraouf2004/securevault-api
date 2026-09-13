import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { apiClient, tokenStore, API_URL } from "@/lib/api-client";
import { decodeToken } from "@/lib/jwt";
import type { AuthTokens, TokenPayload } from "@/types";

interface SignupInput {
  name: string;
  email: string;
  password: string;
}
interface SigninInput {
  email: string;
  password: string;
}

interface AuthContextValue {
  user: TokenPayload | null;
  isAdmin: boolean;
  isLoading: boolean;
  signin: (input: SigninInput) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  signout: () => Promise<void>;
  applyTokens: (tokens: AuthTokens) => Promise<void>;
  googleSigninUrl: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// The API never returns a role *name* to a signed-in user (only a roleId UUID —
// see UsersRepo.getAll/getById, which is the only place roleName is populated,
// and those routes are admin-only). Until the backend exposes something like
// GET /users/me with roleName, the only way an authenticated SPA can tell an
// admin from a regular user is to probe an admin-only route and read the status
// code. It's a workaround, not a design choice — see README "Backend changes needed".
async function probeIsAdmin(): Promise<boolean> {
  try {
    await apiClient.get("/users");
    return true;
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TokenPayload | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const hydrateFromToken = useCallback(async (accessToken: string) => {
    const payload = decodeToken(accessToken);
    setUser(payload);
    if (payload) setIsAdmin(await probeIsAdmin());
  }, []);

  useEffect(() => {
    const existing = tokenStore.getAccess();
    (existing ? hydrateFromToken(existing) : Promise.resolve()).finally(() => setIsLoading(false));
  }, [hydrateFromToken]);

  const applyTokens = useCallback(
    async (tokens: AuthTokens) => {
      tokenStore.set(tokens.accessToken, tokens.refreshToken);
      await hydrateFromToken(tokens.accessToken);
    },
    [hydrateFromToken],
  );

  const signup = useCallback(
    async (input: SignupInput) => {
      const res = await apiClient.post<{ data: AuthTokens }>("/auth/signup", input);
      await applyTokens(res.data.data);
    },
    [applyTokens],
  );

  const signin = useCallback(
    async (input: SigninInput) => {
      const res = await apiClient.post<{ data: AuthTokens }>("/auth/signin", input);
      await applyTokens(res.data.data);
    },
    [applyTokens],
  );

  const signout = useCallback(async () => {
    try {
      await apiClient.get("/auth/signout");
    } finally {
      tokenStore.clear();
      setUser(null);
      setIsAdmin(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoading,
        signin,
        signup,
        signout,
        applyTokens,
        googleSigninUrl: `${API_URL}/auth/oauth/google`,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
