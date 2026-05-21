import {IsOptional, IsString} from 'class-validator'

export class GetLocationsDto{
    @IsString()
    @IsOptional()
    public query?:string;
}