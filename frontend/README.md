# SecureVault — Frontend

React + TypeScript frontend for the `securevault-api` backend (Express, Prisma, JWT + Google OAuth,
AES-256-GCM secret encryption, Argon2id password hashing).

Built and type-checked against your actual routes — not a generic template. Read the **Backend changes
needed** section below before running this; three small server-side fixes are required for parts of the
app to work correctly.

## Stack & why

| Choice | Reason |
|---|---|
| Vite + React + TypeScript | Fast dev loop, standard for a portfolio-grade SPA |
| React Router v6 | Route guards for `/login`, `/app/*` (member), `/admin/*` (admin) |
| TanStack Query | Server-state caching, invalidation, optimistic UX for documents/secrets/users — this is the kind of data-fetching layer interviewers expect on a CV project |
| Axios + interceptors | Auth header injection and **silent access-token refresh on 401** |
| React Hook Form | Form state/validation for auth, upload, and secret forms |
| Tailwind CSS | Utility styling with a small custom design-token layer (`tailwind.config.ts`) |

## Architecture

```
src/
  lib/
    api-client.ts     Axios instance: injects Bearer token, refreshes on 401, normalizes error messages
    jwt.ts             Client-side JWT payload decode (no verification — just reading claims)
    utils.ts           cn(), formatBytes(), formatDate(), initials()
  types/index.ts        Hand-written types mirroring the backend's Joi DTO schemas exactly
  context/
    AuthContext.tsx     signin/signup/signout, token bootstrap, admin-role detection (see note below)
    ToastContext.tsx    Global toast notifications
  hooks/                 useDocuments / useSecrets / useUsers — one React Query hook file per resource
  routes/Guards.tsx       ProtectedRoute, AdminRoute, PublicOnlyRoute
  components/
    ui.tsx               Button, Input, Field, Card, Badge, Avatar, EmptyState, Spinner
    Modal.tsx
    layout/AppShell.tsx   Sidebar + content shell shared by the member and admin areas
  pages/
    landing/LandingPage.tsx
    auth/  LoginPage, SignupPage, AuthLayout, OAuthCallbackPage
    client/ DocumentsPage, SecretsPage, ProfilePage      → the "client space"
    admin/  AdminOverviewPage, AdminUsersPage            → the "admin space"
```

### Route → endpoint map

| Route | Backend calls |
|---|---|
| `/` | none (marketing page) |
| `/login`, `/signup` | `POST /auth/signin`, `POST /auth/signup` |
| `/oauth/callback` | reads tokens from the URL after Google redirects back — **needs a backend patch, see below** |
| `/app/documents` | `GET/POST/PUT/DELETE /documents` |
| `/app/secrets` | `GET/POST/PUT/DELETE /secrets` |
| `/app/profile` | reads the JWT payload only — no `/users/me` endpoint exists yet |
| `/admin` , `/admin/users` | `GET /users`, `PUT /users/:id/role`, `DELETE /users/:id` |

Every authenticated request goes out with `Authorization: Bearer <accessToken>`. On a 401, the client
calls `POST /auth/refresh` with the stored refresh token, retries the original request once, and — if
that also fails — clears storage and redirects to `/login`.

## Backend changes needed

These aren't style preferences — the app can't fully work without them, because of how the current API
is wired:

**1. Enable CORS.** `app.ts` has it commented out:
```ts
// app.use(cors());
```
The frontend runs on a different origin (`localhost:5173` vs the API's `localhost:3000`), so every
request will currently be blocked by the browser. Add:
```ts
import cors from "cors";
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
```
(`credentials: true` matters because the Google OAuth flow relies on the `express-session` cookie.)

**2. Redirect the Google OAuth callback back to the SPA.** Right now
`GET /auth/oauth/google/callback` ends with `res.json({ ... token })` — so clicking "Continue with
Google" navigates the whole browser away from your React app and dumps raw JSON on screen. Change the
end of that handler to redirect back into the SPA instead:
```ts
return res.redirect(
  `${process.env.FRONTEND_URL}/oauth/callback?accessToken=${token}`,
);
```
The frontend's `/oauth/callback` route (`src/pages/auth/OAuthCallbackPage.tsx`) is already built to read
`accessToken` from the query string. Note the Google flow currently only issues a 1-hour access token and
no refresh token — sessions started via Google will need to sign in again after an hour until the
callback also issues a refresh token the same way `/auth/signin` does.

**3. Include the role name when returning users.** `UsersRepo.getAll` / `getUserById` currently do
`prisma.user.findMany()` / `findUnique()` with no `include`, so `roleName` is always `undefined` in the
API response even though `UserDTOSchema` declares it. That silently breaks the admin Users table (every
row shows "Member" and role-based stats read as zero admins). Fix:
```ts
const users = await prisma.user.findMany({ include: { role: true } });
return users.map((u) => ({ ...u, roleName: u.role.name }));
```
(same pattern in `getUserById`, and ideally add a small `GET /users/me` that any signed-in user — not
just admins — can call, returning their own `roleName`; right now a non-admin user has no way to learn
their own role name from the API at all, which is why the frontend's `AuthContext` currently detects
"is this user an admin?" by probing `GET /users` and checking whether it 200s or 403s. That works, but a
real endpoint is the correct fix.)

**4. (Optional, but Documents will feel incomplete without it) Add a file-download route.** The API
lets you upload and manage document *metadata* but never serves the file bytes back — there's no
`GET /documents/:id/file`. The frontend currently shows metadata only and says so explicitly in the UI.

## Setup

```bash
npm install
cp .env.example .env   # set VITE_API_URL if your API isn't on localhost:3000/api
npm run dev
```

Backend: run `securevault-api` with `npm run dev`, apply the patches above, and make sure `DATABASE_URL`,
`REDIS_URL`, `JWT_SECRET`, `SESSION_SECRET`, `SECRET_ENCRYPTION_KEY`, and the `GOOGLE_*` variables are
set (see its `.env.example`). Run `npx prisma db seed` once so the `USER`/`ADMIN` roles exist — signup
will fail with "Default USER role not found" otherwise.

## Known trade-offs (worth mentioning if you present this)

- **Tokens in `localStorage`, not an httpOnly cookie.** The backend hands back raw tokens in the JSON
  response body for `/auth/signin` and `/auth/signup`, so there's nowhere safer to keep them client-side
  without changing that contract. It's the pragmatic choice given the API as written, not the ideal one.
- **Admin detection is a probe, not a claim.** See point 3 above — this is called out in code
  (`AuthContext.tsx`) rather than hidden.
- **No document preview/download** until the backend adds a file-serving route.
