import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../index';
import prisma from '../lib/prisma';

describe('Auth API', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('registers a new user with valid data', async () => {
    const userData = {
      email: 'student@example.com',
      password: 'securePassword123',
    };

    const response = await request(app).post('/api/auth/register').send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe(userData.email);
    expect(response.body.role).toBe('user');
    expect(response.body.password).toBeUndefined();
  });

  it('returns 400 if registration data is missing', async () => {
    const response = await request(app).post('/api/auth/register').send({
      email: 'student@example.com',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/email and password/i);
  });

  it('returns 409 if email is already registered', async () => {
    await prisma.user.create({
      data: {
        email: 'dup@example.com',
        password: 'hashedpassword',
      },
    });

    const response = await request(app).post('/api/auth/register').send({
      email: 'dup@example.com',
      password: 'newPassword123',
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Email already in use');
  });

  it('logs in a valid user and returns a token', async () => {
    const email = 'login@example.com';
    const password = 'Password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const response = await request(app).post('/api/auth/login').send({
      email,
      password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.role).toBe('user');
  });

  it('returns 401 for invalid password', async () => {
    const email = 'wrongpass@example.com';
    const hashedPassword = await bcrypt.hash('CorrectPassword123', 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const response = await request(app).post('/api/auth/login').send({
      email,
      password: 'wrongPassword',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid email or password');
  });

  it('returns 401 if login email does not exist', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'missing@example.com',
      password: 'Password123',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid email or password');
  });
});
