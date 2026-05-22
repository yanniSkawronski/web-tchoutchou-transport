import {z} from "zod";

import {CheckpointSchema} from "./checkpoint.schema.js";

export const ConnectionSchema = z.object({
    from: CheckpointSchema,
    to: CheckpointSchema,
    
})