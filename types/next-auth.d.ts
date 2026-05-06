import type { DefaultSession } from "next-auth";

type AppRole = "FOUNDER" | "MENTOR" | "INVESTOR" | "ADMIN";
type OnboardingState = "BASIC" | "ROLE_PROFILE" | "COMPLETED";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role?: AppRole;
      onboardingStatus?: OnboardingState;
    };
  }

  interface User {
    role?: AppRole;
    onboardingStatus?: OnboardingState;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AppRole;
    onboardingStatus?: OnboardingState;
  }
}
