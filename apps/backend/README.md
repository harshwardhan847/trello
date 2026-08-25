# backend

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.4.0. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.



Your complete authentication flow
Signup
React
  │
  │ POST /api/v1/auth/signup
  │ { email, password, name }
  ▼
Express
  │
  ▼
Zod
  │
  ▼
bcrypt password
  │
  ▼
PostgreSQL
  │
  ├── User
  │
  └── RefreshToken
  │
  ├───────────────► accessToken → React memory
  │
  └───────────────► refreshToken → HttpOnly cookie
Login
POST /api/v1/auth/login
          │
          ▼
       Zod
          │
          ▼
    Find User
          │
          ▼
 bcrypt.compare()
          │
          ▼
   ┌──────┴──────┐
   ▼             ▼
access JWT    refresh JWT
15 min        30 days
   │             │
   ▼             ▼
 React       HttpOnly Cookie
Normal API request
React
  │
  │ Authorization: Bearer ACCESS_TOKEN
  ▼
Express
  │
  ▼
authenticate middleware
  │
  ├── valid → controller
  │
  └── expired → 401
Token refresh
React
  │
  │ POST /api/v1/auth/refresh
  │
  │ HttpOnly cookie automatically sent
  ▼
Express
  │
  ▼
verify refresh JWT
  │
  ▼
check RefreshToken DB
  │
  ▼
revoke old token
  │
  ├── new access token
  └── new refresh token
Logout
POST /api/v1/auth/logout
          │
          ▼
Find refresh token
          │
          ▼
Revoke in DB
          │
          ▼
Clear cookie
          │
          ▼
React removes access token