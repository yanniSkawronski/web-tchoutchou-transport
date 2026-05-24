import {IsInt, IsOptional, IsString, Min} from 'class-validator';

export class CreateFavoriteDto {
    @IsString()
    public readonly stationId!: string;

    @IsString()
    @IsOptional()
    public readonly stationName?: string;

    @IsInt()
    @Min(1)
    @IsOptional()
    public readonly userId?: number;
}
