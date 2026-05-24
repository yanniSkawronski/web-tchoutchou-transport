import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {PrismaService} from '../database/prisma.service.js';
import {CreateFavoriteDto} from './dto/create-favorite-dto.js';

const DefaultUserId = 1;

@Injectable()
export class FavoritesService {
    public constructor(private readonly prisma: PrismaService) {}

    public async addFavorite(dto: CreateFavoriteDto): Promise<{id: string; stationId: string; stationName: string}> {
        const userId = dto.userId ?? DefaultUserId;
        const stationName = dto.stationName ?? dto.stationId;

        try {
            const favorite = await this.prisma.favoriteStation.create({
                data: {
                    userId,
                    stationId: dto.stationId,
                    stationName,
                },
            });
            return {
                id: favorite.id,
                stationId: favorite.stationId,
                stationName: favorite.stationName,
            };
        } catch (error: unknown) {
            if (error instanceof Error && 'code' in error && error.code === 'P2002') {
                throw new ConflictException('Station already in favorites');
            }
            throw error;
        }
    }

    public async listFavorites(userId?: number): Promise<{id: string; stationId: string; stationName: string}[]> {
        const uid = userId ?? DefaultUserId;
        const favorites = await this.prisma.favoriteStation.findMany({
            where: {userId: uid},
            orderBy: {stationName: 'asc'},
        });
        return favorites.map((f: {id: string; stationId: string; stationName: string}) => ({
            id: f.id,
            stationId: f.stationId,
            stationName: f.stationName,
        }));
    }

    public async removeFavorite(favoriteId: string, userId?: number): Promise<void> {
        const uid = userId ?? DefaultUserId;
        const favorite = await this.prisma.favoriteStation.findUnique({
            where: {id: favoriteId},
        });

        if (favorite?.userId !== uid) {
            throw new NotFoundException('Favorite not found');
        }

        await this.prisma.favoriteStation.delete({
            where: {id: favoriteId},
        });
    }
}
