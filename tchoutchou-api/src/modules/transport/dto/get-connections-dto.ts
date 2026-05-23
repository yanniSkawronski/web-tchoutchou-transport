import { Transform } from 'class-transformer';
import {
    ArrayMaxSize,
    IsArray,
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
    Matches,
    Max,
    Min,
} from 'class-validator';

export class GetConnectionsDto {
    @IsString()
    public readonly from!: string;

    @IsString()
    public readonly to!: string;

    @IsArray()
    @IsString({ each: true })
    @ArrayMaxSize(5)
    @IsOptional()
    public readonly via?: string[];

    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date format must be YYYY-MM-DD' })
    public readonly date?: string;

    @IsOptional()
    @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'Time must be in HH:MM format (24h)' })
    public readonly time?: string;

    @Transform(({ value }) => {
        if (value === true || value === 'true' || value === 1 || value === '1') {
            return true;
        }
        return false;
    })
    @IsOptional()
    @IsBoolean()
    public readonly isArrivalTime!: boolean;

    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(16)
    public readonly limit?: number;

    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(3)
    public readonly page?: number;
}
