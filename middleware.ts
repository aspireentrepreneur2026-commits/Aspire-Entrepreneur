import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  if (req.nextUrl.pathname === "/") {
    return NextResponse.rewrite(new URL("/landing/index-5.html", req.url));
  }
});

export const config = {
  /** Skip auth middleware for public assets and the static landing bundle under `/landing/`. */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads|landing|aspire).*)"],
};
