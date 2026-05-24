import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query} from '@nestjs/common';

import {CreateFavoriteDto} from './dto/create-favorite-dto.js';
import {FavoritesService} from './favorites.service.js';

@Controller('favorites')
export class FavoritesController {
    public constructor(private readonly favoritesService: FavoritesService) {}

    @Post('stations')
    @HttpCode(HttpStatus.CREATED)
    public async addStation(@Body() dto: CreateFavoriteDto): Promise<{id: string; stationId: string; stationName: string}> {
        return this.favoritesService.addFavorite(dto);
    }

    @Get('stations')
    public async listStations(@Query('userId') userId?: string): Promise<{id: string; stationId: string; stationName: string}[]> {
        const parsedId = userId !== undefined ? parseInt(userId, 10) : undefined;
        return this.favoritesService.listFavorites(parsedId);
    }

    @Delete('stations/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async removeStation(
        @Param('id') id: string,
        @Query('userId') userId?: string,
    ): Promise<void> {
        const parsedId = userId !== undefined ? parseInt(userId, 10) : undefined;
        return this.favoritesService.removeFavorite(id, parsedId);
    }
}
