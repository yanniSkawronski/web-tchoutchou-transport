import {z} from 'zod';

import {CheckpointSchema} from './checkpoint.schema.js';

export const StationboardEntrySchema = z.object({
    stop: CheckpointSchema,
    name: z.string(),
    category: z.string(),
    number: z.string(),
    operator: z.string().nullable(),
    to: z.string(),
});
