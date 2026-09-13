// These mirror the backend's Joi DTO schemas 1:1 (see securevault-api/src/modules/**/*.schema.ts).
// Keeping them hand-written and in sync (rather than inferred) makes drift from the API obvious.

export type Role = "USER" | "ADMIN";

/** Payload embedded in the JWT (see src/services/token.ts). roleId is a UUID, not a role name. */
// export interface TokenPayload {
//   id: string;
//   roleId: string;
// }
export interface TokenPayload {
  id: string;
  roleId: string;
  name?: string;
  email?: string;
  roleName?: string;
  avatar?: string;
}

/** Returned by GET /users and /users/:id (admin only). roleName is only reliable from these routes. */
export interface UserDTO {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  createdAt: string;
  avatar?: string;
}

export interface DocumentDTO {
  id: string;
  title: string;
  description?: string | null;
  ownerId: string;
  originalName: string;
  storageKey: string;
  mimeType: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export interface SecretDTO {
  id: string;
  name: string;
  Value: string; // decrypted plaintext, as returned by the API — capitalized to match the backend field exactly
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiSuccess<T> {
  data: T;
  message?: string;
}

export interface ApiErrorBody {
  message: string;
  code: string;
  details?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string; // absent on the Google OAuth response — see AuthContext
}
