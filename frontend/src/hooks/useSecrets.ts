import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { ApiSuccess, SecretDTO } from "@/types";

const KEY = ["secrets"];

export function useSecrets() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => (await apiClient.get<ApiSuccess<SecretDTO[]>>("/secrets")).data.data,
  });
}

export function useCreateSecret() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string; Value: string }) =>
      (await apiClient.post<ApiSuccess<SecretDTO>>("/secrets", input)).data.data,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateSecret() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: { id: string; name?: string; Value?: string }) =>
      (await apiClient.put<ApiSuccess<SecretDTO>>(`/secrets/${id}`, body)).data.data,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteSecret() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => apiClient.delete(`/secrets/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
