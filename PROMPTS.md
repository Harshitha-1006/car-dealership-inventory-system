# Raw Prompts

This file contains prompts used with AI tools during the development of the Car Dealership Inventory System.

---

## User

I am building a Car Dealership Inventory System. Help me build the project step by step while explaining what I am doing so that I can understand the implementation and explain it clearly.

---

## User

I want to use a simple technology stack that is suitable for a student project, help me divide the project into phases and suggest suitable Git commits after each phase.

---

## User

Explain the commands, folder structure, Prisma setup, SQLite database, and Git commits.

---

## User

Help me implement the backend features step by step:

- User registration
- Login
- JWT authentication
- Vehicle listing
- Vehicle search
- Vehicle purchase
- Stock validation
- Admin add vehicle
- Admin restock
- Admin delete

Keep the implementation simple and explain the code and testing process.

---

## User

After completing the backend, explain how I can test the API manually and what requests I should make for registration, login, vehicle operations, purchase, and admin actions.

---

## User

Help me build a simple React frontend that connects to my existing backend.

The frontend should include:

- Registration
- Login
- Vehicle dashboard
- Search
- Purchase
- Admin controls

---

## User

I didnt like the UI you gave I want the frontend UI to follow the style of the reference design I provided.

Use a dark automotive design with a professional layout and a consistent color palette for the pages.

---

## User

Help me improve the user interaction for vehicle operations: when a user purchases a vehicle, show a success popup if the vehicle is available, show an out-of-stock popup if the quantity is zero, and temporarily change the button text while the request is processing; for admin actions, show a confirmation before deleting a vehicle and show loading text while adding or restocking a vehicle, while keeping the existing API functionality unchanged.

---

## User

se
- add admin-only PUT /vehicles/:id with per-field validation
- centralize JWT secret into getJwtSecret() to remove duplicated fallback
- add corresponding test coverage
Co-authored-by: Claude
(END)  im getting like this from the time i runned this command  git log -1 --format="%B" what should i do

---

## User

again frontend is only showing kia vehicle i want some 20-30 cars and it shoulb be in stock and when i click purchase it should pop a msg like purchase is made or you know right once we click on purchase it shold show some pop up

---

## User

PS C:\Users\harsh\car-dealership-inventory-system\backend> npx prisma migrate deploy
Loaded Prisma config from prisma.config.ts.
Prisma schema loaded from prisma\schema.prisma.
Datasource "db": SQLite database "dev.db%22JWT_SECRET=%22car-dealership-dev-secret" at "file:./dev.db"JWT_SECRET="car-dealership-dev-secret"
Error: Schema engine error:
Failed to open SQLite database.
The filename, directory name, or volume label syntax is incorrect. (os error 123)

---

## User

```dotenv
# Environment variables declared in this file are NOT automatically loaded by Prisma.
# Please add `import "dotenv/config";` to your `prisma.config.ts` file, or use the Prisma CLI with Bun
# to load environment variables from .env files: https://pris.ly/prisma-config-env-vars.

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="file:./dev.db"JWT_SECRET="car-dealership-dev-secret"
```

---

## User

till here everything is goot but when i click purchase it is not working properly once you only check i asked for when i click purchase i want a pop up that the car is purchased or anyidea which looks good and basic not complicated

---
