# Car Dealership Inventory System

A simple full-stack web application for managing a car dealership inventory. Users can register, log in, view and search vehicles, and purchase vehicles when stock is available. Admin users can add, restock, and delete vehicles.

The project uses Prisma with SQLite for persistence and JWT for authentication.

## Features

- User registration and login
- JWT authentication
- User and admin roles
- View and search vehicles
- Purchase vehicles with stock validation
- Admin add, restock, and delete operations
- SQLite database using Prisma
- Backend testing with Jest and Supertest

## Tech Stack

### Backend

- Node.js
- Express
- TypeScript
- Prisma
- SQLite
- bcrypt
- JWT
- Jest
- Supertest

### Frontend

- React
- TypeScript
- Vite
- CSS

## Project Structure

```text
car-dealership-inventory-system/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── __tests__/
│   │   ├── lib/
│   │   │   └── prisma.ts
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   └── vehicleRoutes.ts
│   │   ├── index.ts
│   │   └── ...
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── main.tsx
│   │   └── index.css
│   └── package.json
├── README.md
├── PROMPTS.md
└── .gitignore
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | /api/auth/register | Register a user |
| POST | /api/auth/login | Login and receive a JWT |

### Vehicles

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /api/vehicles | Get all vehicles |
| GET | /api/vehicles/search | Search vehicles |
| POST | /api/vehicles | Add a vehicle |
| PUT | /api/vehicles/:id | Update a vehicle |
| POST | /api/vehicles/:id/purchase | Purchase a vehicle |
| POST | /api/vehicles/:id/restock | Restock a vehicle |
| DELETE | /api/vehicles/:id | Delete a vehicle |

Some routes require authentication, and admin-only operations require the admin role.

## Backend Setup Instructions

```bash
cd backend
npm install
npm run seed
npm run dev
```

The backend runs on:

```text
http://localhost:3000
```

## Frontend Setup Instructions

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Test Instructions

```bash
cd backend
npm test
```

For coverage:

```bash
cd backend
npm run test:coverage
```

## Test Coverage

The current backend coverage report from the project run is:

```text
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|-------------------
All files          |   84.15 |    64.89 |   92.85 |   83.91 |
 src               |   88.88 |    66.66 |      50 |   88.88 |
  index.ts         |   88.88 |    66.66 |      50 |   88.88 | 23-24
 src/lib           |     100 |      100 |     100 |     100 |
  prisma.ts        |     100 |      100 |     100 |     100 |
 src/middleware    |      92 |       80 |     100 |    90.9 |
  ...Middleware.ts |      92 |       80 |     100 |    90.9 | 17,40
 src/routes        |   81.33 |    60.52 |     100 |   81.33 |
  authRoutes.ts    |   89.18 |    77.77 |     100 |   89.18 | 17,23,55,59
  vehicleRoutes.ts |   78.76 |    55.17 |     100 |   78.76 | ...27,254,258,268
-------------------|---------|----------|---------|---------|-------------------

Test Suites: 4 passed, 4 total
Tests:       27 passed, 27 total
Snapshots:   0 total
Time:        5.516 s, estimated 6 s
```

## Screenshots

### Login Page

![Login Page](./screenshots/login.png)

### Vehicle Dashboard

![Vehicle Dashboard](./screenshots/dashboard.png)

### Admin Controls

![Admin Controls](./screenshots/admin-controls.png)

## My AI Usage

I used Codex, Claude and figma during development to understand the project structure, authentication flow, Prisma setup, API routes, testing, and frontend implementation.

AI was mainly used as a development assistant to help generate ideas, explain concepts, and speed up implementation. I reviewed the generated code, ran the application and tests, and checked the main features such as registration, login, vehicle operations, stock validation, and admin controls.

The actual AI conversations and prompts used during development are included in PROMPTS.md.
