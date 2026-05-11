import NextAuth from "next-auth";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth(() => {});

export const config = {
  /** Skip auth middleware for public assets (profile/cover under /uploads must not be intercepted). */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads).*)"],
};
