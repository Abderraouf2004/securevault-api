# SecureVault

A security-focused REST API for secure document and secret management, built with **Node.js, TypeScript, Express, PostgreSQL and Prisma**.

SecureVault was developed as a practical backend security project with a strong focus on **authentication, authorization, secure file handling, cryptography, OAuth/OIDC, session security, input validation and OWASP ASVS 5.0.0**.

---

## Features

### Authentication

- User registration
- Secure password hashing with **Argon2id**
- Email/password authentication
- JWT access and refresh tokens
- Token validation
- Logout and token invalidation using Redis
- Role-based authentication

### Authorization

- Role-based access control
- Resource ownership checks
- Protection against IDOR
- User isolation for documents and secrets
- Protected API routes

### Google OAuth / OIDC

- Google authentication using OpenID Connect
- Authorization Code Flow
- PKCE
- Session state protection
- Account integration with PostgreSQL users

### Document Management

- Upload documents
- Document metadata management
- access protection
- Update and delete operations
- Owner-based authorization
- File size restrictions
- File type validation
- MIME/content validation
- Magic-byte validation
- UUID-based stored filenames

### Secret Vault

- Create, read, update and delete secrets
- Owner-only access
- AES-256-GCM encryption
- Random IV per encrypted value
- Authentication tag for integrity protection
- Secrets encrypted before database storage
- Decryption only after authorization

### Security

- Helmet security headers
- Rate limiting
- Joi input validation
- JWT validation
- Redis token invalidation
- Secure password hashing
- AES-256-GCM encryption
- Sensitive-data protection
- Anti-caching headers
- Environment-based secrets
- Centralized error handling

---

## Technology Stack

| Technology     | Purpose                    |
| -------------- | -------------------------- |
| Node.js        | Runtime                    |
| TypeScript     | Programming language       |
| Express 5      | REST API                   |
| PostgreSQL     | Database                   |
| Prisma         | ORM                        |
| Joi            | Input validation           |
| Argon2id       | Password hashing           |
| JWT            | Authentication             |
| Redis          | Token/session invalidation |
| Helmet         | HTTP security headers      |
| Multer         | File uploads               |
| OpenID Connect | Google authentication      |
| AES-256-GCM    | Secret encryption          |

---

## Architecture

SecureVault follows a layered backend architecture:

```text
Client
  │
  ▼
Express API / Routes
  │
  ▼
Middleware
  │
  ├── Authentication
  ├── Rate Limiting
  └── Security Middleware
  │
  ▼
Controller
  │
  ▼
Service
  │
  ▼
Repository
  │
  ▼
Prisma
  │
  ▼
PostgreSQL
```

Additional security and infrastructure components:

```text
                    ┌──────────────┐
                    │    Client    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Express API  │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        Authentication  Validation   Rate Limit
              │
              ▼
        ┌─────────────┐
        │ Controllers │
        └──────┬──────┘
               ▼
        ┌─────────────┐
        │  Services   │
        └──────┬──────┘
               ▼
        ┌─────────────┐
        │ Repositories│
        └──────┬──────┘
               ▼
        ┌─────────────┐
        │   Prisma    │
        └──────┬──────┘
               ▼
        ┌─────────────┐
        │ PostgreSQL  │
        └─────────────┘

        Redis
          │
          └── Token invalidation

        Google
          │
          └── OAuth / OIDC

        Encryption Service
          │
          └── AES-256-GCM
```

More architectural details are available in:

```text
docs/architecture.md
```

---

## Project Structure

```text
securevault-api/
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│   │
│   ├── apis/
│   │   ├── auth/
│   │   ├── documents/
│   │   ├── secrets/
│   │   ├── users/
│   │   └── index.ts
│   │
│   ├── core/
│   │   ├── auth/
│   │   │   ├── controller.ts
│   │   │   ├── repo.ts
│   │   │   └── service.ts
│   │   │
│   │   ├── documents/
│   │   │   ├── controller.ts
│   │   │   ├── repo.ts
│   │   │   └── service.ts
│   │   │
│   │   ├── secrets/
│   │   │   ├── controller.ts
│   │   │   ├── repo.ts
│   │   │   └── service.ts
│   │   │
│   │   └── users/
│   │       ├── controller.ts
│   │       ├── repo.ts
│   │       └── service.ts
│   │
│   ├── errors/
│   │   ├── error-handler.ts
│   │   ├── try-catch.ts
│   │   └── ...
│   │
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── rate-limit.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── documents/
│   │   ├── secrets/
│   │   └── users/
│   │
│   ├── services/
│   │   ├── encryption.ts
│   │   ├── hash.ts
│   │   ├── redis.ts
│   │   └── token.ts
│   │
│   ├── types/
│   │
│   └── app.ts
│
├── docs/
│   ├── architecture.md
│   ├── security-decisions.md
│   ├── security-requirements.md
│   ├── data-protection.md
│
│
│
├── .env.example
├── .gitignore
├── package.json
├── prisma.config.ts
└── README.md
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd securevault-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```bash
cp .env.example .env
```

Configure the required values:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/securevault"

JWT_SECRET="your-secure-jwt-secret"

REDIS_URL="redis://localhost:6379"

SESSION_SECRET="your-secure-session-secret"

SECRET_ENCRYPTION_KEY="your-base64-encoded-32-byte-key"

GOOGLE_CLIENT_ID="your-google-client-id"

GOOGLE_CLIENT_SECRET="your-google-client-secret"

GOOGLE_REDIRECT_URI="your-google-redirect-uri"
```

> Never commit `.env` or real credentials to Git.

---

## Database Setup

Make sure PostgreSQL is running.

Generate the Prisma client:

```bash
npx prisma generate
```

Run the database migrations:

```bash
npx prisma migrate dev
```

If the project uses the seed script:

```bash
npx prisma db seed
```

---

## Redis Setup

Redis is used for token/session invalidation.

Start Redis locally:

```bash
redis-server
```

Or configure `REDIS_URL` to point to an existing Redis instance.

---

## Start the API

Development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Production:

```bash
npm start
```

The API runs on:

```text
http://localhost:3000
```

---

## Authentication Flow

### Traditional Authentication

```text
Register
   │
   ▼
Password
   │
   ▼
Argon2id
   │
   ▼
PostgreSQL
```

Login:

```text
Email + Password
       │
       ▼
Verify Argon2id hash
       │
       ▼
Generate JWT
       │
       ▼
Access Token + Refresh Token
```

Protected request:

```text
Authorization: Bearer <access-token>
```

The authentication middleware verifies the token before allowing access to protected resources.

---

## Logout

Logout invalidates the token using Redis.

```text
JWT
 │
 ▼
Logout
 │
 ▼
Token added to Redis blacklist
 │
 ▼
Future request
 │
 ▼
Token rejected
```

This prevents a previously issued token from remaining usable after logout.

---

## Authorization

Authentication answers:

> Who are you?

Authorization answers:

> What are you allowed to access?

SecureVault applies both role-based and resource ownership checks.

For example:

```text
User A
  │
  ├── Document A ✅
  └── Secret A   ✅

User B
  │
  ├── Document B ✅
  └── Secret B   ✅
```

User A cannot access User B's private resources.

This protects against **IDOR (Insecure Direct Object Reference)** vulnerabilities.

---

## Secret Vault

Secrets are never stored in plaintext.

The encryption flow is:

```text
Secret
  │
  ▼
AES-256-GCM
  │
  ├── Random IV
  ├── Ciphertext
  └── Authentication Tag
  │
  ▼
PostgreSQL
```

The encrypted value uses the following logical format:

```text
iv.authTag.ciphertext
```

The encryption key is loaded from:

```env
SECRET_ENCRYPTION_KEY
```

The key itself is never stored in the database.

### Important

Encryption does not replace authorization.

A secret is decrypted only after verifying that the requesting user owns the resource.

---

## Password Security

Passwords are never stored as plaintext.

SecureVault uses:

```text
Password
   │
   ▼
Argon2id
   │
   ▼
Password Hash
   │
   ▼
PostgreSQL
```

During login, the supplied password is verified against the stored Argon2id hash.

---

## File Upload Security

Uploaded files are protected using multiple controls:

- File size limit
- Extension validation
- MIME/content validation
- Magic-byte validation
- Memory-based upload handling
- UUID-based filenames
- Owner-based authorization

The upload process is conceptually:

```text
Upload
  │
  ▼
Size validation
  │
  ▼
Extension validation
  │
  ▼
MIME validation
  │
  ▼
Magic-byte validation
  │
  ▼
Generate safe filename
  │
  ▼
Store file
  │
  ▼
Store metadata
```

File contents are not trusted based only on the filename or client-provided MIME type.

---

## Input Validation

User-controlled input is validated using **Joi**.

Validation is applied to API inputs such as:

- Email
- Password
- IDs
- Names
- Document metadata
- Secret data
- Request parameters
- Request bodies

Validation helps prevent malformed or unexpected input from reaching application logic.

---

## SQL Injection Protection

Database access is performed through Prisma rather than manually concatenated SQL queries.

User input is validated before reaching the service/repository layers.

Security testing also includes common SQL injection payloads such as:

```text
' OR 1=1 --
```

and:

```text
' UNION SELECT --
```

---

## Rate Limiting

Authentication endpoints are protected by rate limiting to reduce brute-force and abuse attempts.

Example:

```text
Multiple failed login attempts
             │
             ▼
       Rate limiter
             │
             ▼
           429
 Too Many Requests
```

---

## Security Headers

Helmet is used to configure security-related HTTP headers.

The application also uses:

```http
Cache-Control: no-store
```

to prevent sensitive API responses from being cached.

---

## OAuth / OpenID Connect

Google authentication uses OpenID Connect.

The flow includes:

```text
User
 │
 ▼
SecureVault
 │
 ▼
Google Authorization
 │
 ▼
Authorization Code
 │
 ▼
PKCE Verification
 │
 ▼
OIDC Token Validation
 │
 ▼
User Account
 │
 ▼
Application Session / JWT
```

The implementation uses:

- Authorization Code Flow
- PKCE
- State/session protection
- Google OIDC configuration
- PostgreSQL account integration

---

## Security Documentation

The project contains dedicated security documentation:

```text
docs/
├── architecture.md
├── security-decisions.md
├── security-requirements.md
├── data-protection.md

```

These documents explain the architecture, security decisions, data protection controls, ASVS mapping and security testing strategy.

---

## OWASP ASVS

SecureVault was developed and reviewed against **OWASP Application Security Verification Standard (ASVS) 5.0.0**.

The project focuses on relevant areas including:

| ASVS Area                      | SecureVault                       |
| ------------------------------ | --------------------------------- |
| V1 Encoding / Validation       | Joi validation                    |
| V2 Validation / Business Logic | Service-layer validation          |
| V4 API Security                | Express security controls         |
| V5 File Handling               | Upload restrictions + magic bytes |
| V6 Authentication              | Argon2id + authentication         |
| V7 Session Management          | JWT + Redis invalidation          |
| V8 Authorization               | RBAC + ownership checks           |
| V9 JWT                         | JWT validation                    |
| V10 OAuth/OIDC                 | Google OIDC + PKCE                |
| V11 Cryptography               | AES-256-GCM + Argon2id            |
| V13 Configuration              | Environment-based configuration   |
| V14 Data Protection            | Encryption + `no-store`           |
| V15 Secure Architecture        | Layered architecture              |
| V16 Security Logging           | Security/audit logging            |

See:

```text
docs/asvs-audit.md
```

for the detailed mapping.

> SecureVault does **not** claim full or 100% ASVS compliance. The project uses ASVS 5.0.0 as a security verification and learning framework and documents remaining gaps.

---

## Security Testing

Security testing covers areas such as:

### Authentication

- Valid login
- Invalid password
- Unknown user
- Missing JWT
- Invalid JWT
- Expired JWT
- Logged-out token

### Authorization

- Cross-user document access
- Cross-user document modification
- Cross-user document deletion
- Cross-user secret access
- Cross-user secret modification
- Cross-user secret deletion

### Input Validation

- Invalid email
- Empty fields
- Invalid IDs
- Oversized input
- Unexpected fields
- Malformed requests

### File Upload

- Oversized files
- Invalid extensions
- MIME spoofing
- Extension/content mismatch
- Invalid magic bytes

### API Security

- Rate limiting
- Security headers
- Cache-control
- JWT protection
- Error handling

### Injection

- SQL injection attempts
- Malformed input
- Unexpected request parameters

See:

```text
docs/security-testing.md
```

---

## Security Principles

SecureVault follows several core principles:

### Least Privilege

Users should only access resources they are authorized to access.

### Defense in Depth

Security does not depend on a single control.

For example:

```text
Authentication
      +
Authorization
      +
Input Validation
      +
Rate Limiting
      +
Encryption
      +
Security Headers

```

### Secure by Default

Sensitive information should not be exposed unless explicitly required.

### Never Trust Client Input

Client-controlled values such as:

```text
filename
MIME type
user ID
resource ID
role
```

are not trusted without server-side validation and authorization.

---

## Environment Variables

Required configuration is stored outside the source code.

Example:

```env
DATABASE_URL=
JWT_SECRET=
REDIS_URL=
SESSION_SECRET=
SECRET_ENCRYPTION_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
```

A template is provided in:

```text
.env.example
```

Never commit:

```text
.env
```

to version control.

---

## Development Notes

Before starting development, make sure the following services are available:

```text
Node.js
PostgreSQL
Redis
```

Then configure:

```text
.env
```

and run the database migrations.

---

## Limitations

SecureVault is a security-focused educational and portfolio project.

Current limitations include:

- HTTPS/TLS is not implemented directly by the development server.
- Production deployment hardening is outside the scope of the current project.
- File encryption at rest is not implemented for uploaded documents.
- A complete enterprise audit infrastructure is outside the current scope.
- Full ASVS Level 2/3 compliance is not claimed.
- Additional penetration testing would be required before production use.

---

## Future Improvements

Possible future improvements include:

- HTTPS/TLS deployment
- Secure production reverse proxy configuration
- Stronger session cookie configuration for production
- Document encryption at rest
- Key rotation
- External secret management
- Centralized structured logging
- Security monitoring
- Automated security tests in CI/CD
- Dependency vulnerability scanning
- Containerized deployment
- Automated OWASP security testing
- Advanced audit-log retention policies

---

## Security Disclaimer

This project is intended for **educational, research and portfolio purposes**.

It should not be considered production-ready solely because security controls are implemented.

A production deployment should additionally include:

- HTTPS/TLS
- Secure infrastructure configuration
- Secret management
- Monitoring
- Backups
- Dependency management
- Security testing
- Penetration testing
- Incident response procedures

---

## Author

**Kallouche Abderraouf**

Master 2 Informatique — Ingénierie des Systèmes d’Information Avancés

Algeria

---

## License

This project is intended for educational and portfolio purposes.
