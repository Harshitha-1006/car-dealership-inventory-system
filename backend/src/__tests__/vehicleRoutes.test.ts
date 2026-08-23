import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../index';
import prisma from '../lib/prisma';

describe('Vehicle API', () => {
  beforeEach(async () => {
    await prisma.vehicle.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('returns 401 when fetching vehicles without a token', async () => {
    const response = await request(app).get('/api/vehicles');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authentication token required');
  });

  it('returns 401 when searching vehicles without a token', async () => {
    const response = await request(app).get('/api/vehicles/search').query({ make: 'Toyota' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authentication token required');
  });

  it('returns 401 when purchasing a vehicle without a token', async () => {
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: 24000,
        quantity: 2,
      },
    });

    const response = await request(app).post(`/api/vehicles/${vehicle.id}/purchase`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authentication token required');
  });

  it('creates a vehicle with valid data', async () => {
    const vehicleData = {
      make: 'Toyota',
      model: 'Corolla',
      category: 'Sedan',
      price: 24000,
      quantity: 5,
    };

    const adminToken = jwt.sign({ userId: 1, role: 'admin' }, process.env.JWT_SECRET || 'secret-key', {
      expiresIn: '1h',
    });

    const response = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(vehicleData);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(vehicleData);
    expect(response.body).toHaveProperty('id');
  });

  it('returns 400 if required fields are missing', async () => {
    const adminToken = jwt.sign({ userId: 1, role: 'admin' }, process.env.JWT_SECRET || 'secret-key', {
      expiresIn: '1h',
    });

    const response = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        make: 'Toyota',
        model: 'Corolla',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/category|price|quantity/i);
  });

  it('returns 400 if price or quantity are negative', async () => {
    const adminToken = jwt.sign({ userId: 1, role: 'admin' }, process.env.JWT_SECRET || 'secret-key', {
      expiresIn: '1h',
    });

    const response = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: -100,
        quantity: 2,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/price|quantity/i);
  });

  it('returns all vehicles', async () => {
    await prisma.vehicle.createMany({
      data: [
        { make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 24000, quantity: 5 },
        { make: 'Ford', model: 'F-150', category: 'Truck', price: 35000, quantity: 3 },
      ],
    });

    const adminToken = jwt.sign({ userId: 1, role: 'admin' }, process.env.JWT_SECRET || 'secret-key', {
      expiresIn: '1h',
    });

    const response = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('searches vehicles using optional filters', async () => {
    await prisma.vehicle.createMany({
      data: [
        { make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 24000, quantity: 5 },
        { make: 'Toyota', model: 'Camry', category: 'Sedan', price: 28000, quantity: 2 },
        { make: 'Ford', model: 'Mustang', category: 'Coupe', price: 40000, quantity: 1 },
      ],
    });

    const adminToken = jwt.sign({ userId: 1, role: 'admin' }, process.env.JWT_SECRET || 'secret-key', {
      expiresIn: '1h',
    });

    const response = await request(app)
      .get('/api/vehicles/search')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ make: 'Toyota', category: 'Sedan', minPrice: '22000', maxPrice: '30000' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body.every((vehicle: { make: string }) => vehicle.make === 'Toyota')).toBe(true);
  });

  it('returns 200 with empty array when no search results match', async () => {
    await prisma.vehicle.createMany({
      data: [
        { make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 24000, quantity: 5 },
      ],
    });

    const adminToken = jwt.sign({ userId: 1, role: 'admin' }, process.env.JWT_SECRET || 'secret-key', {
      expiresIn: '1h',
    });

    const response = await request(app)
      .get('/api/vehicles/search')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ make: 'BMW', category: 'SUV' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('purchases a vehicle and decreases quantity by 1', async () => {
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Nissan',
        model: 'Altima',
        category: 'Sedan',
        price: 26000,
        quantity: 2,
      },
    });

    const adminToken = jwt.sign({ userId: 1, role: 'admin' }, process.env.JWT_SECRET || 'secret-key', {
      expiresIn: '1h',
    });

    const response = await request(app)
      .post(`/api/vehicles/${vehicle.id}/purchase`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.quantity).toBe(1);
  });

  it('returns 404 when trying to purchase a vehicle that does not exist', async () => {
    const adminToken = jwt.sign({ userId: 1, role: 'admin' }, process.env.JWT_SECRET || 'secret-key', {
      expiresIn: '1h',
    });

    const response = await request(app)
      .post('/api/vehicles/999/purchase')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Vehicle not found');
  });

  it('returns 400 when quantity is 0 or less during purchase', async () => {
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Kia',
        model: 'Sportage',
        category: 'SUV',
        price: 30000,
        quantity: 0,
      },
    });

    const adminToken = jwt.sign({ userId: 1, role: 'admin' }, process.env.JWT_SECRET || 'secret-key', {
      expiresIn: '1h',
    });

    const response = await request(app)
      .post(`/api/vehicles/${vehicle.id}/purchase`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Vehicle quantity is 0 or less');
  });
});

