import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getRoot(): object {
    return {
      message: "Here's a list of the available routes in this API.",
      endpoints: [
        {
          api: '/api - "To check SwaggerUI."',
          trainers: '/trainers - "For Trainers CRUD."',
          pokemons: '/pokemons - "For Pokemons CRUD.',
          adoptions: '/adoptions - "For making Trainers adopt Pokemons.',
        },
      ],
    };
  }
}
