# Backend 3 85685 entrega-final

A NestJS backend application designed for Coderhouse's Backend 3 course for managing trainers, pokemons, and adoptions using MongoDB.

The project is built with NestJS, Mongoose, class-validator, and Jest for testing. It includes dedicated modules for trainers, pokemons, and adoption workflows, along with middleware for request logging.

## Project Setup

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file at the project root with your MongoDB connection string:

```bash
MONGO_URL=mongodb://localhost:27017/your-db-name
```

3. Start the application

```bash
npm run start:dev
```

## Run

- `npm run start` - start the server
- `npm run start:dev` - start in watch mode
- `npm run start:prod` - run compiled production build
- `npm run build` - compile TypeScript into `dist`

## Testing

This project includes comprehensive unit tests, integration tests, and end-to-end tests with **121 total tests**.

### Unit & Integration Tests

Unit tests verify individual service methods and controller endpoints with mocked dependencies.
Integration tests verify controller endpoints work correctly with mocked services.

```bash
npm run test              # Run all unit and integration tests
npm run test:watch       # Run tests in watch mode (auto-rerun on changes)
npm run test:cov         # Generate coverage report
```

**Test Files:**
- `src/trainers/trainers.service.spec.ts` - Unit tests for trainers service (create, findAll, findOne, update, remove)
- `src/trainers/trainers.controller.spec.ts` - Integration tests for trainers endpoints
- `src/pokemons/pokemons.service.spec.ts` - Unit tests for pokemons service (create, findAll, findOne, update, remove, getTypes, getSpecies)
- `src/pokemons/pokemons.controller.spec.ts` - Integration tests for pokemons endpoints
- `src/adoptions/adoptions.service.spec.ts` - Unit tests for adoptions service (create, update, remove)
- `src/adoptions/adoptions.controller.spec.ts` - Integration tests for adoptions endpoints
- `src/app.controller.spec.ts` - Unit tests for root endpoint

### End-to-End Tests

E2E tests verify the entire application stack from HTTP request to database response, testing real flows without mocking services.

```bash
npm run test:e2e                                    # Run all e2e tests
npm run test:e2e -- trainers.e2e-spec.ts          # Run trainers e2e tests
npm run test:e2e -- pokemons.e2e-spec.ts          # Run pokemons e2e tests
npm run test:e2e -- adoptions.e2e-spec.ts         # Run adoptions e2e tests
npm run test:e2e -- app.e2e-spec.ts               # Run root endpoint e2e tests
```

**E2E Test Files:**
- `test/app.e2e-spec.ts` - Tests for root API endpoint (9 tests)
- `test/trainers.e2e-spec.ts` - Tests for trainers CRUD endpoints (6 tests)
- `test/pokemons.e2e-spec.ts` - Tests for pokemons CRUD and helper endpoints (7 tests)
- `test/adoptions.e2e-spec.ts` - Tests for adoption create/transfer/remove flows (3 tests)

**Results:**
- **Test Suites:** 4 passed
- **Tests:** 27 passed
- **Execution Time:** ~4.5s

### Test Coverage Breakdown

**Trainers Module:**
- ✅ Create trainer (validates duplicate emails)
- ✅ Retrieve all trainers
- ✅ Retrieve single trainer by ID
- ✅ Update trainer
- ✅ Delete trainer
- ✅ Full CRUD e2e flow

**Pokemons Module:**
- ✅ Create pokemon
- ✅ Retrieve all pokemons
- ✅ Retrieve single pokemon by ID
- ✅ Update pokemon
- ✅ Delete pokemon
- ✅ Get pokemon types list
- ✅ Get pokemon species list
- ✅ Full CRUD e2e flow

**Adoptions Module:**
- ✅ Create adoption (validate trainer and pokemon exist)
- ✅ Update adoption (transfer pokemon to different trainer)
- ✅ Remove adoption
- ✅ Full adoption flow e2e

**Root Endpoint:**
- ✅ GET / returns API info with available routes
- ✅ Validates response structure and content

## Swagger

This project uses Swagger for API documentation and interactive testing.

If Swagger is enabled in `src/main.ts`, open the docs in your browser after starting the app.

Common setup:

```bash
npm install --save @nestjs/swagger swagger-ui-express
```

Example `main.ts` configuration:

```ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Backend 3 API')
  .setDescription('Trainer, Pokemon and Adoption API documentation')
  .setVersion('1.0')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```

Then access Swagger at `http://localhost:3000/api` (or your configured port).

## Structure

- `src/main.ts` - application bootstrap entry point
- `src/app.module.ts` - main Nest module, loads config, MongoDB, and feature modules
- `src/middleware/logger.middleware.ts` - global request logger middleware
- `src/trainers/` - trainer module, controller, service, DTOs, schema, and tests
- `src/pokemons/` - pokemon module, controller, service, DTOs, schema, and tests
- `src/adoptions/` - adoption module, controller, service, DTOs, entity, and tests
- `src/**/*.spec.ts` - unit test files for controllers and services
- `test/jest-e2e.json` - Jest configuration for end-to-end tests
- `package.json` - scripts, dependencies, and project metadata
- `tsconfig.json` - TypeScript compiler configuration

## Endpoint Interaction Graph

```mermaid
flowchart LR
  trainer[/🐬 Trainers endpoint <br/>/trainers/] -->|create, read, update, delete| trainerService[Trainers Service]
  pokemon[/🐬 Pokemons endpoint <br/>/pokemons/] -->|create, read, update, delete| pokemonService[Pokemons Service]
  pokemonTypes[/Types <br/>/pokemons/types/] -->|lookup| pokemonService
  pokemonSpecies[/Species <br/>/pokemons/species/] -->|lookup| pokemonService
  adoption[/🐬 Adoptions endpoint <br/>/adoptions/:id/] -->|create, update, delete adoption| adoptionService[Adoptions Service]
  adoptionService --> trainerService
  adoptionService --> pokemonService
```

This graph shows how the API routes connect to the service layer. The `adoptions` endpoints coordinate changes across both trainers and pokemons.

## Documentations

- [NestJS Documentation](https://docs.nestjs.com)
- [Mongoose Documentation](https://mongoosejs.com/docs/guide.html)
- [class-validator Documentation](https://github.com/typestack/class-validator)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [ESLint Documentation](https://eslint.org/docs/latest)
- [Prettier Documentation](https://prettier.io/docs/en/index.html)

## Links

- [Main Google Doc, it contains Testing Cases and Other Information](https://docs.google.com/document/d/1obrFWdGFR_8IteD25hacEAS3sQ6lSi0fgsIUw6pLrhE/edit?usp=sharing)
- [GitHub Repo](https://github.com/Sadri199/backend3-85685-entregaFinal)

## Disclaimer

- This project is a fan-made application using the Pokemon name and related concepts for educational purposes only.
- It is not monetized, licensed, endorsed, or affiliated with Nintendo, Game Freak, The Pokemon Company, or any related copyright holders.
- If you plan to share or publish this application, keep it non-commercial and clearly mark it as fan content.

## Notes

- Build currently passes with `npm run build`.
- Linting currently reports issues in DTO and service files related to unsafe `any` access and unused variables. ╰（‵□′）╯
- There's a Postman Collection attached to this project so you can check each Endpoint.


