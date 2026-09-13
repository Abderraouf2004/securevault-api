# Security Decisions

## 1. Security Standard

The project uses OWASP ASVS 5.0 as the primary security reference.

The target verification level is Level 2.

The security requirements will be implemented progressively during development.

## 2. Authentication

The application will require authentication for protected resources.

Users must authenticate before accessing resources that require an identity.

## 3. Password Storage

User passwords will never be stored in plaintext.

Passwords will be securely hashed before being stored in the database.

## 4. Authorization

The application will verify that an authenticated user is authorized to access a requested resource.

Resource ownership and permissions will be checked on the server side.

## 5. Input Validation

User-controlled input will be validated before being processed by the application.

The application will not trust data received from clients.

## 6. Database Access

Database operations will use Prisma ORM and safe query mechanisms.

User-controlled input must not be directly concatenated into SQL queries.

## 7. Secrets

Sensitive secrets such as API keys, authentication secrets and encryption keys will not be stored directly in the source code.

Secrets will be provided through environment configuration or an appropriate secret-management mechanism.

## 8. Security Logging

Security-relevant events will be logged.

Sensitive information such as passwords, tokens and secret values must not be written to logs.

## 9. Error Handling

The API will return safe error messages to clients.

Internal implementation details such as stack traces, database errors and filesystem paths will not be exposed to users.
