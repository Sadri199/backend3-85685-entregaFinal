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

- `npm run test` - run Jest unit tests
- `npm run test:watch` - run tests in watch mode
- `npm run test:cov` - generate coverage report
- `npm run test:e2e` - run end-to-end tests

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


