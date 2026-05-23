import {IsIn, IsNumber, IsOptional, IsString} from 'class-validator'

export class GetLocationsDto{
    @IsString()
    @IsOptional()
    public query?:string;

    @IsNumber()
    @IsOptional()
    public x?:number;

    @IsNumber()
    @IsOptional()
    public y?:number;

    @IsIn(['all', 'station', 'poi', 'address'])
    @IsOptional()
    public type?:'all' | 'station' | 'poi' | 'address';
}
