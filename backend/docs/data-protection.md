# Data Protection Policy

## 1. Purpose

This document defines how sensitive and personal data handled by SecureVault must be classified and protected.

## 2. Data Classification

| Data             | Classification   | Protection                                                    |
| ---------------- | ---------------- | ------------------------------------------------------------- |
| User password    | Highly Sensitive | Argon2id hashing. Passwords are never stored in plaintext.    |
| Secret value     | Highly Sensitive | AES-256-GCM authenticated encryption before database storage. |
| Access token     | Highly Sensitive | Short-lived JWT, never logged or stored in plaintext logs.    |
| Refresh token    | Highly Sensitive | Secure session handling and server-side revocation.           |
| Email            | Personal Data    | Access control and limited exposure in API responses.         |
| User name        | Personal Data    | Access control and limited exposure.                          |
| Document content | Sensitive        | Owner-based authorization and protected server-side storage.  |
| File metadata    | Sensitive        | Access control and resource ownership checks.                 |
| Secret metadata  | Sensitive        | Owner-based authorization.                                    |

## 3. Protection Requirements

### Confidentiality

Sensitive data must not be exposed to unauthorized users.

Secrets must be encrypted before being stored in the database.

Passwords must only be stored as Argon2id hashes.

### Integrity

AES-256-GCM is used for recoverable secrets because it provides authenticated encryption and detects ciphertext tampering.

### Access Control

Sensitive resources must be protected by authentication and resource-level authorization.

Users can only access their own secrets and documents unless an explicit authorization rule allows access.

### Logging

Passwords, secrets, access tokens, refresh tokens, and sensitive request bodies must never be written to application logs.

### Transport

Sensitive data must only be transmitted through HTTPS in production.

Sensitive values must not be placed in URLs or query parameters.

### Caching

Responses containing sensitive or user-specific data must not be cached.

The API uses:

`Cache-Control: no-store`

to prevent sensitive responses from being stored by clients or intermediary caches.

### Storage

Secrets are encrypted before database storage.

Uploaded documents are stored server-side and protected by authorization checks.

### Configuration

Encryption keys, JWT secrets, database credentials, OAuth credentials, and other sensitive configuration values are provided through environment variables and are not committed to source control.

## 4. Data Minimization

API responses should expose only the fields required by the client.

Sensitive fields such as passwords and internal security credentials must never be returned by normal user endpoints.

## 5. Retention

User data should be retained only for as long as required by the application's functionality and applicable requirements.

Deleted resources should not remain accessible through the application after deletion.
