import { HttpService } from '@nestjs/axios';
import {BadGatewayException, Injectable} from "@nestjs/common";
import {forkJoin, map, Observable, of, switchMap} from "rxjs";
import {z} from 'zod';

import {GetConnectionsDto} from "./dto/get-connections-dto.js";
import {GetLocationsDto} from "./dto/get-locations-dto.js";
import {GetStationboardDto} from "./dto/get-stationboard-dto.js";
import {ConnectionSchema} from "./schemas/connection.schema.js";
import {LocationSchema} from "./schemas/location.schema.js";
import {StationboardResponseSchema} from "./schemas/stationboard-response.schema.js";
import {WeatherApiService, type WeatherInfo} from "./weather-api.service.js";

export const LocationsResponseSchema = z.object({
    stations: z.array(LocationSchema)
});
export type LocationsResponse = z.infer<typeof LocationsResponseSchema>;

export const ConnectionsResponseSchema = z.object({
    connections: z.array(ConnectionSchema),
});
export type ConnectionsResponse = z.infer<typeof ConnectionsResponseSchema>;

export interface EnrichedConnection extends z.infer<typeof ConnectionSchema> {
    weatherFrom?: WeatherInfo | undefined;
    weatherTo?: WeatherInfo | undefined;
}

export interface EnrichedConnectionsResponse {
    connections: EnrichedConnection[];
}

const InvalidApiResponseMessage = 'Invalid response from transport API';

// this function was made by AI when we migrate from an any project POC to a banned any one
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
    public constructor(
        private readonly httpService: HttpService,
        private readonly weatherApiService: WeatherApiService,
    ) {}

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

    public getConnections(dto: GetConnectionsDto): Observable<EnrichedConnectionsResponse> {
        const params = toPlainObject(dto);
        return this.httpService.get<unknown>(`${this.#baseUrl}/connections`, {params}).pipe(
            map(response => {
                const parsed = ConnectionsResponseSchema.safeParse(response.data);
                // in v1, we didn't check for the success property. However, AI advices us when we ask her how to use zod,to check this prop and use this pattern if it was false (throw exception)
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
            }),
            switchMap((data) => {
                const connections = data.connections;

                if (connections.length === 0) {
                    return of<EnrichedConnectionsResponse>({ connections: [] });
                }

                const weatherObservables = connections.map((conn) => {
                    const departure = conn.from.departure;
                    const arrival = conn.to.arrival;

                    // because the API can return null, i'm forced to handle this case :(
                    if (departure === null || arrival === null) {
                        return of({ weatherFrom: undefined, weatherTo: undefined });
                    }

                    const from = conn.from.station.coordinate;
                    const to = conn.to.station.coordinate;

                    return forkJoin({
                        weatherFrom: this.weatherApiService.getWeatherAt(Number(from.x), Number(from.y), departure),
                        weatherTo: this.weatherApiService.getWeatherAt(Number(to.x), Number(to.y), arrival),
                    });
                });

                return forkJoin(weatherObservables).pipe(
                    map((weatherResults) => ({
                        connections: connections.map((conn, i): EnrichedConnection => ({
                            ...conn,
                            // just so you know : we made sure that frontend handled that case
                            weatherFrom: weatherResults[i]?.weatherFrom,
                            weatherTo: weatherResults[i]?.weatherTo,
                        })),
                    }))
                );
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
