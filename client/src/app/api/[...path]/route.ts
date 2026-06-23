// app/api/[...path]/route.ts

import { NextRequest } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_BASE_URL!;

export async function handler(req: NextRequest, context: any) {
  const params = await context.params;

  const pathArray = params.path ?? [];
  const path = Array.isArray(pathArray) ? pathArray.join("/") : pathArray;

  const url = `${BACKEND}/api/${path}`;

  const res = await fetch(url, {
    method: req.method,
    headers: {
      "content-type": req.headers.get("content-type") || "",
      cookie: req.headers.get("cookie") || "",
    },
    body:
      req.method === "GET" || req.method === "HEAD"
        ? undefined
        : await req.text(),
  });

  const data = await res.arrayBuffer();

  return new Response(data, {
    status: res.status,
    headers: res.headers,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
