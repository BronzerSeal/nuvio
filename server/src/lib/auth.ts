import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import "dotenv/config";
import prisma from "./prisma.js";

const websiteUrl = process.env.WEBSITE_URL!;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    // "http://localhost:3000",
    websiteUrl,
    "https://nuvio.vercel.app",
  ],

  defaultCookieAttributes: {
    sameSite: "none",
    secure: true,
    path: "/",
    httpOnly: true,
  },

  callbacks: {
    allowedRedirects: [
      "https://ql6wt4sg-3000.euw.devtunnels.ms/dashboard",
      "http://localhost:3000/dashboard",
      "https://nuvio.vercel.app/dashboard",
    ],
  },
});
