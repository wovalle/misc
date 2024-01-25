import { z } from "zod";

export const recordingSchema = z.object({
  id: z.string(),
  user_created: z.string(),
  date_created: z.string(),
  presigned_url: z.string(),
  url: z.string(),
  status: z.union([
    z.literal("new"),
    z.literal("uploaded"),
    z.literal("transcribed"),
  ]),
  transcription: z.string(),
});

export type Recording = z.infer<typeof recordingSchema>;
