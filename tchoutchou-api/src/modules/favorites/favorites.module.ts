import {Module} from '@nestjs/common';

import {FavoritesController} from './favorites.controller.js';
import {FavoritesService} from './favorites.service.js';

@Module({
    controllers: [FavoritesController],
    providers: [FavoritesService],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class FavoritesModule {}
