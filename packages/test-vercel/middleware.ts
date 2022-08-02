import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { json } from "stream/consumers";

export const config = {
  matcher: ["/", "/index"],
};

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const obj = {
    headers: JSON.stringify(req.headers),
    host: req.headers.get("host"),
    geo: req.geo,
    ip: req.ip,
  };

  return ev.waitUntil(
    fetch("https://webhook.site/a345e4c9-f18a-4dcb-8475-07d34177f65d", {
      method: "POST",
      body: JSON.stringify(obj),
    }).catch((e) => {
      console.error(e);
    })
  );
}
