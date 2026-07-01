"use client";
import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_BASE_URL!;

export const socket = io(URL, {
  ackTimeout: 10000,
  retries: 3,
});
