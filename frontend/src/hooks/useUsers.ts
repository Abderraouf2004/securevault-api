import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { ApiSuccess, Role, UserDTO } from "@/types";

const KEY = ["users"];

export function useUsers() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => (await apiClient.get<ApiSuccess<UserDTO[]>>("/users")).data.data,
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: Role }) =>
      (await apiClient.put<ApiSuccess<UserDTO>>(`/users/${id}/role`, { role })).data.data,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => apiClient.delete(`/users/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
