import type { NextAuthConfig } from "next-auth";
import { getRoleDashboardPath } from "@/lib/auth-redirect";

type AppRole = "FOUNDER" | "MENTOR" | "INVESTOR" | "ADMIN";

const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthPage =
        nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");
      const isProtectedPage =
        nextUrl.pathname.startsWith("/onboarding") ||
        nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/settings") ||
        nextUrl.pathname.startsWith("/admin");

      if (isProtectedPage && !isLoggedIn) {
        return false;
      }

      if (isAuthPage && isLoggedIn) {
        const rolePath = getRoleDashboardPath(auth?.user?.role as AppRole | undefined);
        return Response.redirect(new URL(rolePath, nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;

export default authConfig;
