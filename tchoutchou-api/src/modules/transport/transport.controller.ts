import {Controller, Get, Query} from "@nestjs/common";
import {Observable} from "rxjs";

import {GetConnectionsDto} from "./dto/get-connections-dto.js";
import {GetLocationsDto} from "./dto/get-locations-dto.js";
import {GetStationboardDto} from "./dto/get-stationboard-dto.js";
import {StationboardResponse} from "./schemas/stationboard-response.schema.js";
import {
    ConnectionsResponse,
    LocationsResponse,
    TransportApiService,
} from "./transport-api.service.js";

@Controller('transport')
export class TransportController {
    public constructor(private readonly transportService: TransportApiService) {
    }

    @Get('locations')
    public getLocations(@Query() dto: GetLocationsDto): Observable<LocationsResponse> {
        return this.transportService.getLocations(dto);
    }

    @Get('connections')
    public getConnections(@Query() dto: GetConnectionsDto): Observable<ConnectionsResponse> {
        return this.transportService.getConnections(dto);
    }

    @Get('stationboard')
    public getStationboard(@Query() dto: GetStationboardDto): Observable<StationboardResponse> {
        return this.transportService.getStationboard(dto);
    }
}
