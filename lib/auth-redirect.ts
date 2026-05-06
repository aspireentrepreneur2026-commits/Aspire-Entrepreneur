type AppRole = "FOUNDER" | "MENTOR" | "INVESTOR" | "ADMIN";
type OnboardingState = "BASIC" | "ROLE_PROFILE" | "COMPLETED";

export function getRoleDashboardPath(role: AppRole | undefined) {
  switch (role) {
    case "FOUNDER":
      return "/dashboard/founder";
    case "MENTOR":
      return "/dashboard/mentor";
    case "INVESTOR":
      return "/dashboard/investor";
    case "ADMIN":
      return "/dashboard/admin";
    default:
      return "/dashboard/founder";
  }
}

export function getPostAuthRedirectPath(
  role: AppRole | undefined,
  onboardingStatus: OnboardingState | undefined,
) {
  if (onboardingStatus === "ROLE_PROFILE" || onboardingStatus === "BASIC") {
    return "/onboarding";
  }
  return getRoleDashboardPath(role);
}
