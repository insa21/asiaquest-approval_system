# 📋 Approval System

> A fullstack insurance claim approval application with a sequential workflow engine, role-based access control, activity log tracking, API documentation, and automated feature testing.

---

## 📌 Project Overview

**Approval System** is a production-grade fullstack application built as a Technical Test submission for a Middle Fullstack Developer position. It simulates a real-world insurance claim approval pipeline where claims are submitted by users, reviewed by verifiers, and approved or rejected by approvers — in a strict, auditable sequential flow.

The backend is built with **Laravel 12** using Clean Architecture principles (Service Layer, Repository Pattern, Form Request, Resource, Enum). The frontend is built with **React + TypeScript** using an **Atomic Design** structure for scalable, maintainable UI components.

---

## ✨ Key Features

- 🔐 **API Token Authentication** via Laravel Sanctum
- 👥 **Role-Based Access Control (RBAC)** via Spatie Laravel Permission
- 📝 **Claim CRUD** — create, view, and manage insurance claims
- 🔄 **Sequential Approval Workflow** — enforced server-side with status validation and row locking
- 📜 **Activity Log Timeline** — every status change is recorded with actor, timestamp, and notes
- 📖 **Interactive API Documentation** — auto-generated via Scribe at `/docs`
- 📬 **Postman Collection** — ready-to-import collection and environment in `docs/postman/`
- 🧪 **Automated Feature Tests** — covering all workflow scenarios including unauthorized transitions
- 🛡️ **Race Condition Protection** — database transactions with `lockForUpdate()` on the backend
- 🚫 **Duplicate Submit Prevention** — button disabled state while requests are in-flight on the frontend
- 📱 **Responsive Dashboard** — clean, modern dark UI built with Tailwind CSS v4

---

## 🧰 Tech Stack

### Backend

| Category | Technology |
|---|---|
| Framework | Laravel 12 |
| Language | PHP 8.2+ |
| Database | PostgreSQL |
| Authentication | Laravel Sanctum (API Token) |
| Authorization | Spatie Laravel Permission |
| API Documentation | Scribe |
| Testing | PHPUnit |
| Architecture | Service Layer, Repository Pattern, Form Request, Resource, Enum, Trait |

### Frontend

| Category | Technology |
|---|---|
| Framework | React 19 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Server State | TanStack React Query v5 |
| Global State | Zustand v5 |
| HTTP Client | Axios |
| Form Management | React Hook Form |
| Validation | Zod |
| Icons | Lucide React |
| Architecture | Atomic Design (Elements → Fragments → Layouts → Pages) |

---

## 🔄 System Workflow

```
User                     Verifier                  Approver
 │                          │                          │
 ├─ Create Claim             │                          │
 │  (status: draft)         │                          │
 │                          │                          │
 ├─ Submit Claim ──────────►│                          │
 │  (draft → submitted)     │                          │
 │                          ├─ Review Claim ──────────►│
 │                          │  (submitted → reviewed)  │
 │                          │                          ├─ Approve Claim
 │                          │                          │  (reviewed → approved)
 │                          │                          │
 │                          │                          │─ Reject Claim
 │                          │                          │  (reviewed → rejected)
```

**Status Transition Rules:**
- `draft` → `submitted` *(by User only, for their own claims)*
- `submitted` → `reviewed` *(by Verifier only)*
- `reviewed` → `approved` or `rejected` *(by Approver only)*
- ⛔ **Status cannot be skipped** — all transitions are validated server-side

---

## 👥 Role Access Matrix

| Action | User | Verifier | Approver |
|---|:---:|:---:|:---:|
| Create Claim | ✅ | ❌ | ❌ |
| View Own Claims | ✅ | ❌ | ❌ |
| Submit Claim (draft → submitted) | ✅ | ❌ | ❌ |
| View Submitted Claims | ❌ | ✅ | ❌ |
| Review Claim (submitted → reviewed) | ❌ | ✅ | ❌ |
| View Reviewed Claims | ❌ | ❌ | ✅ |
| Approve Claim (reviewed → approved) | ❌ | ❌ | ✅ |
| Reject Claim (reviewed → rejected) | ❌ | ❌ | ✅ |

---

## 📁 Project Structure

```
approval-system/
├── backend/                        # Laravel 12 API
│   ├── app/
│   │   ├── Enums/                  # ClaimStatus, UserRole
│   │   ├── Http/
│   │   │   ├── Controllers/Api/    # AuthController, ClaimController
│   │   │   ├── Requests/           # LoginRequest, StoreClaimRequest, ChangeClaimStatusRequest
│   │   │   └── Resources/          # ClaimResource, ClaimActivityLogResource
│   │   ├── Repositories/
│   │   │   ├── Contracts/          # ClaimRepositoryInterface, ClaimActivityLogRepositoryInterface
│   │   │   └── Eloquent/           # EloquentClaimRepository, EloquentClaimActivityLogRepository
│   │   ├── Services/Claim/         # ClaimService, ClaimWorkflowService
│   │   ├── Support/                # ApiResponse trait
│   │   └── Models/                 # User, Claim, ClaimActivityLog
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/api.php
│   └── tests/Feature/              # ClaimWorkflowTest (9 scenarios)
│
├── frontend/                       # React + Vite + TypeScript
│   └── src/
│       ├── elements/               # Atomic: AppButton, StatusBadge, RoleBadge, etc.
│       ├── fragments/              # Atomic: LoginForm, ClaimForm, ClaimTable, etc.
│       │   ├── auth/
│       │   ├── claims/
│       │   ├── dashboard/
│       │   └── layout/
│       ├── layouts/                # DashboardLayout, AuthLayout
│       ├── pages/                  # LoginPage, DashboardPage, ClaimsPage, etc.
│       ├── routes/                 # AppRoutes, ProtectedRoute
│       ├── services/               # api.ts (Axios), claimService.ts
│       ├── stores/                 # authStore.ts (Zustand)
│       ├── hooks/                  # useLogin.ts, useCreateClaim.ts
│       ├── types/                  # auth.ts, claim.ts
│       └── lib/                    # formatters.ts, utils.ts
│
├── docs/
│   └── postman/                    # Postman Collection & Environment JSON
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- PHP 8.2+
- Composer
- PostgreSQL
- Node.js 18+
- npm

---

### Backend Installation

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install PHP dependencies
composer install

# 3. Copy environment file
cp .env.example .env

# 4. Generate application key
php artisan key:generate

# 5. Configure your PostgreSQL database in .env (see Environment Variables below)

# 6. Run migrations and seed demo accounts
php artisan migrate --seed

# 7. Start the development server
php artisan serve
```

The backend API will be available at: **`http://127.0.0.1:8000`**

---

### Frontend Installation

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install Node.js dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Set API base URL in .env (see Environment Variables below)

# 5. Start the development server
npm run dev
```

The frontend will be available at: **`http://localhost:5173`**

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=approval_system
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

---

## 👤 Demo Accounts

The database seeder creates three demo accounts ready to use out of the box:

| Role | Email | Password |
|---|---|---|
| **User** (Claimant) | `user@example.com` | `password` |
| **Verifier** (Finance) | `verifier@example.com` | `password` |
| **Approver** (Manager) | `approver@example.com` | `password` |

---

## 📖 API Documentation

Interactive API documentation is auto-generated by [Scribe](https://scribe.knuckles.wtf/) and available after running the backend:

```
http://127.0.0.1:8000/docs
```

The documentation includes:
- Complete endpoint reference with request/response examples
- Authentication guide
- Try-it-out interactive console

---

## 🗺️ API Endpoints

### Authentication

| Method | Endpoint | Auth Required | Description |
|---|---|:---:|---|
| `POST` | `/api/login` | ❌ | Login and receive API token |
| `POST` | `/api/register` | ❌ | Register new user account |
| `GET` | `/api/me` | ✅ | Get authenticated user profile |
| `POST` | `/api/logout` | ✅ | Revoke current API token |

### Claims

| Method | Endpoint | Auth Required | Description |
|---|---|:---:|---|
| `GET` | `/api/claims` | ✅ | List claims (filtered by role) |
| `POST` | `/api/claims` | ✅ | Create new claim (User only) |
| `GET` | `/api/claims/{id}` | ✅ | Get claim detail with activity log |

### Claim Workflow

| Method | Endpoint | Auth Required | Role Required | Description |
|---|---|:---:|:---:|---|
| `POST` | `/api/claims/{id}/submit` | ✅ | User | Submit draft claim |
| `POST` | `/api/claims/{id}/review` | ✅ | Verifier | Review submitted claim |
| `POST` | `/api/claims/{id}/approve` | ✅ | Approver | Approve reviewed claim |
| `POST` | `/api/claims/{id}/reject` | ✅ | Approver | Reject reviewed claim |

**All authenticated endpoints require the `Authorization: Bearer {token}` header.**

### Standard API Response Format

```json
// Success
{
  "success": true,
  "message": "Claim created successfully.",
  "data": { ... }
}

// Paginated
{
  "success": true,
  "message": "Claims retrieved successfully.",
  "data": [ ... ],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 10,
    "total": 25
  }
}

// Error
{
  "success": false,
  "message": "Validation failed.",
  "errors": { "title": ["The title field is required."] }
}
```

---

## 🧪 Testing

### Run Automated Tests

```bash
cd backend
php artisan test
```

### Test Coverage

All tests are located in `tests/Feature/ClaimWorkflowTest.php` and cover the following scenarios:

| # | Test Scenario | Expected Outcome |
|---|---|---|
| 1 | User can login successfully | Returns token and user profile |
| 2 | User can create claim as draft | Claim created with status `draft` |
| 3 | Complete approval workflow | Claim transitions `draft → submitted → reviewed → approved` |
| 4 | User cannot review claim | Returns 422 Unauthorized |
| 5 | Verifier cannot approve claim | Returns 422 Unauthorized |
| 6 | Status cannot skip from draft to approved | Returns 422 Invalid transition |
| 7 | Approver can reject reviewed claim | Claim transitions to `rejected` |

**Latest test result: 9 passed (42 assertions) — all green ✅**

---

## 📬 Postman Collection

A ready-to-import Postman collection and environment are available in the `docs/postman/` directory:

```
docs/
└── postman/
    ├── Approval_System.postman_collection.json
    └── Approval_System.postman_environment.json
```

**Import instructions:**
1. Open Postman
2. Click **Import** → select both JSON files
3. Set the `base_url` variable to `http://127.0.0.1:8000`
4. Use the **Login** request to obtain a token — it will be auto-saved to the environment
5. All subsequent requests will use the token automatically

---

## 🛡️ Security & Reliability

| Concern | Implementation |
|---|---|
| **Authentication** | Laravel Sanctum API token — stateless Bearer token per session |
| **Authorization** | Spatie Permission with role guards enforced at Request and Service layers |
| **Input Validation** | Form Request classes with fine-grained rules (`required`, `max:150`, `numeric`, `min:1`) |
| **Workflow Integrity** | Status transition validated in `ClaimWorkflowService` with descriptive exception on violation |
| **Race Condition** | Database transactions with `lockForUpdate()` in `EloquentClaimRepository::findLockedById()` |
| **Duplicate Requests** | Frontend disables all action buttons while mutation is in-flight (`isPending` state from React Query) |
| **API Response** | Consistent response format via `ApiResponse` trait — all errors follow the same JSON schema |
| **Error Handling** | Centralized exception handler in `bootstrap/app.php` for all HTTP status codes (401, 403, 404, 422, 500) |
| **CORS** | Configured in `config/cors.php` with explicit origin allowlist |

---

## 📸 Screenshots

> The following screenshots demonstrate the complete user journey across all three roles.

| Screen | Description |
|---|---|
| **Login Page** | Glassmorphic login portal with role-specific quick connect buttons |
| **Dashboard** | Role-aware dashboard with workflow overview and quick action card |
| **Claim List** | Paginated table with status badges, nominal highlights, and detail navigation |
| **Create Claim** | Form with client-side validation aligned to backend constraints |
| **Claim Detail** | Full claim information card with current status and action panel |
| **Activity Log** | Vertical timeline showing complete audit trail of status transitions |
| **API Documentation** | Scribe-generated interactive documentation at `/docs` |
| **Test Result** | PHPUnit test suite output showing 9 passed scenarios |

---

## 📝 Final Notes

This project was developed as a technical assessment submission. The implementation prioritizes:

- **Clean Architecture** — strict separation between Controllers, Services, Repositories, and Resources on the backend
- **Atomic Design** — consistent and reusable component hierarchy (Elements → Fragments → Layouts → Pages) on the frontend
- **Type Safety** — full TypeScript strict mode with Zod schema validation aligning frontend to backend constraints
- **Testability** — custom hooks isolate business logic from UI components, making each layer independently testable
- **Developer Experience** — barrel exports (`index.ts`), path aliases (`@/`), and consistent naming conventions throughout

---

<div align="center">

**Built with ❤️ for AQ Business Consulting Indonesia Technical Assessment**

</div>
