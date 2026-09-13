import { Trash2 } from "lucide-react";
import { Avatar, Badge, Card, PageLoader } from "@/components/ui";
import { useDeleteUser, useUpdateUserRole, useUsers } from "@/hooks/useUsers";
import { useToast } from "@/context/ToastContext";
import { getApiErrorMessage } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import type { Role, UserDTO } from "@/types";

export default function AdminUsersPage() {
  const { data: users, isLoading } = useUsers();
  const updateRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();
  const { notify } = useToast();
  const { user: currentUser } = useAuth();

  if (isLoading) return <PageLoader />;

  const handleRoleChange = async (user: UserDTO, role: string) => {
    try {
      await updateRole.mutateAsync({ id: user.id, role });
      notify(`${user.name} is now ${role === "ADMIN" ? "an administrator" : "a member"}.`);
    } catch (err) {
      notify(getApiErrorMessage(err), "error");
    }
  };

  const handleDelete = async (user: UserDTO) => {
    if (!confirm(`Remove ${user.name}'s account? This can't be undone.`)) return;
    try {
      await deleteUser.mutateAsync(user.id);
      notify("User removed.");
    } catch (err) {
      notify(getApiErrorMessage(err), "error");
    }
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Users</h1>
        <p className="mt-1 text-sm text-muted">Manage who can access SecureVault and their permissions.</p>
      </header>

      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-black/[0.02] text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Joined</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id} className="border-b border-line last:border-0">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar name={user?.name} src={user?.avatar} size={30} />
                    <div>
                      <p className="font-medium text-ink">{user.name}</p>
                      <p className="text-xs text-muted">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <select
                    value={user.roleName }
                    disabled={user.id === currentUser?.id}
                    onChange={(e) => handleRoleChange(user, e.target.value as string)}
                    className="rounded-sm border border-line bg-surface px-2.5 py-1.5 text-xs font-medium text-ink disabled:opacity-50"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="USER">USER</option>
                  </select>
                </td>
                <td className="px-5 py-3.5 text-muted">{formatDate(user.createdAt)}</td>
                <td className="px-5 py-3.5 text-right">
                  {user.id !== currentUser?.id && (
                    <button onClick={() => handleDelete(user)} className="text-muted hover:text-danger">
                      <Trash2 size={15} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!users?.length && (
          <div className="p-8 text-center text-sm text-muted">
            <Badge>No users found</Badge>
          </div>
        )}
      </Card>
    </div>
  );
}
