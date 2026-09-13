import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, FileText, KeyRound } from "lucide-react";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-8 py-12 sm:px-16 lg:px-20">
        <Link to="/" className="mb-10 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-ink text-white">
            <ShieldCheck size={16} />
          </div>
          <span className="font-display text-sm font-semibold text-ink">SecureVault</span>
        </Link>

        <div className="w-full max-w-sm">
          <h1 className="font-display text-[28px] font-semibold leading-tight text-ink">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-ink lg:flex lg:flex-col lg:justify-between lg:p-10">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div />
        <div className="relative">
          <p className="font-display text-2xl font-medium leading-snug text-white">
            Every document encrypted at rest.
            <br />
            Every secret, sealed until you need it.
          </p>
          <div className="mt-8 flex gap-3">
            {[Lock, FileText, KeyRound].map((Icon, i) => (
              <div
                key={i}
                className="flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white"
              >
                <Icon size={18} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
