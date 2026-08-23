import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../index';
import prisma from '../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

const createToken = (role: 'user' | 'admin', userId: number) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '1h' });
};

describe('Admin vehicle routes', () => {
  beforeEach(async () => {
    await prisma.vehicle.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('returns 401 when token is missing', async () => {
    const response = await request(app).delete('/api/vehicles/1');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authentication token required');
  });

  it('returns 401 when updating a vehicle without a token', async () => {
    const response = await request(app).put('/api/vehicles/1').send({ quantity: 3 });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authentication token required');
  });

  it('returns 401 when token is invalid', async () => {
    const response = await request(app)
      .delete('/api/vehicles/1')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid or expired token');
  });

  it('returns 403 for a normal user', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'user@example.com',
        password: 'hashed-password',
        role: 'user',
      },
    });

    const token = createToken('user', user.id);

    const response = await request(app)
      .delete(`/api/vehicles/1`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Admin access required');
  });

  it('allows an admin to delete a vehicle', async () => {
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: 'hashed-password',
        role: 'admin',
      },
    });

    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Tesla',
        model: 'Model 3',
        category: 'Sedan',
        price: 35000,
        quantity: 4,
      },
    });

    const token = createToken('admin', admin.id);

    const response = await request(app)
      .delete(`/api/vehicles/${vehicle.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Vehicle deleted successfully');

    const deletedVehicle = await prisma.vehicle.findUnique({ where: { id: vehicle.id } });
    expect(deletedVehicle).toBeNull();
  });

  it('allows an admin to restock a vehicle', async () => {
    const admin = await prisma.user.create({
      data: {
        email: 'admin2@example.com',
        password: 'hashed-password',
        role: 'admin',
      },
    });

    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'BMW',
        model: 'X5',
        category: 'SUV',
        price: 60000,
        quantity: 2,
      },
    });

    const token = createToken('admin', admin.id);

    const response = await request(app)
      .post(`/api/vehicles/${vehicle.id}/restock`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 4 });

    expect(response.status).toBe(200);
    expect(response.body.quantity).toBe(6);
  });

  it('allows an admin to update a vehicle', async () => {
    const admin = await prisma.user.create({
      data: {
        email: 'admin-update@example.com',
        password: 'hashed-password',
        role: 'admin',
      },
    });

    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Honda',
        model: 'City',
        category: 'Sedan',
        price: 18000,
        quantity: 3,
      },
    });

    const token = createToken('admin', admin.id);

    const response = await request(app)
      .put(`/api/vehicles/${vehicle.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        price: 21000,
        quantity: 5,
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: vehicle.id,
      make: 'Honda',
      model: 'City',
      category: 'Sedan',
      price: 21000,
      quantity: 5,
    });
  });

  it('returns 404 for a nonexistent vehicle', async () => {
    const admin = await prisma.user.create({
      data: {
        email: 'admin3@example.com',
        password: 'hashed-password',
        role: 'admin',
      },
    });

    const token = createToken('admin', admin.id);

    const response = await request(app)
      .delete('/api/vehicles/999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Vehicle not found');
  });
});
