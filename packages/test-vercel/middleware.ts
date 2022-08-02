import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { json } from "stream/consumers";

export const config = {
  matcher: ["/", "/index"],
};

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const url = process.env.WEBHOOK;

  if (!url) {
    throw new Error("Missing webhook env variable");
  }

  const headers = Array.from(req.headers.entries()).reduce<
    Record<string, unknown>
  >((acc, [k, v]) => {
    acc[k] = v;
    return acc;
  }, {});

  const obj = {
    headers,
    geo: req.geo,
    ip: req.ip,
  };

  return ev.waitUntil(
    fetch(url, {
      method: "POST",
      body: JSON.stringify(obj),
    }).catch((e) => {
      console.error(e);
    })
  );
}
