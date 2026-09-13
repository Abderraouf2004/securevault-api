// // import { ShieldCheck } from "lucide-react";
// // import { Avatar, Badge, Card } from "@/components/ui";
// // import { useAuth } from "@/context/AuthContext";

// // export default function ProfilePage() {
// //   const { user, isAdmin } = useAuth();

// //   return (
// //     <div>
// //       <header className="mb-6">
// //         <h1 className="font-display text-2xl font-semibold text-ink">Profile</h1>
// //         <p className="mt-1 text-sm text-muted">Your account and session details.</p>
// //       </header>

// //       <Card className="p-6">
// //         <div className="flex items-center gap-4">
// //           <Avatar name={user?.id.slice(0, 2) ?? "U"} size={48} />
// //           <div>
// //             <p className="flex items-center gap-2 text-sm font-medium text-ink">
// //               Account <Badge tone={isAdmin ? "brand" : "neutral"}>{isAdmin ? "Administrator" : "Member"}</Badge>
// //             </p>
// //             <p className="mt-1 font-mono text-xs text-muted">{user?.id}</p>
// //           </div>
// //         </div>

// //         <div className="mt-6 flex items-start gap-2.5 rounded-sm bg-vault-50 px-4 py-3 text-xs text-vault-700">
// //           <ShieldCheck size={15} className="mt-0.5 shrink-0" />
// //           <p>
// //             The API doesn't expose a "my profile" endpoint yet, so this page can only show what's in your session
// //             token (your user ID and whether you're an admin). Add <code className="font-mono">GET /users/me</code>{" "}
// //             to the backend to show your name, email and avatar here too.
// //           </p>
// //         </div>
// //       </Card>
// //     </div>
// //   );
// // }


// import { ShieldCheck } from "lucide-react";
// import { Avatar, Badge, Card } from "@/components/ui";
// import { useAuth } from "@/context/AuthContext";

// export default function ProfilePage() {
//   const { user, isAdmin } = useAuth();

//   return (
//     <div>
//       <header className="mb-6">
//         <h1 className="font-display text-2xl font-semibold text-ink">
//           Profile
//         </h1>
//         <p className="mt-1 text-sm text-muted">
//           Your account and session details.
//         </p>
//       </header>

//       <Card className="p-6">
//         <div className="flex items-center gap-4">
//           <Avatar
//             name={user?.name?.slice(0, 2) ?? "U"}
//             size={48}
//           />

//           <div>
//             <p className="text-sm font-medium text-ink">
//               {user?.name ?? "Unknown user"}
//             </p>

//             <p className="mt-1 text-xs text-muted">
//               {user?.email}
//             </p>

//             <p className="mt-1 flex items-center gap-2 text-sm font-medium text-ink">
//               Account
//               <Badge tone={isAdmin ? "brand" : "neutral"}>
//                 {isAdmin ? "Administrator" : "Member"}
//               </Badge>
//             </p>

//             <p className="mt-1 font-mono text-xs text-muted">
//               {user?.id}
//             </p>
//           </div>
//         </div>

//         <div className="mt-6 flex items-start gap-2.5 rounded-sm bg-vault-50 px-4 py-3 text-xs text-vault-700">
//           <ShieldCheck size={15} className="mt-0.5 shrink-0" />

//           <p>
//             Your profile information is loaded securely from the API.
//           </p>
//         </div>
//       </Card>
//     </div>
//   );
// }

import { useState } from "react";
import { ShieldCheck, Camera, Lock, LogOut, KeyRound, Fingerprint } from "lucide-react";
import { Avatar, Badge, Button, Card, Field, Input } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "profile", label: "Profile" },
  // { key: "security", label: "Security" },
  // { key: "notifications", label: "Notifications" },
] as const;

export default function ProfilePage() {
  const { user, isAdmin, signout } = useAuth();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["key"]>("profile");

  return (
    <div>
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Settings</h1>
          <p className="mt-1 text-sm text-muted">Manage your profile and account security.</p>
        </div>
        <Button disabled title="Editing isn't wired to the API yet">
          Save changes
        </Button>
      </header>

      {/* Tab strip */}
      <div className="mb-6 flex gap-1 border-b border-line">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            disabled={tab.key !== "profile"}
            className={cn(
              "relative px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
              activeTab === tab.key ? "text-ink" : "text-muted hover:text-ink",
            )}
          >
            {tab.label}
            {activeTab === tab.key && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-ink" />}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
        {/* Avatar / identity card */}
        <Card className="flex flex-col items-center p-6 text-center">
          <div className="relative">
            {/* <Avatar name={user?.avatar?.slice(0, 2) ?? "U"} size={88} /> */}
            <Avatar name={user?.name ?? "U"} src={user?.avatar} size={88} />
            <button
              disabled
              title="Avatar upload isn't wired to the API yet"
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-line bg-surface text-muted shadow-card disabled:cursor-not-allowed"
            >
              <Camera size={13} />
            </button>
          </div>

          <p className="mt-4 text-sm font-semibold text-ink">{user?.name ?? "Unknown user"}</p>
          <p className="mt-0.5 text-xs text-muted">{user?.email}</p>
          <Badge tone={isAdmin ? "brand" : "neutral"} >
            {isAdmin ? "Administrator" : "Member"}
          </Badge>

        </Card>

        {/* Editable info + security */}
        <div className="space-y-5">
          <Card className="p-6">
            <p className="text-sm font-semibold text-ink">Personal information</p>
            <p className="mt-1 text-xs text-muted">This is loaded from your session and isn't editable yet.</p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" htmlFor="name">
                <Input id="name" defaultValue={user?.name ?? ""} disabled />
              </Field>
              <Field label="Email address" htmlFor="email">
                <div className="relative">
                  <Input id="email" defaultValue={user?.email ?? ""} disabled className="pr-9" />
                  <Lock size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
                </div>
              </Field>
            </div>
          </Card>

         

          <Card className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-semibold text-ink">Sign out</p>
              <p className="mt-0.5 text-xs text-muted">End your session on this device.</p>
            </div>
            <Button variant="danger" size="sm" onClick={signout}>
              <LogOut size={14} /> Sign out
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SecurityRow({ icon: Icon, label, value }: { icon: typeof KeyRound; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-sm border border-line px-3.5 py-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-black/[0.03] text-muted">
        <Icon size={14} />
      </div>
      <div>
        <p className="text-xs font-medium text-ink">{label}</p>
        <p className="text-xs text-muted">{value}</p>
      </div>
    </div>
  );
}