# Test Report

**Status:** Passing  
**Generated:** 23 August 2026  
**Test Framework:** Jest + Supertest (Backend), Vitest + React Testing Library (Frontend)

## Summary

| Area | Test Files | Tests | Result |
|---|---:|---:|---|
| Backend | 4 | 27 | Passed |
| Frontend | 1 | 1 | Passed |
| **Total** | **5** | **28** | **Passed** |

## Commands Executed

### Backend

```bash
cd backend
npx prisma generate
npx prisma db push
npm test

Backend result:

Test Suites: 4 passed, 4 total
Tests:       27 passed, 27 total
Snapshots:   0 total
Time:        6.123 s
Frontend
cd frontend
npm test

Frontend result:

Test Files  1 passed (1)
Tests       1 passed (1)
Backend Coverage Scope
Health — health.test.ts — 1 test
GET /api/health returns { status: 'ok' }.
Authentication — authRoutes.test.ts — 6 tests
Registers a new user with valid data.
Rejects registration with missing fields (400).
Rejects duplicate email registration (409).
Logs in a valid user and returns a JWT.
Rejects login with an invalid password (401).
Rejects login for an email that doesn't exist (401).
Vehicles — vehicleRoutes.test.ts — 11 tests
Blocks unauthenticated access to fetch, search, and purchase.
Creates a vehicle with valid data.
Rejects vehicle creation with missing fields (400).
Rejects vehicle creation with negative price or quantity (400).
Lists all vehicles.
Searches vehicles with optional filters.
Handles the empty-result search case.
Purchases a vehicle and decrements quantity by 1.
Returns 404 when purchasing a vehicle that doesn't exist.
Returns 400 when purchasing a vehicle with quantity ≤ 0.
Admin Vehicle Routes — adminVehicleRoutes.test.ts — 9 tests
Blocks requests with a missing token (401), including update.
Blocks requests with an invalid token (401).
Blocks a non-admin user (403).
Allows an admin to delete a vehicle.
Allows an admin to restock a vehicle.
Allows an admin to update a vehicle.
Returns 404 for a nonexistent vehicle.
Frontend Coverage Scope
VehicleCard — VehicleCard.test.tsx — 1 test

The frontend test verifies the out-of-stock behavior:

Renders a vehicle with quantity = 0.
Displays the OUT OF STOCK button.
Verifies that the OUT OF STOCK button is disabled.
Uses React Testing Library to test the actual VehicleCard component.

Test result:

✓ VehicleCard
  ✓ disables the purchase button when the vehicle is out of stock

Test Files  1 passed (1)
Tests       1 passed (1)
Frontend Testing Setup

The frontend uses the following testing tools:

Vitest — test runner.
React Testing Library — React component testing.
jsdom — browser-like test environment.
Testing Library Jest DOM — DOM-specific assertions such as toBeDisabled().

The frontend package.json includes the following test scripts:

"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "oxlint",
  "test": "vitest",
  "test:coverage": "vitest --coverage",
  "preview": "vite preview"
}
Manual End-to-End Verification

The following flows should be demonstrated manually against the running application using the SQLite dev.db database through Prisma:

Register and log in as a standard user.
Seed or manually promote a user to admin and log in.
As an admin:
Create a vehicle.
Filter and search vehicles.
Update a vehicle.
Restock a vehicle.
Delete a vehicle.
As a standard user:
Purchase an in-stock vehicle.
Confirm the success toast.
Confirm the listed quantity decreases by 1.
Confirm that a vehicle with quantity 0:
Displays OUT OF STOCK.
Has the purchase button disabled.
Known Gaps
Frontend automated testing currently covers only the VehicleCard out-of-stock behavior.
No automated frontend tests currently cover registration, login, searching, purchasing, admin operations, or other UI flows.
No CI workflow currently runs these tests automatically on push or pull request.
Purchase decrement is implemented as a read-then-write operation rather than a single atomic conditional update. See ARCHITECTURE.md for details.
The current report records test counts, not overall source-code coverage percentages. Run npm run test:coverage in the frontend and the equivalent coverage command in the backend if percentage-based code coverage is required.
Overall Result
Backend:
4 test suites
27 tests
27 passed

Frontend:
1 test suite
1 test
1 passed

--------------------------------
Total:
5 test suites
28 tests
28 passed

Overall test status: PASSING ✅