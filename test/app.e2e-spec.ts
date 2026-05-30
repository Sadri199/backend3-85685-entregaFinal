import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Root Endpoint (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET / (root endpoint)', () => {
    it('should return 200 status code', () => {
      return request(httpServer).get('/').expect(200);
    });

    it('should return an object with message and endpoints', () => {
      return request(httpServer)
        .get('/')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('endpoints');
          expect(typeof res.body.message).toBe('string');
          expect(Array.isArray(res.body.endpoints)).toBe(true);
        });
    });

    it('should have correct message text', () => {
      return request(httpServer)
        .get('/')
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe(
            "Here's a list of the available routes in this API.",
          );
        });
    });

    it('should contain all API endpoints', () => {
      return request(httpServer)
        .get('/')
        .expect(200)
        .expect((res) => {
          const endpoint = res.body.endpoints[0];
          expect(endpoint).toHaveProperty('api');
          expect(endpoint).toHaveProperty('trainers');
          expect(endpoint).toHaveProperty('pokemons');
          expect(endpoint).toHaveProperty('adoptions');
        });
    });

    it('should have correct endpoint routes', () => {
      return request(httpServer)
        .get('/')
        .expect(200)
        .expect((res) => {
          const endpoint = res.body.endpoints[0];
          expect(endpoint.api).toContain('/api');
          expect(endpoint.trainers).toContain('/trainers');
          expect(endpoint.pokemons).toContain('/pokemons');
          expect(endpoint.adoptions).toContain('/adoptions');
        });
    });

    it('should return consistent response on multiple calls', () => {
      return request(httpServer)
        .get('/')
        .expect(200)
        .then((res1) => {
          const firstResponse = res1.body;
          return request(httpServer)
            .get('/')
            .expect(200)
            .expect((res2) => {
              expect(res2.body).toEqual(firstResponse);
            });
        });
    });

    it('should have application/json content type', () => {
      return request(httpServer)
        .get('/')
        .expect(200)
        .expect('Content-Type', /json/);
    });

    it('should not accept POST requests', () => {
      return request(httpServer).post('/').expect(404);
    });

    it('should not accept PUT requests', () => {
      return request(httpServer).put('/').expect(404);
    });

    it('should not accept DELETE requests', () => {
      return request(httpServer).delete('/').expect(404);
    });

    it('should have valid JSON structure', () => {
      return request(httpServer)
        .get('/')
        .expect(200)
        .expect((res) => {
          expect(() => JSON.stringify(res.body)).not.toThrow();
          expect(res.body).toEqual({
            message: expect.any(String),
            endpoints: expect.any(Array),
          });
        });
    });
  });
});
