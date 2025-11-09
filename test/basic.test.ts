import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import dotenv from 'dotenv';
import { basicPort } from '../src/constants.ts';

dotenv.config();

const PORT = process.env.PORT || basicPort;
const HOST = process.env.HOST || 'localhost';

const BASE_URL = `http://${HOST}:${PORT}`;

beforeAll(() => {
  console.log('🚀 ===========================================');
  console.log('🚀 Starting API Tests');
  console.log('🚀 Make sure the server is running with:');
  console.log('🚀 npm run start:dev');
  console.log('🚀 Server should be available at:');
  console.log(`🚀 ${BASE_URL}`);
  console.log('🚀 ===========================================\n');
});

describe('Basic API Tests', () => {
  it('should return 404 for non-existent routes', async () => {
    const response = await request(BASE_URL).get('/non-existent-route').expect(404);

    expect(response.body.error).toBe('Page not found');
  });

  it('should return list of users', async () => {
    const response = await request(BASE_URL).get('/users').expect(200);

    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it('should create user', async () => {
    const userData = {
      username: 'testuser',
      age: 25,
      hobbies: ['reading', 'gaming'],
    };

    const response = await request(BASE_URL)
      .post('/users')
      .send(userData)
      .set('Accept', 'application/json')
      .expect(201);

    expect(response.body).toMatchObject({
      username: 'testuser',
      age: 25,
      hobbies: ['reading', 'gaming'],
    });
    expect(response.body.id).toBeDefined();
    expect(typeof response.body.id).toBe('string');
  });

  it('should return available routes in 404 response', async () => {
    const response = await request(BASE_URL).get('/invalid-route').expect(404);

    expect(response.body.availableRoutes).toBeDefined();
    expect(Array.isArray(response.body.availableRoutes)).toBe(true);
  });
});
