import { z } from "zod";

export const transcriptionProvider = z.union([
  z.literal("assemblyai"),
  z.literal("wit"),
]);

export const transcriptionSchema = z.object({
  id: z.string(),
  provider: transcriptionProvider,
  date_created: z.string().datetime(),
  body: z.record(z.string(), z.string()),
  recording: z.string(),
});

export const recordingSchema = z.object({
  id: z.string(),
  user_created: z.string(),
  date_created: z.string(),
  presigned_url: z.string(),
  url: z.string().nullable(),
  status: z.union([
    z.literal("new"),
    z.literal("uploaded"),
    z.literal("transcribed"),
  ]),
  transcription: z.string().nullable(),
  rawTranscriptionValue: z.string().nullable(),
  transcriptions: z.array(transcriptionSchema),
});

export const transcriptionRequestSchema = z.object({
  id: z.string(),
  provider: transcriptionProvider,
});

export type Recording = z.infer<typeof recordingSchema>;
export type Transcription = z.infer<typeof transcriptionSchema>;
export type TranscriptionProvider = z.infer<typeof transcriptionProvider>;
export type TranscriptionRequest = z.infer<typeof transcriptionRequestSchema>;
