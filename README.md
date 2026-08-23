# Car Dealership Inventory System

A simple full-stack web application for managing car dealership inventory. Users can register, log in, view and search vehicles, and purchase vehicles when stock is available. Admin users can add, restock, and delete vehicles.

The project uses Prisma with SQLite for database management and JWT for authentication.

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
- JSON Web Token
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
│   │   └── schema.prisma
│   ├── src/
│   │   ├── __tests__/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── lib/
│   │   └── index.ts
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   └── package.json
│
├── README.md
├── PROMPTS.md
└── .gitignore

API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register a user
POST	/api/auth/login	Login and receive a JWT
Vehicles
Method	Endpoint	Description
GET	/api/vehicles	Get all vehicles
GET	/api/vehicles/search	Search vehicles
POST	/api/vehicles	Add a vehicle
POST	/api/vehicles/:id/purchase	Purchase a vehicle
POST	/api/vehicles/:id/restock	Restock a vehicle
DELETE	/api/vehicles/:id	Delete a vehicle

Some routes require authentication, and admin operations require an admin role.

Running the Backend
cd backend
npm install
npx prisma migrate dev
npm run dev

The backend runs on:

http://localhost:3000

Running the Frontend
cd frontend
npm install
npm run dev

Open the Vite URL shown in the terminal, usually:

http://localhost:5173

Running Tests
cd backend
npm test

For test coverage:

npm run test:coverage
My AI Usage

I used Codex, Claude and figma during development to understand the project structure, authentication flow, Prisma setup, API routes, testing, and frontend implementation.

AI was mainly used as a development assistant to help generate ideas, explain concepts, and speed up implementation. I reviewed the generated code, ran the application and tests, and checked the main features such as registration, login, vehicle operations, stock validation, and admin controls.

The actual AI conversations and prompts used during development are included in PROMPTS.md.