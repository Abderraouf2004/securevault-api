import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  ApiSuccess,
  Role,
  UserDTO,
  UpdateProfileInput,
  UpdatePasswordInput,
} from "@/types";

const KEY = ["users"];

export function useUsers() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () =>
      (await apiClient.get<ApiSuccess<UserDTO[]>>("/users")).data.data,
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) =>
      (await apiClient.put<ApiSuccess<UserDTO>>(`/users/${id}/role`, { role }))
        .data.data,
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

// export function useUpdateProfile() {
//   return useMutation({
//     mutationFn: async (data: UpdateProfileInput) =>
//       (await apiClient.put<ApiSuccess<UserDTO>>("/users/profile", data)).data
//         .data,
//   });
// }

export function useUpdateProfile() {
  return useMutation({
    mutationFn: async (data: {
      name?: string;
      email?: string;
      avatar?: File | null;
    }) => {
      const formData = new FormData();

      if (data.name !== undefined) {
        formData.append("name", data.name);
      }

      if (data.email !== undefined) {
        formData.append("email", data.email);
      }

      if (data.avatar) {
        formData.append("avatar", data.avatar);
      }

      const response = await apiClient.put<ApiSuccess<UserDTO>>(
        "/users/profile",
        formData,
      );

      return response.data.data;
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (data: UpdatePasswordInput) =>
      (
        await apiClient.put<ApiSuccess<{ success: boolean }>>(
          "/users/password",
          data,
        )
      ).data.data,
  });
}
