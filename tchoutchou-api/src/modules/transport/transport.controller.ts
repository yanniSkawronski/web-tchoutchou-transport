import {Controller, Get, Query} from "@nestjs/common";
import {Observable} from "rxjs";

import {GetConnectionsDto} from "./dto/get-connections-dto.js";
import {GetLocationsDto} from "./dto/get-locations-dto.js";
import {LocationsResponse, TransportApiService} from "./transport-api.service.js";


@Controller('transport')
export class TransportController{
    public constructor(private readonly transportService: TransportApiService) {
    }

    @Get('ping')
    private ping(@Query() dto: GetLocationsDto):Observable<LocationsResponse>{
        return this.transportService.getLocations(dto.query);
    }

    @Get('connections')
    private getConnections(@Query() dto: GetConnectionsDto):void{

    }
}