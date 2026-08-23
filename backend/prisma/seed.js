const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const connectionString = process.env.DATABASE_URL ?? 'file:./dev.db';
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

const vehicleSeed = [
  { make: 'Toyota', model: 'Camry', category: 'Sedan', price: 2800000, quantity: 5 },
  { make: 'Toyota', model: 'Fortuner', category: 'SUV', price: 3800000, quantity: 5 },
  { make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 2200000, quantity: 5 },
  { make: 'Toyota', model: 'Innova', category: 'MPV', price: 2600000, quantity: 5 },
  { make: 'Honda', model: 'City', category: 'Sedan', price: 1800000, quantity: 5 },
  { make: 'Honda', model: 'Civic', category: 'Sedan', price: 2400000, quantity: 5 },
  { make: 'Honda', model: 'Elevate', category: 'SUV', price: 2100000, quantity: 5 },
  { make: 'Hyundai', model: 'Creta', category: 'SUV', price: 2000000, quantity: 5 },
  { make: 'Hyundai', model: 'Tucson', category: 'SUV', price: 3000000, quantity: 5 },
  { make: 'Hyundai', model: 'Verna', category: 'Sedan', price: 1700000, quantity: 5 },
  { make: 'Kia', model: 'Seltos', category: 'SUV', price: 1900000, quantity: 5 },
  { make: 'Kia', model: 'Sportage', category: 'SUV', price: 2800000, quantity: 5 },
  { make: 'Kia', model: 'Sonet', category: 'SUV', price: 1600000, quantity: 5 },
  { make: 'BMW', model: '3 Series', category: 'Sedan', price: 6500000, quantity: 5 },
  { make: 'BMW', model: 'X5', category: 'SUV', price: 9800000, quantity: 5 },
  { make: 'BMW', model: 'X3', category: 'SUV', price: 7500000, quantity: 5 },
  { make: 'Mercedes-Benz', model: 'C-Class', category: 'Sedan', price: 7000000, quantity: 5 },
  { make: 'Mercedes-Benz', model: 'GLC', category: 'SUV', price: 7800000, quantity: 5 },
  { make: 'Mercedes-Benz', model: 'E-Class', category: 'Sedan', price: 8500000, quantity: 5 },
  { make: 'Audi', model: 'A4', category: 'Sedan', price: 5500000, quantity: 5 },
  { make: 'Audi', model: 'Q5', category: 'SUV', price: 7200000, quantity: 5 },
  { make: 'Audi', model: 'Q3', category: 'SUV', price: 5000000, quantity: 5 },
  { make: 'Tata', model: 'Nexon', category: 'SUV', price: 1500000, quantity: 5 },
  { make: 'Tata', model: 'Harrier', category: 'SUV', price: 2400000, quantity: 5 },
  { make: 'Tata', model: 'Safari', category: 'SUV', price: 2600000, quantity: 5 },
  { make: 'Mahindra', model: 'XUV700', category: 'SUV', price: 2200000, quantity: 5 },
  { make: 'Mahindra', model: 'Thar', category: 'SUV', price: 1800000, quantity: 5 },
  { make: 'Mahindra', model: 'Scorpio', category: 'SUV', price: 2000000, quantity: 5 },
  { make: 'Volkswagen', model: 'Virtus', category: 'Sedan', price: 2000000, quantity: 5 },
  { make: 'Volkswagen', model: 'Taigun', category: 'SUV', price: 2100000, quantity: 5 },
];

async function seedVehicles() {
  for (const vehicle of vehicleSeed) {
    const existing = await prisma.vehicle.findFirst({
      where: {
        make: vehicle.make,
        model: vehicle.model,
        category: vehicle.category,
      },
      select: { id: true },
    });

    if (existing) {
      await prisma.vehicle.update({
        where: { id: existing.id },
        data: {
          price: vehicle.price,
          quantity: vehicle.quantity,
        },
      });
    } else {
      await prisma.vehicle.create({ data: vehicle });
    }
  }

  console.log(`Seeded ${vehicleSeed.length} demo vehicles.`);
}

seedVehicles()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
