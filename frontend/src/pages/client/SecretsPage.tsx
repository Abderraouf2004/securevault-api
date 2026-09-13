import { useState } from "react";
import { useForm } from "react-hook-form";
import { Copy, Eye, EyeOff, KeyRound, Pencil, Plus, Trash2 } from "lucide-react";
import { Button, EmptyState, Field, Input, PageLoader } from "@/components/ui";
import { Modal } from "@/components/Modal";
import { useCreateSecret, useDeleteSecret, useSecrets, useUpdateSecret } from "@/hooks/useSecrets";
import { useToast } from "@/context/ToastContext";
import { getApiErrorMessage } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import type { SecretDTO } from "@/types";

interface FormValues {
  name: string;
  Value: string;
}

export default function SecretsPage() {
  const { data: secrets, isLoading } = useSecrets();
  const [modalState, setModalState] = useState<{ mode: "create" } | { mode: "edit"; secret: SecretDTO } | null>(null);
  const deleteSecret = useDeleteSecret();
  const { notify } = useToast();

  if (isLoading) return <PageLoader />;

  const handleDelete = async (secret: SecretDTO) => {
    if (!confirm(`Delete "${secret.name}"? This can't be undone.`)) return;
    try {
      await deleteSecret.mutateAsync(secret.id);
      notify("Secret deleted.");
    } catch (err) {
      notify(getApiErrorMessage(err), "error");
    }
  };

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Secrets</h1>
          <p className="mt-1 text-sm text-muted">API keys, passwords and tokens — encrypted with AES-256-GCM.</p>
        </div>
        <Button onClick={() => setModalState({ mode: "create" })}>
          <Plus size={16} /> New secret
        </Button>
      </header>

      {!secrets?.length ? (
        <EmptyState
          icon={<KeyRound size={28} />}
          title="No secrets stored"
          description="Add a credential to keep it out of plaintext files and chat threads."
          action={
            <Button size="sm" onClick={() => setModalState({ mode: "create" })}>
              <Plus size={14} /> New secret
            </Button>
          }
        />
      ) : (
        <ul className="space-y-2">
          {secrets.map((secret) => (
            <SecretRow
              key={secret.id}
              secret={secret}
              onEdit={() => setModalState({ mode: "edit", secret })}
              onDelete={() => handleDelete(secret)}
            />
          ))}
        </ul>
      )}

      <SecretModal state={modalState} onClose={() => setModalState(null)} />
    </div>
  );
}

function SecretRow({ secret, onEdit, onDelete }: { secret: SecretDTO; onEdit: () => void; onDelete: () => void }) {
  const [revealed, setRevealed] = useState(false);
  const { notify } = useToast();

  const copy = () => {
    navigator.clipboard.writeText(secret.Value);
    notify("Copied to clipboard.");
  };

  return (
    <li className="flex items-center justify-between gap-4 rounded-md border border-line bg-surface px-4 py-3.5 shadow-card">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-vault-50 text-vault-600">
          <KeyRound size={16} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink">{secret.name}</p>
          <p className="mt-0.5 truncate font-mono text-xs text-muted">
            {revealed ? secret.Value : "•".repeat(Math.min(secret.Value.length, 24))}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1 text-muted">
        <span className="mr-2 hidden text-xs sm:inline">Updated {formatDate(secret.updatedAt)}</span>
        <Button variant="ghost" size="sm" onClick={() => setRevealed((r) => !r)} title={revealed ? "Hide" : "Reveal"}>
          {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
        </Button>
        <Button variant="ghost" size="sm" onClick={copy} title="Copy value">
          <Copy size={14} />
        </Button>
        <Button variant="ghost" size="sm" onClick={onEdit} title="Edit">
          <Pencil size={14} />
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete} title="Delete">
          <Trash2 size={14} className="text-danger" />
        </Button>
      </div>
    </li>
  );
}

function SecretModal({
  state,
  onClose,
}: {
  state: { mode: "create" } | { mode: "edit"; secret: SecretDTO } | null;
  onClose: () => void;
}) {
  const create = useCreateSecret();
  const update = useUpdateSecret();
  const { notify } = useToast();
  const editing = state?.mode === "edit" ? state.secret : null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ values: editing ? { name: editing.name, Value: editing.Value } : { name: "", Value: "" } });

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (values: FormValues) => {
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, ...values });
        notify("Secret updated.");
      } else {
        await create.mutateAsync(values);
        notify("Secret created.");
      }
      close();
    } catch (err) {
      notify(getApiErrorMessage(err), "error");
    }
  };

  return (
    <Modal open={!!state} onClose={close} title={editing ? "Edit secret" : "New secret"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Name" htmlFor="name" error={errors.name?.message}>
          <Input id="name" placeholder="Stripe API key" {...register("name", { required: "Give it a name", minLength: 3 })} />
        </Field>
        <Field label="Value" htmlFor="Value" error={errors.Value?.message}>
          <Input id="Value" className="font-mono" placeholder="sk_live_…" {...register("Value", { required: "Enter a value" })} />
        </Field>
        <Button type="submit" loading={isSubmitting} className="w-full">
          {editing ? "Save changes" : "Create secret"}
        </Button>
      </form>
    </Modal>
  );
}
