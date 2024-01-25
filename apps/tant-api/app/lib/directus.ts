import {
  createDirectus,
  createItem,
  readItem,
  readItems,
  rest,
  updateItem,
} from "@directus/sdk";
import { Recording } from "./entities";

type Schema = {
  recordings: Recording[];
};

const getDirectusClient = () => {
  const client = createDirectus<Schema>(process.env.DIRECTUS_API_URL!).with(
    rest({
      onRequest: (config) => {
        Object.assign(config.headers!, {
          Authorization: `Bearer ${process.env.DIRECTUS_API_TOKEN}`,
          "CF-Access-Client-Id": process.env.CLOUDFLARE_ACCESS_CLIENT_ID,
          "CF-Access-Client-Secret":
            process.env.CLOUDFLARE_ACCESS_CLIENT_SECRET,
        });

        return config;
      },
    })
  );

  return client;
};

export const getRecordings = async () => {
  const client = getDirectusClient();

  const result = await client.request(readItems("recordings"));

  return result;
};

export const getRecording = async (id: string) => {
  const client = getDirectusClient();

  const result = await client.request(readItem("recordings", id));

  return result;
};

export const createRecording = async (
  fileKey: string,
  presignedUrl: string
) => {
  const client = getDirectusClient();

  console.log("about to create", {
    id: fileKey,
    status: "new",
    presigned_url: presignedUrl,
  });

  const result = await client.request(
    createItem("recordings", {
      id: fileKey,
      status: "new",
      presigned_url: presignedUrl,
    })
  );

  return result;
};

export const updateRecording = async (id: string, data: Partial<Recording>) => {
  const client = getDirectusClient();

  console.log("about to edit", {
    id,
    data,
  });

  const result = await client.request(updateItem("recordings", id, data));

  return result;
};
