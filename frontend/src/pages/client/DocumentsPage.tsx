import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FileText, Plus, Trash2, UploadCloud, Pencil, Check, X } from "lucide-react";
import { Badge, Button, EmptyState, Field, Input, PageLoader, Textarea } from "@/components/ui";
import { Modal } from "@/components/Modal";
import { useCreateDocument, useDeleteDocument, useDocuments, useUpdateDocument } from "@/hooks/useDocuments";
import { formatBytes, formatDate } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";
import { getApiErrorMessage } from "@/lib/api-client";
import type { DocumentDTO } from "@/types";

export default function DocumentsPage() {
  const { data: documents, isLoading } = useDocuments();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const { notify } = useToast();
  const deleteDoc = useDeleteDocument();

  const selected = useMemo(() => documents?.find((d) => d.id === selectedId) ?? documents?.[0] ?? null, [documents, selectedId]);

  if (isLoading) return <PageLoader />;

  const handleDelete = async (doc: DocumentDTO) => {
    if (!confirm(`Delete "${doc.title}"? This can't be undone.`)) return;
    try {
      await deleteDoc.mutateAsync(doc.id);
      notify("Document deleted.");
      setSelectedId(null);
    } catch (err) {
      notify(getApiErrorMessage(err), "error");
    }
  };

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Documents</h1>
          <p className="mt-1 text-sm text-muted">Files stored in your encrypted vault.</p>
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Plus size={16} /> Upload document
        </Button>
      </header>

      {!documents?.length ? (
        <EmptyState
          icon={<FileText size={28} />}
          title="No documents yet"
          description="Upload your first file to get started."
          action={
            <Button onClick={() => setUploadOpen(true)} size="sm">
              <Plus size={14} /> Upload document
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-[280px_1fr] gap-6">
          <ul className="space-y-1.5">
            {documents.map((doc) => (
              <li key={doc.id}>
                <button
                  onClick={() => setSelectedId(doc.id)}
                  className={`w-full rounded-md border px-3.5 py-3 text-left transition-colors ${
                    selected?.id === doc.id ? "border-ink bg-surface shadow-card" : "border-line bg-surface hover:border-ink/40"
                  }`}
                >
                  <p className="truncate text-sm font-medium text-ink">{doc.title}</p>
                  <p className="mt-0.5 truncate text-xs text-muted">{doc.originalName}</p>
                </button>
              </li>
            ))}
          </ul>

          {selected && <DocumentDetail key={selected.id} doc={selected} onDelete={() => handleDelete(selected)} />}
        </div>
      )}

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}

function DocumentDetail({ doc, onDelete }: { doc: DocumentDTO; onDelete: () => void }) {
  const [editing, setEditing] = useState(false);
  const update = useUpdateDocument();
  const { notify } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { title: doc.title, description: doc.description ?? "" } });

  const onSave = async (values: { title: string; description: string }) => {
    try {
      await update.mutateAsync({ id: doc.id, ...values });
      notify("Document updated.");
      setEditing(false);
    } catch (err) {
      notify(getApiErrorMessage(err), "error");
    }
  };

  return (
    <div className="rounded-md border border-line bg-surface p-6 shadow-card">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-vault-50 text-vault-600">
            <FileText size={20} />
          </div>
          <div>
            {editing ? (
              <Input {...register("title", { required: true })} className="text-base font-medium" />
            ) : (
              <h2 className="font-display text-lg font-semibold text-ink">{doc.title}</h2>
            )}
            <p className="text-xs text-muted">{doc.originalName}</p>
          </div>
        </div>
        {!editing ? (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
              <Pencil size={14} />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 size={14} className="text-danger" />
            </Button>
          </div>
        ) : (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={handleSubmit(onSave)} loading={isSubmitting}>
              <Check size={14} className="text-cipher" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                reset();
                setEditing(false);
              }}
            >
              <X size={14} />
            </Button>
          </div>
        )}
      </div>

      <div className="mt-5">
        <Field label="Description" htmlFor="description">
          {editing ? (
            <Textarea id="description" rows={3} {...register("description")} />
          ) : (
            <p className="text-sm text-muted">{doc.description || "No description added."}</p>
          )}
        </Field>
      </div>

      <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-line pt-5 text-sm">
        <div>
          <dt className="text-xs text-muted">Type</dt>
          <dd className="mt-1"><Badge tone="brand">{doc.mimeType}</Badge></dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Size</dt>
          <dd className="mt-1 text-ink">{formatBytes(doc.size)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Uploaded</dt>
          <dd className="mt-1 text-ink">{formatDate(doc.createdAt)}</dd>
        </div>
      </dl>

      <p className="mt-4 text-xs text-muted">
        File preview and download aren't wired up yet — the API doesn't expose a file-serving route.
      </p>
    </div>
  );
}

function UploadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const create = useCreateDocument();
  const { notify } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ title: string; description: string }>();

  const close = () => {
    reset();
    setFileName(null);
    onClose();
  };

  const onSubmit = async (values: { title: string; description: string }) => {
    const file = fileInput.current?.files?.[0];
    if (!file) {
      notify("Choose a file to upload.", "error");
      return;
    }
    try {
      await create.mutateAsync({ ...values, file });
      notify("Document uploaded.");
      close();
    } catch (err) {
      notify(getApiErrorMessage(err), "error");
    }
  };

  return (
    <Modal open={open} onClose={close} title="Upload document">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Title" htmlFor="title" error={errors.title?.message}>
          <Input id="title" placeholder="Passport scan" {...register("title", { required: "Give it a title" })} />
        </Field>
        <Field label="Description" htmlFor="description">
          <Textarea id="description" rows={2} placeholder="Optional" {...register("description")} />
        </Field>
        <Field label="File" htmlFor="file">
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="flex w-full items-center gap-2.5 rounded-sm border border-dashed border-line px-3.5 py-3 text-left text-sm text-muted hover:border-ink"
          >
            <UploadCloud size={16} />
            {fileName ?? "PDF, PNG or JPEG · up to 10MB"}
          </button>
          <input
            ref={fileInput}
            id="file"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
        </Field>
        <Button type="submit" loading={isSubmitting} className="w-full">
          Upload
        </Button>
      </form>
    </Modal>
  );
}
