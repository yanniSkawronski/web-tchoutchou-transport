import { Transform } from 'class-transformer';
import {IsIn, IsNumber, IsOptional, IsString} from 'class-validator'

export class GetLocationsDto{
    @IsString()
    @IsOptional()
    public query?:string;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    @IsOptional()
    public x?:number;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    @IsOptional()
    public y?:number;

    @IsIn(['all', 'station', 'poi', 'address'])
    @IsOptional()
    public type?:'all' | 'station' | 'poi' | 'address';
}
