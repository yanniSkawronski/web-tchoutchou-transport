import { Module } from '@nestjs/common';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './modules/database/index.js';
import {FavoritesModule} from "./modules/favorites/favorites.module.js";
import {TransportModule} from "./modules/transport/transport.module.js";

@Module({
  imports: [DatabaseModule, TransportModule, FavoritesModule],
  controllers: [AppController],
  providers: [AppService],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule {}
