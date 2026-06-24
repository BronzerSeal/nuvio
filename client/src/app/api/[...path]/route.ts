// app/api/[...path]/route.ts

import { NextRequest } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_BASE_URL!;

export async function handler(req: NextRequest, context: any) {
  const params = await context.params;

  const pathArray = params.path ?? [];
  const path = Array.isArray(pathArray) ? pathArray.join("/") : pathArray;

  const url = `${BACKEND}/api/${path}`;

  const headers = new Headers();

  // пробрасываем важные заголовки
  const contentType = req.headers.get("content-type");
  const cookie = req.headers.get("cookie");
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  if (contentType) headers.set("content-type", contentType);
  if (cookie) headers.set("cookie", cookie);
  if (origin) headers.set("origin", origin);
  if (referer) headers.set("referer", referer);

  const res = await fetch(url, {
    method: req.method,
    headers,
    body:
      req.method === "GET" || req.method === "HEAD"
        ? undefined
        : await req.text(),
    redirect: "manual",
  });

  const data = await res.arrayBuffer();

  const response = new Response(data, {
    status: res.status,
  });

  // важно для Set-Cookie от Better Auth
  res.headers.forEach((value, key) => {
    response.headers.append(key, value);
  });

  return response;
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
