import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { ApiSuccess, DocumentDTO } from "@/types";

const KEY = ["documents"];

export function useDocuments() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () =>
      (await apiClient.get<ApiSuccess<DocumentDTO[]>>("/documents")).data.data,
  });
}

export function useCreateDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      title: string;
      description?: string;
      file: File;
    }) => {
      const form = new FormData();
      form.append("title", input.title);
      if (input.description) form.append("description", input.description);
      form.append("file", input.file);
      return (await apiClient.post<ApiSuccess<DocumentDTO>>("/documents", form))
        .data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...body
    }: {
      id: string;
      title?: string;
      description?: string;
    }) =>
      (await apiClient.put<ApiSuccess<DocumentDTO>>(`/documents/${id}`, body))
        .data.data,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => apiClient.delete(`/documents/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDownloadDocument() {
  return useMutation({
    mutationFn: async ({ id, fileName }: { id: string; fileName: string }) => {
      const response = await apiClient.get(`/documents/${id}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(response.data);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
}
