// src/app/(leaner)/_utils/zod.ts
import { z } from 'zod';

export const heartbeatSchema = z.object({
    lessonId: z.string(),
    lastPosition: z.number(), // Vị trí giây hiện tại (s)
    isCompleted: z.boolean().default(false)
});

export type HeartbeatValues = z.infer<typeof heartbeatSchema>;