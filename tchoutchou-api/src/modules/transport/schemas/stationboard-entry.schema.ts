import {z} from 'zod';

import {CheckpointSchema} from './checkpoint.schema.js';

export const StationboardEntrySchema = z.object({
    stop: CheckpointSchema,
    name: z.string().nullable(),
    category: z.string(),
    number: z.string().nullable(),
    operator: z.string().nullable(),
    to: z.string(),
});
