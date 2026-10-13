import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import prisma from "@/prisma/client";

export const { handlers, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
});
