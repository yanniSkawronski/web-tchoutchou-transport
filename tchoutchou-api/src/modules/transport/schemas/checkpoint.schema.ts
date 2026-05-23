import {z} from 'zod';

import {LocationSchema} from './location.schema.js';
import {PrognosisSchema} from './prognosis.schema.js';

export const CheckpointSchema = z.object({
    station: LocationSchema,
    arrival: z.string().nullable(),
    arrivalTimestamp: z.number().nullable(),
    departure: z.string().nullable(),
    departureTimestamp: z.number().nullable(),
    delay: z.number().nullable(),
    platform: z.string().nullable(),
    prognosis: PrognosisSchema.nullable(),
});
