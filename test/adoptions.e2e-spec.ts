import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Adoptions (e2e)', () => {
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
    first_name: `Trainer${suffix}`,
    last_name: `User${suffix}`,
    email: `trainer-${suffix}-${Date.now()}@example.com`,
    age: 25,
    pokemons: [],
  });

  const buildPokemonDto = (suffix: string) => ({
    name: `Pokemon${suffix}`,
    species: 'Pikachu',
    type: 'Electric',
    sex: 'Male',
    age: 5,
    weight: 6,
    height: 4,
  });

  it('should create an adoption successfully', async () => {
    const trainer = buildTrainerDto('create-adoption');
    const pokemon = buildPokemonDto('create-adoption');

    const createdTrainer = await request(httpServer)
      .post('/trainers')
      .send(trainer)
      .expect(201);

    const createdPokemon = await request(httpServer)
      .post('/pokemons')
      .send(pokemon)
      .expect(201);

    const adoptionResponse = await request(httpServer)
      .post(`/adoptions/${createdTrainer.body._id}`)
      .send({ pokemonId: createdPokemon.body._id })
      .expect(201);

    expect(adoptionResponse.body).toHaveProperty('status', 'Success');
    expect(adoptionResponse.body.trainer).toHaveProperty('pokemons');
    expect(adoptionResponse.body.trainer.pokemons).toContain(
      createdPokemon.body._id,
    );
    expect(adoptionResponse.body.pokemon).toHaveProperty('trainer');
    expect(adoptionResponse.body.pokemon.trainer).toContain(
      createdTrainer.body._id,
    );
  });

  it('should transfer adoption to another trainer', async () => {
    const trainerA = buildTrainerDto('transfer-a');
    const trainerB = buildTrainerDto('transfer-b');
    const pokemon = buildPokemonDto('transfer');

    const createdTrainerA = await request(httpServer)
      .post('/trainers')
      .send(trainerA)
      .expect(201);

    const createdTrainerB = await request(httpServer)
      .post('/trainers')
      .send(trainerB)
      .expect(201);

    const createdPokemon = await request(httpServer)
      .post('/pokemons')
      .send(pokemon)
      .expect(201);

    await request(httpServer)
      .post(`/adoptions/${createdTrainerA.body._id}`)
      .send({ pokemonId: createdPokemon.body._id })
      .expect(201);

    const transferResponse = await request(httpServer)
      .put(`/adoptions/${createdTrainerB.body._id}`)
      .send({ pokemonId: createdPokemon.body._id })
      .expect(200);

    expect(transferResponse.body).toHaveProperty('status', 'Success');
    expect(transferResponse.body.trainer._id).toBe(createdTrainerB.body._id);
    expect(transferResponse.body.trainer.pokemons).toContain(
      createdPokemon.body._id,
    );
    expect(transferResponse.body.pokemon.trainer).toContain(
      createdTrainerB.body._id,
    );
  });

  it('should remove an adoption successfully', async () => {
    const trainer = buildTrainerDto('remove');
    const pokemon = buildPokemonDto('remove');

    const createdTrainer = await request(httpServer)
      .post('/trainers')
      .send(trainer)
      .expect(201);

    const createdPokemon = await request(httpServer)
      .post('/pokemons')
      .send(pokemon)
      .expect(201);

    await request(httpServer)
      .post(`/adoptions/${createdTrainer.body._id}`)
      .send({ pokemonId: createdPokemon.body._id })
      .expect(201);

    const removeResponse = await request(httpServer)
      .delete(`/adoptions/${createdTrainer.body._id}`)
      .send({ pokemonId: createdPokemon.body._id })
      .expect(200);

    expect(removeResponse.body).toHaveProperty('status', 'Success');
    expect(removeResponse.body.trainer.pokemons).not.toContain(
      createdPokemon.body._id,
    );
    expect(removeResponse.body.pokemon.trainer).not.toContain(
      createdTrainer.body._id,
    );
  });
});
