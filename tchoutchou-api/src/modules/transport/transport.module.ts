import {Module} from "@nestjs/common";
import {TransportController} from "./transport.controller";
import {TransportService} from "./transport.service";
import { HttpModule } from '@nestjs/axios';


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
    providers: [TransportService]
})
export class TransportModule{}