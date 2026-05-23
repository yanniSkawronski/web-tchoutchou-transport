import {z} from 'zod';

import {LocationSchema} from './location.schema.js';
import {StationboardEntrySchema} from './stationboard-entry.schema.js';

export const StationboardResponseSchema = z.object({
    station: LocationSchema.nullable(),
    stationboard: z.array(StationboardEntrySchema),
});

export type StationboardResponse = z.infer<typeof StationboardResponseSchema>;
