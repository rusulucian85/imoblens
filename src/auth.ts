import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.AUTH_EMAIL_FROM ?? "noreply@imoblens.ro",
    }),
  ],
  callbacks: {
    session({ session, user }) {
      // PrismaAdapter passes the full User row here, so role/bannedAt are available.
      session.user.id = user.id;
      session.user.role = (user as { role?: string }).role ?? "BUYER";
      session.user.bannedAt =
        (user as { bannedAt?: Date | null }).bannedAt ?? null;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
});

declare module "next-auth" {
  interface User {
    role?: string;
    bannedAt?: Date | null;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      bannedAt: Date | null;
    } & DefaultSession["user"];
  }
}
