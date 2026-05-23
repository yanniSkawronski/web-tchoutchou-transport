import {z} from 'zod';

import {CheckpointSchema} from './checkpoint.schema.js';
import {JourneySchema} from './journey.schema.js';

export const SectionSchema = z.object({
    journey: JourneySchema.nullable(),
    walk: z.string().nullable(),
    departure: CheckpointSchema,
    arrival: CheckpointSchema,
});
