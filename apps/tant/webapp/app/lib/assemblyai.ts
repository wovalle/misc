import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_TOKEN!,
});

export const createDictation = async (file: ReadableStream | string) => {
  console.log("creating assemblyai transcription");

  const transcript = await client.transcripts.transcribe({
    audio: file,
    speaker_labels: true,
    language_detection: true,
  });

  console.log("got transcript", transcript.text);

  return transcript;
};
