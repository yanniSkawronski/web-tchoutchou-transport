import { HttpModule } from '@nestjs/axios';
import {Module} from "@nestjs/common";

import {TransportController} from "./transport.controller.js";
import {TransportApiService} from "./transport-api.service.js";
import {WeatherApiService} from "./weather-api.service.js";


@Module({
    imports: [
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
            headers: {
                'Content-Type': 'application/json',
            },
        }),
    ],
    controllers: [TransportController],
    providers: [TransportApiService, WeatherApiService]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class TransportModule{}