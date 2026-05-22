import { HttpService } from '@nestjs/axios';
import {BadGatewayException, Injectable} from "@nestjs/common";
import {map, Observable} from "rxjs";
import {z} from 'zod';

import {LocationSchema} from "./schemas/location.schema.js";

export const LocationsResponseSchema = z.object({
    stations: z.array(LocationSchema)
});
export type LocationsResponse = z.infer<typeof LocationsResponseSchema>;
@Injectable()
export class TransportApiService {
    readonly #baseUrl = 'https://transport.opendata.ch/v1';
    public constructor(private readonly httpService: HttpService) {}
    public getLocations(query?: string) : Observable<LocationsResponse>{
        const url = (query !== undefined) ? `${this.#baseUrl}/locations?query=${encodeURIComponent(query)}`
    : `${this.#baseUrl}/locations`;
        return this.httpService.get<unknown>(url).pipe(
            map(response => {
                const parsed = LocationsResponseSchema.safeParse(response.data);
                if (!parsed.success){
                    throw new BadGatewayException({
                        message: 'Invalid response from transport API',
                        errors: parsed.error.issues.map(i => ({
                            path: i.path.join('.'),
                            message: i.message,
                        })),
                    })
                }
                return parsed.data;
            })
        );
    }
}