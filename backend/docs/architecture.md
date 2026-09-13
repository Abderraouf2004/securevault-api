# SecureVault — Architecture

## 1. Overview

SecureVault is a REST API built with Node.js and TypeScript for secure user, document, and secret management.

The application follows a layered architecture that separates:

- HTTP/API routing
- Controllers
- Business logic
- Data access
- Infrastructure services
- Security middleware
- Domain-specific modules

The main technologies used are:

- Node.js
- TypeScript
- Express 5
- PostgreSQL
- Prisma ORM
- Redis
- JWT
- Argon2id
- AES-256-GCM
- Joi
- Multer
- Helmet
- OAuth 2.0 / OpenID Connect with Google

---

## 2. High-Level Architecture

The application follows this general request flow:

```text
Client
  |
  v
Express Application
  |
  +--> Security Middleware
  |      |
  |      +--> Helmet
  |      +--> Session
  |      +--> Rate Limiting
  |
  v
API Routes
  |
  v
Controller
  |
  v
Service
  |
  v
Repository
  |
  v
Prisma
  |
  v
PostgreSQL
```

Some features also use dedicated infrastructure services:

```text
Authentication
    |
    +--> JWT Token Service
    +--> Argon2id Hash Service
    +--> Redis
    +--> Google OAuth/OIDC

Secrets
    |
    +--> Encryption Service
    +--> PostgreSQL

Documents
    |
    +--> File Storage
    +--> PostgreSQL
```

---

## 3. Project Structure

The main application structure is:

```text
src/
├── apis/
│   ├── auth/
│   ├── documents/
│   ├── secrets/
│   ├── users/
│   └── index.ts
│
├── core/
│   ├── auth/
│   ├── documents/
│   ├── secrets/
│   └── users/
│
├── errors/
│
├── middleware/
│
├── modules/
│   ├── auth/
│   ├── documents/
│   ├── secrets/
│   └── users/
│
├── services/
│
├── types/
│
└── app.ts

prisma/
├── schema.prisma
└── seed.ts

docs/
├── security-decisions.md
├── security-requirements.md
├── data-protection.md
└── architecture.md
```

---

## 4. API Layer

The `src/apis` directory contains the HTTP routing layer.

It defines the API endpoints and connects them to the appropriate controllers.

Main API areas:

```text
/apis/auth
/apis/documents
/apis/secrets
/apis/users
```

The API layer is responsible for routing HTTP requests to the corresponding application controllers.

Business logic is not implemented directly inside the route definitions.

---

## 5. Controller Layer

Controllers are located under:

```text
src/core/
```

Each domain has its own controller.

```text
src/core/auth/controller.ts
src/core/documents/controller.ts
src/core/secrets/controller.ts
src/core/users/controller.ts
```

Controllers are responsible for handling HTTP-level concerns such as:

- Reading request parameters
- Reading request bodies
- Reading authentication headers
- Calling application services
- Returning HTTP responses
- Passing errors to the Express error-handling system

Controllers do not directly implement database operations.

For example:

```text
HTTP Request
    |
    v
Auth Controller
    |
    v
Auth Service
```

---

## 6. Service Layer

Business logic is implemented in service files:

```text
src/core/auth/service.ts
src/core/documents/service.ts
src/core/secrets/service.ts
src/core/users/service.ts
```

The service layer is responsible for application and business rules.

Examples include:

- User registration
- Password verification
- Authentication
- JWT generation and verification
- Token refresh
- Logout and token revocation
- Document ownership checks
- Secret ownership checks
- Secret encryption and decryption
- Document operations

The service layer acts as the main application logic layer between controllers and repositories.

---

## 7. Repository Layer

Repositories are responsible for database access.

Examples:

```text
src/core/auth/repo.ts
src/core/documents/repo.ts
src/core/secrets/repo.ts
src/core/users/repo.ts
```

Repositories use Prisma to communicate with PostgreSQL.

The intended flow is:

```text
Controller
    |
    v
Service
    |
    v
Repository
    |
    v
Prisma
    |
    v
PostgreSQL
```

This separation keeps database operations isolated from HTTP handling and business logic.

---

## 8. Database Architecture

PostgreSQL is the application's persistent database.

Prisma is used as the ORM and database access layer.

The main entities include:

```text
User
Role
Document
Secret
```

Relationships are enforced through Prisma relations.

For example, documents and secrets are associated with their owner through `ownerId`.

```text
User
 |
 +---- Document
 |
 +---- Secret
```

Resource ownership is used as part of the authorization model.

---

## 9. Authentication Architecture

SecureVault supports authentication using local credentials and Google OAuth/OIDC.

### Local Authentication

The local authentication flow is:

```text
Client
  |
  v
Auth API
  |
  v
Auth Controller
  |
  v
Auth Service
  |
  +--> User Repository
  |
  +--> Argon2id Hash Service
  |
  +--> JWT Token Service
  |
  v
Access Token + Refresh Token
```

Passwords are never stored as plaintext.

The password hashing service uses Argon2id.

---

## 10. JWT Architecture

JWT handling is implemented in:

```text
src/services/token.ts
```

JWT signing and verification use the secret configured through:

```text
JWT_SECRET
```

The authentication system uses:

- Access tokens
- Refresh tokens
- Token verification
- Token expiration
- Redis-based token revocation for logout

The JWT payload contains the authenticated user's identity and role information rather than passwords or secret values.

---

## 11. Logout and Redis

Redis is used for server-side token revocation.

The logout flow is:

```text
Client
  |
  v
Logout Endpoint
  |
  v
Auth Service
  |
  v
Redis
  |
  v
Token Blacklisted Until Expiration
```

This allows a token to be rejected before its normal expiration time after logout.

Redis configuration is provided through:

```text
REDIS_URL
```

---

## 12. Google OAuth / OpenID Connect

Google authentication is implemented under:

```text
src/apis/auth/oauth/
src/modules/auth/oauth/
```

The application uses Google as an external identity provider.

The OAuth/OIDC configuration is provided through environment variables:

```text
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI
```

The OAuth flow is handled separately from the local username/password authentication flow.

---

## 13. Authorization Architecture

Authentication determines who the user is.

Authorization determines whether that user can access a specific resource.

SecureVault uses resource ownership checks for sensitive resources.

For example:

```text
Authenticated User
        |
        v
Resource Request
        |
        v
Check ownerId
        |
   +----+----+
   |         |
 Owner     Not Owner
   |         |
 Allow      Reject
```

This protection is applied to documents and secrets to prevent unauthorized resource access and IDOR vulnerabilities.

---

## 14. Secret Vault Architecture

Secrets are managed through:

```text
src/core/secrets/
src/apis/secrets/
src/services/encryption.ts
```

Secret values are encrypted before being stored in PostgreSQL.

The encryption service uses:

```text
AES-256-GCM
```

The encryption key is provided through:

```text
SECRET_ENCRYPTION_KEY
```

The encryption flow is:

```text
Secret Value
    |
    v
AES-256-GCM Encryption
    |
    v
Encrypted Value
    |
    v
PostgreSQL
```

When an authorized owner requests a secret:

```text
PostgreSQL
    |
    v
Encrypted Value
    |
    v
Owner Authorization Check
    |
    v
AES-256-GCM Decryption
    |
    v
Secret Value
```

Decryption is performed only after the resource ownership check.

---

## 15. Document Architecture

Documents are handled through:

```text
src/core/documents/
src/modules/documents/
```

The upload system uses Multer with memory storage.

Uploaded files are subject to:

- File size restrictions
- File type validation
- Magic-byte validation
- Server-side generated filenames
- Resource ownership checks

Files are stored using generated UUID-based filenames rather than trusting the original filename as the storage name.

Document metadata is stored in PostgreSQL.

The general flow is:

```text
Client
  |
  v
Multer
  |
  v
File Validation
  |
  +--> Size Validation
  |
  +--> Magic-Byte Validation
  |
  v
Document Service
  |
  +--> File Storage
  |
  +--> PostgreSQL Metadata
```

---

## 16. Security Middleware

Security-related middleware is configured in:

```text
src/app.ts
src/middleware/
```

The application uses:

### Helmet

Helmet is enabled to provide security-related HTTP response headers.

```text
app.use(helmet());
```

### Rate Limiting

A global API rate limiter is applied to protect the application from excessive requests.

### Express Session

Express session is configured for session-based functionality such as OAuth/OIDC handling.

The session secret is provided through:

```text
SESSION_SECRET
```

### Cache Control

Sensitive API responses use:

```text
Cache-Control: no-store
```

to prevent sensitive responses from being cached.

---

## 17. Input Validation

Joi is used for request validation.

Validation is performed before application logic processes validated input.

The architecture separates:

```text
Input Validation
        |
        v
Business Rules
        |
        v
Database Operations
```

Input validation is not considered a replacement for authorization or business logic.

---

## 18. Error Handling

The application contains a dedicated error-handling structure:

```text
src/errors/
```

Errors are handled through Express middleware rather than exposing internal implementation details directly to clients.

The architecture separates application errors from normal successful responses.

---

## 19. Configuration and Secrets

Sensitive configuration is provided through environment variables.

Examples include:

```text
DATABASE_URL
JWT_SECRET
REDIS_URL
SESSION_SECRET
SECRET_ENCRYPTION_KEY
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI
```

Environment files containing secrets are excluded from source control.

A template is provided through:

```text
.env.example
```

The application validates important security configuration when the corresponding services are initialized.

---

## 20. Security Boundaries

The main security boundaries are:

```text
                    ┌──────────────────┐
                    │      Client      │
                    └────────┬─────────┘
                             │
                             v
                    ┌──────────────────┐
                    │    Express API   │
                    └────────┬─────────┘
                             │
                 Authentication /
                 Authorization
                             │
                             v
                    ┌──────────────────┐
                    │ Application Core │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              v              v              v
          PostgreSQL       Redis       File Storage
```

Sensitive operations must pass through the application security controls before accessing protected resources.

---

## 21. Data Flow

### Authentication

```text
Client
  |
  v
Auth API
  |
  v
Controller
  |
  v
Auth Service
  |
  +--> PostgreSQL
  |
  +--> Argon2id
  |
  +--> JWT
  |
  +--> Redis
```

### Secret Access

```text
Client
  |
  v
Authentication
  |
  v
Authorization / Owner Check
  |
  v
Secret Repository
  |
  v
PostgreSQL
  |
  v
Encrypted Secret
  |
  v
AES-256-GCM Decryption
  |
  v
Authorized Client
```

### Document Access

```text
Client
  |
  v
Authentication
  |
  v
Authorization / Owner Check
  |
  v
Document Service
  |
  +--> PostgreSQL Metadata
  |
  +--> File Storage
```

---

## 22. Architectural Security Principles

The architecture follows these principles:

### Separation of Concerns

HTTP handling, business logic, database access, and infrastructure services are separated.

### Least Privilege

Users must only access resources for which they have authorization.

### Defense in Depth

Security controls exist at multiple layers:

- Input validation
- Authentication
- Authorization
- Rate limiting
- Security headers
- Encryption
- Password hashing
- Token revocation
- Ownership checks
- Environment-based secrets

### Sensitive Data Protection

Sensitive data receives stronger protection depending on its type.

Passwords use one-way password hashing.

Recoverable secrets use authenticated encryption.

Access tokens and other credentials are not intended to be written to application logs.

### Secure Defaults

Security-sensitive configuration is centralized and provided through environment variables rather than hardcoded credentials.

---

## 23. Current Architecture Limitations

The current architecture is designed as a modular monolithic REST API.

It does not currently use:

- Microservices
- Message queues
- Event-driven distributed services
- A dedicated API gateway
- A dedicated secrets manager such as HashiCorp Vault
- A hardware security module (HSM)
- Distributed object storage

These components are outside the current implementation scope.

---

## 24. Architecture Evolution

The current layered architecture provides clear boundaries that can be extended later.

Potential future improvements include:

- Dedicated production secret management
- Encrypted document storage at rest
- Stronger production TLS configuration
- Dedicated audit logging
- More granular authorization policies
- Dedicated object storage
- Background processing for expensive operations
- Additional security monitoring

These are future architectural considerations and are not currently part of the implemented system.
