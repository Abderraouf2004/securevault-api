



// // import { useState, useRef } from "react";
// // import { Camera, Lock, LogOut, KeyRound, Mail, User as UserIcon, Check } from "lucide-react";
// import { useState, useRef } from "react";
// import {
//   Camera,
//   Lock,
//   LogOut,
//   KeyRound,
//   Mail,
//   User as UserIcon,
//   Check,
//   Loader2,
// } from "lucide-react";
// import { Avatar, Badge, Button, Card, Field, Input } from "@/components/ui";
// import { useAuth } from "@/context/AuthContext";
// import { cn } from "@/lib/utils";
// import { useUpdatePassword, useUpdateProfile } from "@/hooks/useUsers";
// import { getApiErrorMessage } from "@/lib/api-client";
// import type { TokenPayload } from "@/types";
// const TABS = [
//   { key: "profile", label: "Profile" },
//   { key: "settings", label: "Settings" },
// ] as const;

// type TabKey = (typeof TABS)[number]["key"];

// export default function ProfilePage() {
//   const { user, isAdmin, signout } = useAuth();
//   const [activeTab, setActiveTab] = useState<TabKey>("profile");

//   return (
//     <div>
//       <header className="mb-6">
//         <h1 className="font-display text-2xl font-semibold text-ink">Account</h1>
//         <p className="mt-1 text-sm text-muted">View your profile and manage your account settings.</p>
//       </header>

//       {/* Tab strip */}
//       <div className="mb-6 flex gap-1 border-b border-line">
//         {TABS.map((tab) => (
//           <button
//             key={tab.key}
//             onClick={() => setActiveTab(tab.key)}
//             className={cn(
//               "relative px-4 py-2.5 text-sm font-medium transition-colors",
//               activeTab === tab.key ? "text-ink" : "text-muted hover:text-ink",
//             )}
//           >
//             {tab.label}
//             {activeTab === tab.key && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-ink" />}
//           </button>
//         ))}
//       </div>

//       {activeTab === "profile" ? <ProfileTab user={user} isAdmin={isAdmin} /> : <SettingsTab user={user} signout={signout} />}
//     </div>
//   );
// }

// /* ---------------------------------- Profile tab ---------------------------------- */

// function ProfileTab({ user, isAdmin }: {  user: TokenPayload | null; isAdmin: boolean }) {
//   return (
//     <Card className="flex flex-col items-center gap-4 px-6 py-10 text-center sm:py-14">
//       <Avatar name={user?.name ?? "U"} src={user?.avatar} size={104} />
//       <div>
//         <p className="font-display text-xl font-semibold text-ink">{user?.name ?? "Unknown user"}</p>
//         <p className="mt-1 text-sm text-muted">{user?.email}</p>
//       </div>
//       <Badge tone={isAdmin ? "brand" : "neutral"}>{isAdmin ? "Administrator" : "Member"}</Badge>

//       <div className="mt-6 grid w-full max-w-md grid-cols-2 gap-3 border-t border-line pt-6 text-left">
//         <InfoRow icon={UserIcon} label="Full name" value={user?.name ?? "—"} />
//         <InfoRow icon={Mail} label="Email address" value={user?.email ?? "—"} />
//       </div>
//     </Card>
//   );
// }

// function InfoRow({ icon: Icon, label, value }: { icon: typeof UserIcon; label: string; value: string }) {
//   return (
//     <div className="flex items-start gap-2.5">
//       <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-black/[0.03] text-muted">
//         <Icon size={13} />
//       </div>
//       <div>
//         <p className="text-xs text-muted">{label}</p>
//         <p className="text-sm font-medium text-ink">{value}</p>
//       </div>
//     </div>
//   );
// }

// /* ---------------------------------- Settings tab ---------------------------------- */

// // function SettingsTab({ user, signout }: { user: any; signout: () => void }) {
// //   return (
// //     <div className="space-y-5">
// //       <AvatarSection user={user} />
// //       <PersonalInfoSection user={user} />
// //       <PasswordSection />

// //       <Card className="flex items-center justify-between p-6">
// //         <div>
// //           <p className="text-sm font-semibold text-ink">Sign out</p>
// //           <p className="mt-0.5 text-xs text-muted">End your session on this device.</p>
// //         </div>
// //         <Button variant="danger" size="sm" onClick={signout}>
// //           <LogOut size={14} /> Sign out
// //         </Button>
// //       </Card>
// //     </div>
// //   );
// // }

// function SettingsTab({
//   user,
//   signout,
// }: {
//   user: TokenPayload | null;
//   signout: () => void;
// }) {
//   return (
//     <div className="space-y-5">
//       <AvatarSection user={user} />

//       <PersonalInfoSection user={user} />

//       <PasswordSection />

//       <Card className="flex items-center justify-between p-6">
//         <div>
//           <p className="text-sm font-semibold text-ink">Sign out</p>
//           <p className="mt-0.5 text-xs text-muted">
//             End your session on this device.
//           </p>
//         </div>

//         <Button variant="danger" size="sm" onClick={signout}>
//           <LogOut size={14} />
//           Sign out
//         </Button>
//       </Card>
//     </div>
//   );
// }

// function AvatarSection({ user }: { user: any }) {
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [preview, setPreview] = useState<string | null>(null);

//   function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setPreview(URL.createObjectURL(file));
//   }

//   return (
//     <Card className="flex flex-col items-center justify-between gap-5 p-6 sm:flex-row sm:items-center">
//       <div className="flex items-center gap-4">
//         <div className="relative">
//           <Avatar name={user?.name ?? "U"} src={preview ?? user?.avatar} size={64} />
//           <button
//             onClick={() => fileInputRef.current?.click()}
//             className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-line bg-surface text-muted shadow-card hover:text-ink"
//           >
//             <Camera size={12} />
//           </button>
//         </div>
//         <div>
//           <p className="text-sm font-semibold text-ink">Profile photo</p>
//           <p className="mt-0.5 text-xs text-muted">JPG or PNG. Square images look best.</p>
//         </div>
//       </div>
//       <input ref={fileInputRef} type="file" accept="image/png,image/jpeg" onChange={handleFileChange} className="hidden" />
//       <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>
//         Upload new photo
//       </Button>
//     </Card>
//   );
// }

// // function PersonalInfoSection({ user }: { user: any }) {
// //   const [name, setName] = useState(user?.name ?? "");
// //   const [email, setEmail] = useState(user?.email ?? "");
// //   const dirty = name !== (user?.name ?? "") || email !== (user?.email ?? "");
// //   const [saved, setSaved] = useState(false);

// //   function handleSave() {
// //     // TODO: wire up to API
// //     setSaved(true);
// //     setTimeout(() => setSaved(false), 2000);
// //   }

// //   return (
// //     <Card className="p-6">
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <p className="text-sm font-semibold text-ink">Personal information</p>
// //           <p className="mt-1 text-xs text-muted">Update your name and the email associated with your account.</p>
// //         </div>
// //         <Button size="sm" disabled={!dirty} onClick={handleSave}>
// //           {saved ? (
// //             <>
// //               <Check size={14} /> Saved
// //             </>
// //           ) : (
// //             "Save changes"
// //           )}
// //         </Button>
// //       </div>

// //       <div className="mt-5 grid gap-4 sm:grid-cols-2">
// //         <Field label="Full name" htmlFor="name">
// //           <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
// //         </Field>
// //         <Field label="Email address" htmlFor="email">
// //           <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
// //         </Field>
// //       </div>
// //     </Card>
// //   );
// // }

// function PersonalInfoSection({
//   user,
// }: {
//   user: TokenPayload | null;
// }) {
//   const { updateUser } = useAuth();
//   const updateProfile = useUpdateProfile();

//   const [name, setName] = useState(user?.name ?? "");
//   const [email, setEmail] = useState(user?.email ?? "");

//   const originalName = user?.name ?? "";
//   const originalEmail = user?.email ?? "";

//   const dirty =
//     name !== originalName ||
//     email !== originalEmail;

//   const error = updateProfile.error
//     ? getApiErrorMessage(updateProfile.error)
//     : null;

//   async function handleSave() {
//     if (!dirty) return;

//     try {
//       const updatedUser = await updateProfile.mutateAsync({
//         name,
//         email,
//       });

//       /*
//        * Update AuthContext immediately.
//        * This makes the new name/email appear everywhere
//        * without requiring a page reload.
//        */
//       updateUser({
//         id: updatedUser.id,
//         roleId: updatedUser.roleId,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         avatar: updatedUser.avatar ?? undefined,
//       });
//     } catch {
//       // Error is already exposed through updateProfile.error
//     }
//   }

//   return (
//     <Card className="p-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-semibold text-ink">
//             Personal information
//           </p>

//           <p className="mt-1 text-xs text-muted">
//             Update your name and the email associated with your account.
//           </p>
//         </div>

//         <Button
//           size="sm"
//           disabled={!dirty || updateProfile.isPending}
//           onClick={handleSave}
//         >
//           {updateProfile.isPending ? (
//             <>
//               <Loader2 size={14} className="animate-spin" />
//               Saving
//             </>
//           ) : updateProfile.isSuccess && !dirty ? (
//             <>
//               <Check size={14} />
//               Saved
//             </>
//           ) : (
//             "Save changes"
//           )}
//         </Button>
//       </div>

//       <div className="mt-5 grid gap-4 sm:grid-cols-2">
//         <Field label="Full name" htmlFor="name">
//           <Input
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//         </Field>

//         <Field label="Email address" htmlFor="email">
//           <Input
//             id="email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </Field>
//       </div>

//       {error && (
//         <p className="mt-3 text-xs text-red-600">
//           {error}
//         </p>
//       )}

//       {updateProfile.isSuccess && !dirty && (
//         <p className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600">
//           <Check size={13} />
//           Profile updated successfully.
//         </p>
//       )}
//     </Card>
//   );
// }
// // function PasswordSection() {
// //   const [current, setCurrent] = useState("");
// //   const [next, setNext] = useState("");
// //   const [confirm, setConfirm] = useState("");
// //   const [saved, setSaved] = useState(false);

// //   const mismatch = confirm.length > 0 && next !== confirm;
// //   const canSave = current.length > 0 && next.length >= 8 && next === confirm;

// //   function handleSave() {
// //     // TODO: wire up to API
// //     setSaved(true);
// //     setCurrent("");
// //     setNext("");
// //     setConfirm("");
// //     setTimeout(() => setSaved(false), 2000);
// //   }

// //   return (
// //     <Card className="p-6">
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <p className="text-sm font-semibold text-ink">Password</p>
// //           <p className="mt-1 text-xs text-muted">Use at least 8 characters. We'll sign you out of other devices.</p>
// //         </div>
// //         <Button size="sm" disabled={!canSave} onClick={handleSave}>
// //           {saved ? (
// //             <>
// //               <Check size={14} /> Updated
// //             </>
// //           ) : (
// //             "Update password"
// //           )}
// //         </Button>
// //       </div>

// //       <div className="mt-5 grid gap-4 sm:grid-cols-3">
// //         <Field label="Current password" htmlFor="current-password">
// //           <div className="relative">
// //             <Input
// //               id="current-password"
// //               type="password"
// //               value={current}
// //               onChange={(e) => setCurrent(e.target.value)}
// //               className="pr-9"
// //             />
// //             <Lock size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
// //           </div>
// //         </Field>
// //         <Field label="New password" htmlFor="new-password">
// //           <div className="relative">
// //             <Input id="new-password" type="password" value={next} onChange={(e) => setNext(e.target.value)} className="pr-9" />
// //             <KeyRound size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
// //           </div>
// //         </Field>
// //         <Field label="Confirm new password" htmlFor="confirm-password" error={mismatch ? "Passwords don't match" : undefined}>
// //           <Input
// //             id="confirm-password"
// //             type="password"
// //             value={confirm}
// //             onChange={(e) => setConfirm(e.target.value)}
// //             className={cn(mismatch && "border-red-400")}
// //           />
// //         </Field>
// //       </div>
// //     </Card>
// //   );
// // }

// function PasswordSection() {
//   const updatePassword = useUpdatePassword();

//   const [current, setCurrent] = useState("");
//   const [next, setNext] = useState("");
//   const [confirm, setConfirm] = useState("");

//   const mismatch =
//     confirm.length > 0 &&
//     next !== confirm;

//   const canSave =
//     current.length >= 8 &&
//     next.length >= 8 &&
//     next === confirm;

//   const error = updatePassword.error
//     ? getApiErrorMessage(updatePassword.error)
//     : null;

//   async function handleSave() {
//     if (!canSave) return;

//     try {
//       await updatePassword.mutateAsync({
//         Currentpassword: current,
//         Newpassword: next,
//       });

//       setCurrent("");
//       setNext("");
//       setConfirm("");
//     } catch {
//       // Error is already exposed through updatePassword.error
//     }
//   }

//   return (
//     <Card className="p-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-semibold text-ink">
//             Password
//           </p>

//           <p className="mt-1 text-xs text-muted">
//             Use at least 8 characters.
//           </p>
//         </div>

//         <Button
//           size="sm"
//           disabled={!canSave || updatePassword.isPending}
//           onClick={handleSave}
//         >
//           {updatePassword.isPending ? (
//             <>
//               <Loader2 size={14} className="animate-spin" />
//               Updating
//             </>
//           ) : updatePassword.isSuccess ? (
//             <>
//               <Check size={14} />
//               Updated
//             </>
//           ) : (
//             "Update password"
//           )}
//         </Button>
//       </div>

//       <div className="mt-5 grid gap-4 sm:grid-cols-3">
//         <Field
//           label="Current password"
//           htmlFor="current-password"
//         >
//           <div className="relative">
//             <Input
//               id="current-password"
//               type="password"
//               value={current}
//               onChange={(e) => setCurrent(e.target.value)}
//               className="pr-9"
//               autoComplete="current-password"
//             />

//             <Lock
//               size={13}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
//             />
//           </div>
//         </Field>

//         <Field
//           label="New password"
//           htmlFor="new-password"
//         >
//           <div className="relative">
//             <Input
//               id="new-password"
//               type="password"
//               value={next}
//               onChange={(e) => setNext(e.target.value)}
//               className="pr-9"
//               autoComplete="new-password"
//             />

//             <KeyRound
//               size={13}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
//             />
//           </div>
//         </Field>

//         <Field
//           label="Confirm new password"
//           htmlFor="confirm-password"
//           error={
//             mismatch
//               ? "Passwords don't match"
//               : undefined
//           }
//         >
//           <Input
//             id="confirm-password"
//             type="password"
//             value={confirm}
//             onChange={(e) => setConfirm(e.target.value)}
//             className={cn(
//               mismatch && "border-red-400",
//             )}
//             autoComplete="new-password"
//           />
//         </Field>
//       </div>

//       {error && (
//         <p className="mt-3 text-xs text-red-600">
//           {error}
//         </p>
//       )}

//       {updatePassword.isSuccess && (
//         <p className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600">
//           <Check size={13} />
//           Password updated successfully.
//         </p>
//       )}
//     </Card>
//   );
// }



import { useState, useRef } from "react";
import {
  Camera,
  Lock,
  LogOut,
  KeyRound,
  Mail,
  User as UserIcon,
  Check,
  Loader2,
} from "lucide-react";

import {
  Avatar,
  Badge,
  Button,
  Card,
  Field,
  Input,
} from "@/components/ui";

import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  useUpdatePassword,
  useUpdateProfile,
} from "@/hooks/useUsers";
import type { TokenPayload } from "@/types";
import { getApiErrorMessage, resolveAssetUrl } from "@/lib/api-client";
const TABS = [
  { key: "profile", label: "Profile" },
  { key: "settings", label: "Settings" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function ProfilePage() {
  const { user, isAdmin, signout } = useAuth();

  const [activeTab, setActiveTab] =
    useState<TabKey>("profile");

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Account
        </h1>

        <p className="mt-1 text-sm text-muted">
          View your profile and manage your account settings.
        </p>
      </header>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b border-line">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "relative px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "text-ink"
                : "text-muted hover:text-ink",
            )}
          >
            {tab.label}

            {activeTab === tab.key && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-ink" />
            )}
          </button>
        ))}
      </div>

      {activeTab === "profile" ? (
        <ProfileTab
          user={user}
          isAdmin={isAdmin}
        />
      ) : (
        <SettingsTab
          user={user}
          signout={signout}
        />
      )}
    </div>
  );
}

/* ---------------------------------- Profile tab ---------------------------------- */

function ProfileTab({
  user,
  isAdmin,
}: {
  user: TokenPayload | null;
  isAdmin: boolean;
}) {
  return (
    <Card className="flex flex-col items-center gap-4 px-6 py-10 text-center sm:py-14">
      {/* <Avatar
        name={user?.name ?? "U"}
        src={user?.avatar}
        size={104}
      /> */}
       <Avatar
  name={user?.name ?? "U"}
  src={resolveAssetUrl(user?.avatar)}
  size={104}
/>
      <div>
        <p className="font-display text-xl font-semibold text-ink">
          {user?.name ?? "Unknown user"}
        </p>

        <p className="mt-1 text-sm text-muted">
          {user?.email}
        </p>
      </div>

      <Badge tone={isAdmin ? "brand" : "neutral"}>
        {isAdmin ? "Administrator" : "Member"}
      </Badge>

      <div className="mt-6 grid w-full max-w-md grid-cols-2 gap-3 border-t border-line pt-6 text-left">
        <InfoRow
          icon={UserIcon}
          label="Full name"
          value={user?.name ?? "—"}
        />

        <InfoRow
          icon={Mail}
          label="Email address"
          value={user?.email ?? "—"}
        />
      </div>
    </Card>
  );
}

/* ---------------------------------- Info row ---------------------------------- */

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-black/[0.03] text-muted">
        <Icon size={13} />
      </div>

      <div>
        <p className="text-xs text-muted">
          {label}
        </p>

        <p className="text-sm font-medium text-ink">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------- Settings tab ---------------------------------- */

function SettingsTab({
  user,
  signout,
}: {
  user: TokenPayload | null;
  signout: () => void;
}) {
  /*
   * The selected avatar file lives here.
   *
   * AvatarSection only selects the file.
   * PersonalInfoSection sends it to the backend.
   */
  const [avatarFile, setAvatarFile] =
    useState<File | null>(null);

  return (
    <div className="space-y-5">
      <AvatarSection
        user={user}
        onFileChange={setAvatarFile}
      />

      <PersonalInfoSection
        user={user}
        avatarFile={avatarFile}
        onAvatarSaved={() => setAvatarFile(null)}
      />

      <PasswordSection />

      {/* Sign out */}
      <Card className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-semibold text-ink">
            Sign out
          </p>

          <p className="mt-0.5 text-xs text-muted">
            End your session on this device.
          </p>
        </div>

        <Button
          variant="danger"
          size="sm"
          onClick={signout}
        >
          <LogOut size={14} />
          Sign out
        </Button>
      </Card>
    </div>
  );
}

/* ---------------------------------- Avatar section ---------------------------------- */

function AvatarSection({
  user,
  onFileChange,
}: {
  user: TokenPayload | null;
  onFileChange: (file: File | null) => void;
}) {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [preview, setPreview] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setError(null);

    /* Allowed image types */
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPEG, PNG and WebP images are allowed.",
      );

      e.target.value = "";
      return;
    }

    /* Maximum 2 MB */
    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "The image must be smaller than 2 MB.",
      );

      e.target.value = "";
      return;
    }

    /*
     * Create local preview.
     */
    const objectUrl =
      URL.createObjectURL(file);

    setPreview(objectUrl);

    /*
     * Send the File to SettingsTab.
     */
    onFileChange(file);
  }

  return (
    <Card className="flex flex-col items-center justify-between gap-5 p-6 sm:flex-row sm:items-center">
      <div className="flex items-center gap-4">
        <div className="relative">
          {/* <Avatar
            name={user?.name ?? "U"}
            src={preview ?? user?.avatar}
            size={64}
          /> */}
          <Avatar
  name={user?.name ?? "U"}
  src={preview ?? resolveAssetUrl(user?.avatar)}
  size={64}
/>

          <button
            type="button"
            onClick={() =>
              fileInputRef.current?.click()
            }
            className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-line bg-surface text-muted shadow-card hover:text-ink"
            title="Change profile photo"
          >
            <Camera size={12} />
          </button>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">
            Profile photo
          </p>

          <p className="mt-0.5 text-xs text-muted">
            JPG, PNG or WebP. Maximum 2 MB.
          </p>

          {error && (
            <p className="mt-1 text-xs text-red-600">
              {error}
            </p>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      <Button
        size="sm"
        variant="secondary"
        onClick={() =>
          fileInputRef.current?.click()
        }
      >
        Upload new photo
      </Button>
    </Card>
  );
}

/* ---------------------------------- Personal information ---------------------------------- */

function PersonalInfoSection({
  user,
  avatarFile,
  onAvatarSaved,
}: {
  user: TokenPayload | null;
  avatarFile: File | null;
  onAvatarSaved: () => void;
}) {
  const { updateUser } = useAuth();

  const updateProfile =
    useUpdateProfile();

  const [name, setName] =
    useState(user?.name ?? "");

  const [email, setEmail] =
    useState(user?.email ?? "");

  const originalName =
    user?.name ?? "";

  const originalEmail =
    user?.email ?? "";

  /*
   * Save button is enabled if:
   * - name changed
   * - email changed
   * - avatar selected
   */
  const dirty =
    name !== originalName ||
    email !== originalEmail ||
    avatarFile !== null;

  const error = updateProfile.error
    ? getApiErrorMessage(
        updateProfile.error,
      )
    : null;

  async function handleSave() {
    if (!dirty) {
      return;
    }

    try {
      const updatedUser =
        await updateProfile.mutateAsync({
          name,
          email,
          avatar: avatarFile,
        });

      /*
       * Update AuthContext.
       *
       * This makes the new profile information
       * available everywhere without page reload.
       */
      updateUser({
        id: updatedUser.id,
        roleId: updatedUser.roleId,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar:
          updatedUser.avatar ?? undefined,
      });

      /*
       * Clear selected avatar
       * after successful upload.
       */
      onAvatarSaved();
    } catch {
      /*
       * Error is already available through
       * updateProfile.error.
       */
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">
            Personal information
          </p>

          <p className="mt-1 text-xs text-muted">
            Update your name, email and profile photo.
          </p>
        </div>

        <Button
          size="sm"
          disabled={
            !dirty ||
            updateProfile.isPending
          }
          onClick={handleSave}
        >
          {updateProfile.isPending ? (
            <>
              <Loader2
                size={14}
                className="animate-spin"
              />
              Saving
            </>
          ) : updateProfile.isSuccess &&
            !dirty ? (
            <>
              <Check size={14} />
              Saved
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field
          label="Full name"
          htmlFor="name"
        >
          <Input
            id="name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />
        </Field>

        <Field
          label="Email address"
          htmlFor="email"
        >
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </Field>
      </div>

      {error && (
        <p className="mt-3 text-xs text-red-600">
          {error}
        </p>
      )}

      {updateProfile.isSuccess &&
        !dirty && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600">
            <Check size={13} />
            Profile updated successfully.
          </p>
        )}
    </Card>
  );
}

/* ---------------------------------- Password ---------------------------------- */

function PasswordSection() {
  const updatePassword =
    useUpdatePassword();

  const [current, setCurrent] =
    useState("");

  const [next, setNext] =
    useState("");

  const [confirm, setConfirm] =
    useState("");

  const mismatch =
    confirm.length > 0 &&
    next !== confirm;

  const canSave =
    current.length >= 8 &&
    next.length >= 8 &&
    next === confirm;

  const error = updatePassword.error
    ? getApiErrorMessage(
        updatePassword.error,
      )
    : null;

  async function handleSave() {
    if (!canSave) {
      return;
    }

    try {
      await updatePassword.mutateAsync({
        Currentpassword: current,
        Newpassword: next,
      });

      /*
       * Clear fields after successful update.
       */
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch {
      /*
       * Error is already exposed through
       * updatePassword.error.
       */
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">
            Password
          </p>

          <p className="mt-1 text-xs text-muted">
            Use at least 8 characters.
          </p>
        </div>

        <Button
          size="sm"
          disabled={
            !canSave ||
            updatePassword.isPending
          }
          onClick={handleSave}
        >
          {updatePassword.isPending ? (
            <>
              <Loader2
                size={14}
                className="animate-spin"
              />
              Updating
            </>
          ) : updatePassword.isSuccess ? (
            <>
              <Check size={14} />
              Updated
            </>
          ) : (
            "Update password"
          )}
        </Button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {/* Current password */}
        <Field
          label="Current password"
          htmlFor="current-password"
        >
          <div className="relative">
            <Input
              id="current-password"
              type="password"
              value={current}
              onChange={(e) =>
                setCurrent(e.target.value)
              }
              className="pr-9"
              autoComplete="current-password"
            />

            <Lock
              size={13}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
            />
          </div>
        </Field>

        {/* New password */}
        <Field
          label="New password"
          htmlFor="new-password"
        >
          <div className="relative">
            <Input
              id="new-password"
              type="password"
              value={next}
              onChange={(e) =>
                setNext(e.target.value)
              }
              className="pr-9"
              autoComplete="new-password"
            />

            <KeyRound
              size={13}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
            />
          </div>
        </Field>

        {/* Confirm password */}
        <Field
          label="Confirm new password"
          htmlFor="confirm-password"
          error={
            mismatch
              ? "Passwords don't match"
              : undefined
          }
        >
          <Input
            id="confirm-password"
            type="password"
            value={confirm}
            onChange={(e) =>
              setConfirm(e.target.value)
            }
            className={cn(
              mismatch &&
                "border-red-400",
            )}
            autoComplete="new-password"
          />
        </Field>
      </div>

      {error && (
        <p className="mt-3 text-xs text-red-600">
          {error}
        </p>
      )}

      {updatePassword.isSuccess && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600">
          <Check size={13} />
          Password updated successfully.
        </p>
      )}
    </Card>
  );
}

