import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return the APIs routes', () => {
      expect(appController.getRoot()).toStrictEqual({
        message: "Here's a list of the available routes in this API.",
        endpoints: [
          {
            api: '/api - "To check SwaggerUI."',
            trainers: '/trainers - "For Trainers CRUD."',
            pokemons: '/pokemons - "For Pokemons CRUD.',
            adoptions: '/adoptions - "For making Trainers adopt Pokemons.',
          },
        ],
      });
    });
  });
});
