export const assertMethod = (request: Request, method: string | string[]) => {
  const asserted = Array.isArray(method) ? method : [method];
  if (!asserted.includes(request.method)) {
    throw new Response("Method not allowed", { status: 405 });
  }
};

export const assertTantHeaders = (request: Request) => {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || authHeader !== `Bearer ${process.env.TANT_TOKEN}`) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const contentType = request.headers.get("Content-Type");

  if (!contentType || contentType !== "application/json") {
    throw new Response("Invalid content type", { status: 400 });
  }
};
