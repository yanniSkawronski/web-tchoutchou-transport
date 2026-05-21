import {z} from "zod";

import {CoordinateSchema} from "./coordinate.schema";
export const LocationSchema = z.object({
    id: z.string(),
    name: z.string(),
    score: z.number().nullable(),
    coordinate: CoordinateSchema,
    distance: z.number().nullable(),
});

