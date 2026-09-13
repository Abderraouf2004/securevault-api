import { Link } from "react-router-dom";
import { ShieldCheck, Lock, FileText, KeyRound, ArrowUpRight, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui";

const FEATURES = [
  {
    icon: FileText,
    title: "Document vault",
    body: "Upload contracts, IDs and records. Every file is fingerprinted on the way in, so nothing gets stored under a lying extension.",
  },
  {
    icon: KeyRound,
    title: "Encrypted secrets",
    body: "API keys and passwords are sealed with AES-256-GCM before they ever touch disk — even a database leak reveals nothing.",
  },
  {
    icon: Fingerprint,
    title: "Argon2id auth",
    body: "Passwords are hashed with Argon2id, the algorithm that won the Password Hashing Competition, not a fast general-purpose hash.",
  },
];

export default function LandingPage() {
  return (
    <div className="bg-paper">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-ink text-white">
            <ShieldCheck size={16} />
          </div>
          <span className="font-display text-sm font-semibold text-ink">SecureVault</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-muted hover:text-ink">
            Sign in
          </Link>
          <Link to="/signup">
            <Button size="sm">Create account</Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-12 lg:grid-cols-2 lg:pt-20">
        <div>
          <h1 className="font-display text-[44px] font-semibold leading-[1.08] text-ink lg:text-[52px]">
            One vault for every document and credential your team holds.
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
            SecureVault encrypts files and secrets at rest, gates access behind short-lived tokens, and gives admins
            a clear view of who can reach what — without spreadsheets of passwords.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Link to="/signup">
              <Button>
                Get started <ArrowUpRight size={15} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary">Sign in</Button>
            </Link>
          </div>
        </div>

        <VaultMock />
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-5 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-md border border-line bg-surface p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-vault-50 text-vault-600">
                <f.icon size={18} />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="border-t border-line bg-ink">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-16 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-2xl font-semibold text-white">Ready to lock things down?</p>
            <p className="mt-2 text-sm text-white/60">Free to start. No credit card needed.</p>
          </div>
          <Link to="/signup">
            <Button className="bg-white text-ink hover:bg-white/90">Create your vault</Button>
          </Link>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-8 text-xs text-muted">
        © {new Date().getFullYear()} SecureVault. Built as a portfolio project.
      </footer>
    </div>
  );
}

function VaultMock() {
  const rows = [
    { icon: FileText, label: "passport-scan.pdf", meta: "2.4 MB" },
    { icon: Lock, label: "prod-db-password", meta: "••••••••••" },
    { icon: FileText, label: "lease-agreement.pdf", meta: "1.1 MB" },
  ];
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-lg bg-vault-500/10 blur-2xl" />
      <div className="rounded-lg border border-line bg-surface p-5 shadow-card">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <p className="text-xs font-medium text-muted">Vault contents</p>
          <span className="flex items-center gap-1 text-[11px] font-medium text-cipher">
            <ShieldCheck size={12} /> Encrypted
          </span>
        </div>
        <ul className="mt-3 space-y-2">
          {rows.map((row) => (
            <li key={row.label} className="flex items-center gap-3 rounded-sm px-2 py-2 hover:bg-black/[0.02]">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-vault-50 text-vault-600">
                <row.icon size={14} />
              </div>
              <span className="flex-1 truncate text-sm text-ink">{row.label}</span>
              <span className="font-mono text-xs text-muted">{row.meta}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
