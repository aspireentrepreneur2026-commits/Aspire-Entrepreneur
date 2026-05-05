import type { NextAuthConfig } from "next-auth";

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
        nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/settings") ||
        nextUrl.pathname.startsWith("/admin");

      if (isProtectedPage && !isLoggedIn) {
        return false;
      }

      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;

export default authConfig;
