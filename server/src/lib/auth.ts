import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import "dotenv/config";
import prisma from "./prisma.js";

const websiteUrl = process.env.WEBSITE_URL!;
// console.log("WEBSITE_URL =", process.env.WEBSITE_URL);
// console.log("BETTER_AUTH_URL =", process.env.BETTER_AUTH_URL);

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
  trustedOrigins: [websiteUrl, "https://nuvio.vercel.app"],

  defaultCookieAttributes: {
    sameSite: "none",
    secure: true,
    path: "/",
    httpOnly: true,
  },
});
