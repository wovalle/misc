import ffmpegStatic from "ffmpeg-static";
import { FFmpeggy } from "ffmpeggy";
import { path as ffprobeBin } from "ffprobe-static";
import { access, readFile, writeFile } from "node:fs/promises";
import { Readable, Stream } from "node:stream";

const basePath = process.env.BASE_TRANSCRIPTION_PATH ?? "/tmp";

FFmpeggy.DefaultConfig = {
  ...FFmpeggy.DefaultConfig,
  ffprobeBin,
  ffmpegBin: ffmpegStatic!,
};

export const getTranscodedAudio = async (file: string, output: string) => {
  const ffmpeggy = new FFmpeggy();

  await ffmpeggy
    .setInput(file)
    .setOutput(output)
    .setOutputOptions(["-q:a 2"])
    .run();

  await ffmpeggy.done();
};

export const transcodeM4aToMp3 = async (
  transcriptionId: string,
  input: ReadableStream
) => {
  const fileInput = basePath + "/" + transcriptionId;
  const fileOutput =
    basePath + "/" + transcriptionId.replace(".m4a", "") + ".mp3";

  console.log("saving file");
  await writeFile(fileInput, input as unknown as Stream);
  console.log("file saved");

  try {
    const fileExists = await access(fileOutput)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      console.log("transcoding audio...", fileInput, fileOutput);

      await getTranscodedAudio(fileInput, fileOutput);
    }

    const file = await readFile(fileOutput);
    console.log("audio transcoded");

    return Readable.from(file) as unknown as ReadableStream<unknown>;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
