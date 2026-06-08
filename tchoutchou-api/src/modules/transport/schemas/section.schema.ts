import {z} from 'zod';

import {CheckpointSchema} from './checkpoint.schema.js';
import {JourneySchema} from './journey.schema.js';

export const SectionSchema = z.object({
    journey: JourneySchema.nullable(),
    walk: z.object({ duration: z.number().nullable() }).nullable(),
    departure: CheckpointSchema,
    arrival: CheckpointSchema,
});
