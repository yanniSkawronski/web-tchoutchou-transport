import {Controller, Get, Query} from "@nestjs/common";
import {Observable} from "rxjs";

import {GetLocationsDto} from "./dto/get-locations-dto";
import {LocationsResponse, TransportService} from "./transport.service";

@Controller('transport')
export class TransportController{
    public constructor(private readonly transportService: TransportService) {
    }

    @Get('ping')
    private ping(@Query() dto: GetLocationsDto):Observable<LocationsResponse>{
        return this.transportService.getLocations(dto.query);
    }
}