import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Trainers (e2e)', () => {
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

  const buildTrainerDto = (suffix: string) => ({
    first_name: `Test${suffix}`,
    last_name: `User${suffix}`,
    email: `trainer-${suffix}-${Date.now()}@example.com`,
    age: 25,
    pokemons: [],
  });

  it('should create a trainer successfully', async () => {
    const dto = buildTrainerDto('create');

    const response = await request(httpServer)
      .post('/trainers')
      .send(dto)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.first_name).toBe(dto.first_name);
    expect(response.body.email).toBe(dto.email);
  });

  it('should reject duplicate trainer email', async () => {
    const dto = buildTrainerDto('duplicate');

    await request(httpServer).post('/trainers').send(dto).expect(201);

    const response = await request(httpServer)
      .post('/trainers')
      .send(dto)
      .expect(400);

    expect(response.body).toHaveProperty('statusCode', 400);
    expect(response.body).toHaveProperty(
      'message',
      'This email is already registered, use another account.',
    );
  });

  it('should list trainers and include newly created trainer', async () => {
    const dto = buildTrainerDto('list');
    const createResponse = await request(httpServer)
      .post('/trainers')
      .send(dto)
      .expect(201);

    const listResponse = await request(httpServer).get('/trainers').expect(200);

    expect(Array.isArray(listResponse.body)).toBe(true);
    expect(listResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: createResponse.body._id,
          email: dto.email,
        }),
      ]),
    );
  });

  it('should retrieve a trainer by id', async () => {
    const dto = buildTrainerDto('getbyid');
    const created = await request(httpServer)
      .post('/trainers')
      .send(dto)
      .expect(201);

    const response = await request(httpServer)
      .get(`/trainers/${created.body._id}`)
      .expect(200);

    expect(response.body._id).toBe(created.body._id);
    expect(response.body.email).toBe(dto.email);
  });

  it('should update a trainer by id', async () => {
    const dto = buildTrainerDto('update');
    const created = await request(httpServer)
      .post('/trainers')
      .send(dto)
      .expect(201);

    const updateDto = { age: 30 };

    const response = await request(httpServer)
      .put(`/trainers/${created.body._id}`)
      .send(updateDto)
      .expect(200);

    expect(response.body._id).toBe(created.body._id);
    expect(response.body.age).toBe(30);
  });

  it('should delete a trainer by id', async () => {
    const dto = buildTrainerDto('delete');
    const created = await request(httpServer)
      .post('/trainers')
      .send(dto)
      .expect(201);

    const deleteResponse = await request(httpServer)
      .delete(`/trainers/${created.body._id}`)
      .expect(200);

    expect(deleteResponse.body._id).toBe(created.body._id);

    await request(httpServer).get(`/trainers/${created.body._id}`).expect(400);
  });
});
