import { HttpService } from '@nestjs/axios';
import {BadGatewayException, Injectable} from "@nestjs/common";
import {map, Observable} from "rxjs";
import {z} from 'zod';

import {GetConnectionsDto} from "./dto/get-connections-dto.js";
import {GetLocationsDto} from "./dto/get-locations-dto.js";
import {GetStationboardDto} from "./dto/get-stationboard-dto.js";
import {ConnectionSchema} from "./schemas/connection.schema.js";
import {LocationSchema} from "./schemas/location.schema.js";
import {StationboardResponseSchema} from "./schemas/stationboard-response.schema.js";

export const LocationsResponseSchema = z.object({
    stations: z.array(LocationSchema)
});
export type LocationsResponse = z.infer<typeof LocationsResponseSchema>;

export const ConnectionsResponseSchema = z.object({
    connections: z.array(ConnectionSchema),
});
export type ConnectionsResponse = z.infer<typeof ConnectionsResponseSchema>;

const InvalidApiResponseMessage = 'Invalid response from transport API';

function toPlainObject(dto: object): Record<string, unknown> {
    const plain: Record<string, unknown> = {};
    for (const key of Object.keys(dto)) {
        const value = (dto as Record<string, unknown>)[key];
        if (value !== undefined) {
            plain[key] = value;
        }
    }
    return plain;
}

@Injectable()
export class TransportApiService {
    readonly #baseUrl = 'https://transport.opendata.ch/v1';
    public constructor(private readonly httpService: HttpService) {}

    public getLocations(dto: GetLocationsDto): Observable<LocationsResponse> {
        return this.httpService.get<unknown>(`${this.#baseUrl}/locations`, {params: dto}).pipe(
            map(response => {
                const parsed = LocationsResponseSchema.safeParse(response.data);
                if (!parsed.success) {
                    throw new BadGatewayException({
                        message: InvalidApiResponseMessage,
                        errors: parsed.error.issues.map(i => ({
                            path: i.path.join('.'),
                            message: i.message,
                        })),
                    });
                }
                return parsed.data;
            })
        );
    }

    public getConnections(dto: GetConnectionsDto): Observable<ConnectionsResponse> {
        const params = toPlainObject(dto);
        return this.httpService.get<unknown>(`${this.#baseUrl}/connections`, {params}).pipe(
            map(response => {
                const parsed = ConnectionsResponseSchema.safeParse(response.data);
                if (!parsed.success) {
                    throw new BadGatewayException({
                        message: InvalidApiResponseMessage,
                        errors: parsed.error.issues.map(i => ({
                            path: i.path.join('.'),
                            message: i.message,
                        })),
                    });
                }
                return parsed.data;
            })
        );
    }

    public getStationboard(dto: GetStationboardDto): Observable<z.infer<typeof StationboardResponseSchema>> {
        const params = toPlainObject(dto);
        return this.httpService.get<unknown>(`${this.#baseUrl}/stationboard`, {params}).pipe(
            map(response => {
                const parsed = StationboardResponseSchema.safeParse(response.data);
                if (!parsed.success) {
                    throw new BadGatewayException({
                        message: InvalidApiResponseMessage,
                        errors: parsed.error.issues.map(i => ({
                            path: i.path.join('.'),
                            message: i.message,
                        })),
                    });
                }
                return parsed.data;
            })
        );
    }
}
