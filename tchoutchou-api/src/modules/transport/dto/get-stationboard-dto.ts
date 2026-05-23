import { Transform } from 'class-transformer';
import {
    IsIn,
    IsNumber,
    IsOptional,
    IsString,
    Matches,
} from 'class-validator';

export class GetStationboardDto {
    @IsString()
    @IsOptional()
    public readonly station?: string;

    @IsString()
    @IsOptional()
    public readonly id?: string;

    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsNumber()
    public readonly limit?: number;

    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/, { message: 'Datetime format must be YYYY-MM-DD hh:mm' })
    public readonly datetime?: string;

    @IsOptional()
    @IsIn(['departure', 'arrival'])
    public readonly type?: 'departure' | 'arrival';
}
