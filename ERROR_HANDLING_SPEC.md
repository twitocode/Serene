# Project Specification: Unified Error Handling System

## 1. Objective

Refactor the application to use a unified, typed error handling strategy across the full stack (Hono Backend -> Shared Types -> Next.js Client -> React Query). The goal is to eliminate generic `console.error` logs, silent failures, and magic strings in favor of structured `AppError` (Server) and `ApiError` (Client).

## 2. Architecture Overview

### A. The Server (Hono)

* **Source of Truth:** `apps/server/src/lib/errors.ts`
* **Mechanism:** Throw `AppError` with specific status codes and error codes.
* **Output:** The Global Error Handler intercepts these and returns a standard JSON structure:
```json
{
  "success": false,
  "message": "Human readable message",
  "code": "ERROR_CODE",
  "issues": [] // Optional Zod issues
}

```



### B. The Client (Next.js & React Query)

* **Fetcher:** `apps/client/src/lib/api-fetch.ts` throws `ApiError` containing the server's JSON payload.
* **State Management:** `QueryClient` acts as the **Global Error Guard** for missing authentication (401) and server crashes (500).
* **Component Layer:** Individual components handle specific business errors (e.g., 400 Validation) but delegate Auth errors to the global handler.

---

## 3. Implementation Rules

### Rule 1: Server - The `AppError` Class

**File:** `apps/server/src/lib/errors.ts`
All business logic errors must use this class. Do not use standard `Error` or `HTTPException` directly in services.

```typescript
import { HTTPException } from "hono/http-exception";
import { ContentfulStatusCode } from "hono/utils/http-status";

export class AppError extends HTTPException {
  public readonly code: string;
  constructor(status: ContentfulStatusCode, message: string, code: string = "APP_ERROR") {
    super(status, { message });
    this.code = code;
  }
}

```

### Rule 2: Server - Service Layer Pattern

Services must catch low-level Database errors and re-throw them as `AppError`.

* **DO:** Check for `result.length === 0` on updates and throw 404.
* **DO:** Catch unique constraint violations (e.g., duplicate email) and throw 409.
* **DO NOT:** Return `null` or `false` to indicate failure. Always throw.

### Rule 3: Client - The `apiFetch` Utility

Ensure the fetcher wraps the response logic correctly.
**File:** `apps/client/src/lib/api-fetch.ts`

```typescript
export class ApiError extends Error {
  constructor(public message: string, public status: number, public data?: any) {
    super(message);
    this.name = "ApiError";
  }
}
// ... logic to throw new ApiError(json.message, response.status, json)

```

---

### Rule 4: React Query - Global Configuration

**File:** `apps/client/src/app/providers.tsx`

We must handle "Session Expiry" (401) and "Server Crashes" (500) globally to avoid checking them in every component.

**Requirements:**

1. **QueryCache:** Add a global `onError` handler.
2. **MutationCache:** Add a global `onError` handler.
3. **Logic:**
* If `error.status === 401`: Force a hard redirect to `/login` using `window.location.href`.
* If `error.status >= 500`: Show a generic "Server Error" toast.
* Ignore 400-series errors (let components handle validation).



**Template:**

```typescript
new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof ApiError && error.status === 401) {
         if (typeof window !== "undefined") window.location.href = "/login";
      }
    }
  }),
  // Repeat for mutationCache
})

```

### Rule 5: React Query - Component Usage

Components must type their errors explicitly to access the `code` property.

**DO:**

```tsx
import { ApiError } from "@/lib/api-fetch";

// 1. Explicitly type the Error generic
const { data, error } = useQuery<UserData, ApiError>({ ... });

// 2. Access custom properties
if (error?.status === 404) return <NotFound />;
if (error?.data?.code === "PREMIUM_ONLY") return <UpgradeModal />;

```

**DO NOT:**

* Do not redirect manually inside `useQuery` or `useEffect` for 401 errors (the Global Config handles this).
* Do not catch errors inside the `queryFn` unless you plan to return fallback data.

---

### Rule 6: Client - Server Actions & Helpers

Functions called by form handlers (actions) must catch `unknown` errors, handle the UI notification (Toast), and **re-throw** the error to stop the component state.

**Template:**

```typescript
export async function submitAction(data: any) {
  try {
    return await apiFetch("/some/endpoint", { method: "POST", body: data });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      // Optional: Handle specific logic (redirects)
      if (error.data?.code === "SPECIFIC_CODE") throw error;
      
      // Default: Toast the message
      toast.error(error.message);
    } else {
      toast.error("An unexpected error occurred.");
    }
    // CRITICAL: Re-throw to inform the UI component
    throw error;
  }
}

```

---

## 4. Standard Error Codes

Use these codes across the application to maintain consistency.

| Status | Code | Meaning |
| --- | --- | --- |
| **400** | `VALIDATION_ERROR` | Zod schema validation failed |
| **400** | `INVALID_INPUT` | Generic bad data |
| **400** | `INVALID_STEP_ORDER` | User tried to skip onboarding steps |
| **401** | `UNAUTHORIZED` | User is not logged in (Triggers Redirect) |
| **403** | `FORBIDDEN` | User is logged in but lacks permission |
| **404** | `NOT_FOUND` | Resource (User, Project, etc.) missing |
| **409** | `CONFLICT` | Duplicate entry (e.g., Email taken) |
| **500** | `SERVER_ERROR` | Unhandled exception / Crash |

---

## 5. Refactoring Checklist (For AI Agent)

When processing a file, follow this logic:

1. **Analyze Imports:** Does this file import `HTTPException`? Replace with `AppError`.
2. **Analyze Services:** Does this service perform a DB `update` or `delete`? Add a check for `.returning()` length and throw `AppError(404)` if empty.
3. **Analyze Providers:** Does `providers.tsx` have `QueryCache` and `MutationCache` configured with global 401 handling?
4. **Analyze Components:** Does `useQuery` have the `<..., ApiError>` generic?
5. **Analyze Magic Strings:** Replace hardcoded error messages like "User not found" with structured errors containing the code `USER_NOT_FOUND`.
