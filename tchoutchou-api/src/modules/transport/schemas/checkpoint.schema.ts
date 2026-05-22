import {z} from 'zod';

import {LocationSchema} from "./location.schema.js";
export const CheckpointSchema = z.object({
    station: LocationSchema,
    arrival: z.string(),
    departure: z.string().nullable(),
    delay: z.int().nullable(),
    platform: z.int(),
});