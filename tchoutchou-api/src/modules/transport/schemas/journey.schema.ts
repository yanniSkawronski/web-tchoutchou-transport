import {z} from 'zod';

import {CheckpointSchema} from './checkpoint.schema.js';

export const JourneySchema = z.object({
    name: z.string().nullable(),
    category: z.string().nullable(),
    categoryCode: z.number().nullable(),
    number: z.string().nullable(),
    operator: z.string().nullable(),
    to: z.string().nullable(),
    passList: z.array(CheckpointSchema).nullable(),
    capacity1st: z.number().nullable(),
    capacity2nd: z.number().nullable(),
});
