import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Pokemons (e2e)', () => {
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

  const buildPokemonDto = (suffix: string) => ({
    name: `Poke${suffix}`,
    species: 'Pikachu',
    type: 'Electric',
    sex: 'Male',
    age: 5,
    weight: 6,
    height: 4,
  });

  it('should create a pokemon successfully', async () => {
    const dto = buildPokemonDto('create');

    const response = await request(httpServer)
      .post('/pokemons')
      .send(dto)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(dto.name);
    expect(response.body.species).toBe(dto.species);
  });

  it('should list pokemons and include created pokemon', async () => {
    const dto = buildPokemonDto('list');
    const created = await request(httpServer)
      .post('/pokemons')
      .send(dto)
      .expect(201);

    const response = await request(httpServer)
      .get('/pokemons')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: created.body._id,
          name: dto.name,
        }),
      ]),
    );
  });

  it('should return pokemon types list', async () => {
    const response = await request(httpServer)
      .get('/pokemons/types')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(Array.isArray(response.body.types)).toBe(true);
    expect(response.body.types).toContain('Electric');
  });

  it('should return pokemon species list', async () => {
    const response = await request(httpServer)
      .get('/pokemons/species')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(Array.isArray(response.body.types)).toBe(true);
    expect(response.body.types).toContain('Pikachu');
  });

  it('should retrieve a pokemon by id', async () => {
    const dto = buildPokemonDto('getbyid');
    const created = await request(httpServer)
      .post('/pokemons')
      .send(dto)
      .expect(201);

    const response = await request(httpServer)
      .get(`/pokemons/${created.body._id}`)
      .expect(200);

    expect(response.body._id).toBe(created.body._id);
    expect(response.body.name).toBe(dto.name);
  });

  it('should update a pokemon by id', async () => {
    const dto = buildPokemonDto('update');
    const created = await request(httpServer)
      .post('/pokemons')
      .send(dto)
      .expect(201);

    const updateDto = { age: 6, weight: 7 };
    const response = await request(httpServer)
      .put(`/pokemons/${created.body._id}`)
      .send(updateDto)
      .expect(200);

    expect(response.body._id).toBe(created.body._id);
    expect(response.body.age).toBe(6);
    expect(response.body.weight).toBe(7);
  });

  it('should delete a pokemon by id', async () => {
    const dto = buildPokemonDto('delete');
    const created = await request(httpServer)
      .post('/pokemons')
      .send(dto)
      .expect(201);

    const deleted = await request(httpServer)
      .delete(`/pokemons/${created.body._id}`)
      .expect(200);

    expect(deleted.body._id).toBe(created.body._id);
    await request(httpServer).get(`/pokemons/${created.body._id}`).expect(400);
  });
});
