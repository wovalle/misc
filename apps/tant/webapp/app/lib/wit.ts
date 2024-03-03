const WitBaseUrl = "https://api.wit.ai";

interface SpeechToken {
  confidence: number;
  end: number;
  start: number;
  token: string;
}

interface Speech {
  confidence: number;
  tokens: SpeechToken[];
}

interface SpeechData {
  is_final?: boolean;
  speech: Speech;
  text: string;
}

export const createDictation = async (file: ReadableStream) => {
  console.log("creating dictation");

  const response = await fetch(`${WitBaseUrl}/dictation?v=20230215`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WIT_TOKEN!}`,
      "Content-Type": "audio/mpeg3",
    },
    body: file,
  });

  const reader = response.body?.getReader();

  if (!reader) {
    throw new Error("No reader");
  }

  const decoder = new TextDecoder();
  let result = await reader.read();
  const text: string[] = [];

  while (!result.done) {
    const decodedValue = decoder.decode(result.value);

    text.push(decodedValue);
    result = await reader.read();
  }

  return text
    .join("")
    .split("\r\n")
    .map((s) => s.replaceAll("\n", ""))
    .filter(Boolean)
    .map((s) => JSON.parse(s) as SpeechData);
};
