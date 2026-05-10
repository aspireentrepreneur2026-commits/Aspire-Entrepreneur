"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth, signIn, signOut } from "@/auth";
import { getPostAuthRedirectPath } from "@/lib/auth-redirect";

type AppRole = "FOUNDER" | "MENTOR" | "INVESTOR" | "ADMIN";

const registerSchema = z.object({
  name: z.string().min(2, "Name should be at least 2 characters."),
  email: z.string().email("Enter a valid email address.").trim().toLowerCase(),
  phoneNumber: z.string().min(10, "Phone number is required."),
  country: z.string().min(2, "Country is required."),
  location: z.string().min(2, "Location is required."),
  zipCode: z.string().min(2, "Zip code is required."),
  userType: z.enum(["ENTREPRENEUR", "NEW_BUSINESS"]),
  joinAim: z.string().min(10, "Please share your main aim to join this portal."),
  aboutYourself: z.string().min(20, "Tell us more about yourself (minimum 20 characters)."),
  experienceLevel: z.string().min(2, "Experience level is required."),
  primaryGoal: z.string().min(2, "Primary goal is required."),
  linkedinUrl: z.string().url("LinkedIn URL is required and must be valid."),
  password: z
    .string()
    .min(8, "Password should be at least 8 characters.")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter.")
    .regex(/[0-9]/, "Password must contain at least one number."),
});

const entrepreneurSchema = z.object({
  entrepreneurCategory: z.string().min(2, "Please select your entrepreneur type."),
  startupName: z.string().min(2, "Startup name is required."),
  stage: z.string().min(2, "Startup stage is required."),
  industry: z.string().min(2, "Industry is required."),
  teamSize: z.string().optional(),
  fundingNeeded: z.string().optional(),
  traction: z.string().optional(),
});

const newBusinessSchema = z.object({
  newBusinessCategory: z.string().min(2, "Please select your new business/startup type."),
  businessName: z.string().min(2, "Business name is required."),
  businessModel: z.string().min(2, "Business model is required."),
  targetMarket: z.string().min(2, "Target market is required."),
  launchTimeline: z.string().min(2, "Launch timeline is required."),
  teamBackground: z.string().optional(),
  initialBudget: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address.").trim().toLowerCase(),
  password: z.string().min(8, "Password should be at least 8 characters."),
});

export type ActionState = {
  error?: string;
  success?: string;
};

export async function registerAction(
  _prevState: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber"),
    country: formData.get("country"),
    location: formData.get("location"),
    zipCode: formData.get("zipCode"),
    userType: formData.get("userType"),
    joinAim: formData.get("joinAim"),
    aboutYourself: formData.get("aboutYourself"),
    experienceLevel: formData.get("experienceLevel"),
    primaryGoal: formData.get("primaryGoal"),
    linkedinUrl: formData.get("linkedinUrl"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid registration input." };
  }

  const {
    name,
    email,
    phoneNumber,
    country,
    location,
    zipCode,
    userType,
    joinAim,
    aboutYourself,
    experienceLevel,
    primaryGoal,
    linkedinUrl,
    password,
  } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }
  const existingPhone = await prisma.user.findUnique({ where: { phoneNumber } });
  if (existingPhone) {
    return { error: "An account with this phone number already exists." };
  }

  const now = new Date();

  const passwordHash = await bcrypt.hash(password, 10);

  const role: AppRole = "FOUNDER";
  if (userType === "ENTREPRENEUR") {
    const entrepreneurParsed = entrepreneurSchema.safeParse({
      entrepreneurCategory: formData.get("entrepreneurCategory"),
      startupName: formData.get("startupName"),
      stage: formData.get("stage"),
      industry: formData.get("industry"),
      teamSize: formData.get("teamSize"),
      fundingNeeded: formData.get("fundingNeeded"),
      traction: formData.get("traction"),
    });
    if (!entrepreneurParsed.success) {
      return { error: entrepreneurParsed.error.issues[0]?.message ?? "Entrepreneur profile data is invalid." };
    }

    await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        country,
        location: `${location} (ZIP: ${zipCode})`,
        joinAim,
        aboutYourself,
        experienceLevel,
        primaryGoal,
        linkedinUrl,
        role,
        onboardingStatus: "ROLE_PROFILE",
        emailVerified: now,
        phoneVerifiedAt: now,
        passwordHash,
        founderProfile: {
          create: {
            startupName: entrepreneurParsed.data.startupName,
            stage: entrepreneurParsed.data.stage,
            industry: entrepreneurParsed.data.industry,
            teamSize: entrepreneurParsed.data.teamSize,
            fundingNeeded: entrepreneurParsed.data.fundingNeeded,
            traction: entrepreneurParsed.data.traction
              ? `${entrepreneurParsed.data.traction} | Type: ${entrepreneurParsed.data.entrepreneurCategory}`
              : `Type: ${entrepreneurParsed.data.entrepreneurCategory}`,
          },
        },
      },
    });
  } else {
    const newBusinessParsed = newBusinessSchema.safeParse({
      newBusinessCategory: formData.get("newBusinessCategory"),
      businessName: formData.get("businessName"),
      businessModel: formData.get("businessModel"),
      targetMarket: formData.get("targetMarket"),
      launchTimeline: formData.get("launchTimeline"),
      teamBackground: formData.get("teamBackground"),
      initialBudget: formData.get("initialBudget"),
    });
    if (!newBusinessParsed.success) {
      return { error: newBusinessParsed.error.issues[0]?.message ?? "New business profile data is invalid." };
    }

    await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        country,
        location: `${location} (ZIP: ${zipCode})`,
        joinAim,
        aboutYourself,
        experienceLevel,
        primaryGoal,
        linkedinUrl,
        role,
        onboardingStatus: "ROLE_PROFILE",
        emailVerified: now,
        phoneVerifiedAt: now,
        passwordHash,
        founderProfile: {
          create: {
            startupName: newBusinessParsed.data.businessName,
            stage: newBusinessParsed.data.launchTimeline,
            industry: newBusinessParsed.data.targetMarket,
            teamSize: newBusinessParsed.data.teamBackground,
            fundingNeeded: newBusinessParsed.data.initialBudget,
            traction: `${newBusinessParsed.data.businessModel} | Type: ${newBusinessParsed.data.newBusinessCategory}`,
          },
        },
      },
    });
  }

  return {
    success: "Account created successfully.",
  };
}

export async function loginAction(
  _prevState: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid credentials format." };
  }

  try {
    const account = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { role: true, onboardingStatus: true, emailVerified: true, phoneVerifiedAt: true },
    });

    if (account && (!account.emailVerified || !account.phoneVerifiedAt)) {
      return { error: "Please verify your email and phone first." };
    }

    const redirectPath = getPostAuthRedirectPath(account?.role, account?.onboardingStatus);
    const baseUrl = process.env.APP_BASE_URL || process.env.AUTH_URL;
    const redirectTo = baseUrl ? new URL(redirectPath, baseUrl).toString() : redirectPath;

    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo,
    });
    return { success: "Signed in successfully." };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}

export async function updateProfileAction(
  _prevState: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  const role = session.user.role;
  if (!role) {
    return { error: "User role not found. Please login again." };
  }

  const commonSchema = z.object({
    name: z.string().min(2, "Name should be at least 2 characters."),
    phoneNumber: z.string().min(10, "Phone number is required."),
    country: z.string().min(2, "Country is required."),
    location: z.string().min(2, "Location is required."),
    joinAim: z.string().min(10, "Main aim should be more descriptive."),
    aboutYourself: z.string().min(20, "About yourself should be at least 20 characters."),
    experienceLevel: z.string().min(2, "Experience level is required."),
    primaryGoal: z.string().min(2, "Primary goal is required."),
    linkedinUrl: z.string().url("LinkedIn URL is required and must be valid."),
  });

  const parsedCommon = commonSchema.safeParse({
    name: formData.get("name"),
    phoneNumber: formData.get("phoneNumber"),
    country: formData.get("country"),
    location: formData.get("location"),
    joinAim: formData.get("joinAim"),
    aboutYourself: formData.get("aboutYourself"),
    experienceLevel: formData.get("experienceLevel"),
    primaryGoal: formData.get("primaryGoal"),
    linkedinUrl: formData.get("linkedinUrl"),
  });

  if (!parsedCommon.success) {
    return { error: parsedCommon.error.issues[0]?.message ?? "Invalid common profile input." };
  }

  const duplicatePhoneOwner = await prisma.user.findFirst({
    where: {
      phoneNumber: parsedCommon.data.phoneNumber,
      id: { not: session.user.id },
    },
    select: { id: true },
  });
  if (duplicatePhoneOwner) {
    return { error: "This phone number is already used by another account." };
  }

  if (role === "FOUNDER") {
    const founderSchema = z.object({
      startupName: z.string().min(2, "Startup name is required."),
      stage: z.string().min(2, "Stage is required."),
      industry: z.string().min(2, "Industry is required."),
      teamSize: z.string().optional(),
      fundingNeeded: z.string().optional(),
      traction: z.string().optional(),
    });
    const parsedFounder = founderSchema.safeParse({
      startupName: formData.get("startupName"),
      stage: formData.get("stage"),
      industry: formData.get("industry"),
      teamSize: formData.get("teamSize"),
      fundingNeeded: formData.get("fundingNeeded"),
      traction: formData.get("traction"),
    });
    if (!parsedFounder.success) {
      return { error: parsedFounder.error.issues[0]?.message ?? "Invalid founder profile input." };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...parsedCommon.data,
        linkedinUrl: parsedCommon.data.linkedinUrl,
        founderProfile: {
          upsert: {
            create: parsedFounder.data,
            update: parsedFounder.data,
          },
        },
      },
    });
  } else if (role === "MENTOR") {
    const mentorSchema = z.object({
      yearsExperience: z.coerce.number().int().min(1, "Years of experience is required."),
      domainExpertise: z.string().min(2, "Domain expertise is required."),
      pastCompanies: z.string().optional(),
      mentoringStyle: z.string().optional(),
      availability: z.string().optional(),
    });
    const parsedMentor = mentorSchema.safeParse({
      yearsExperience: formData.get("yearsExperience"),
      domainExpertise: formData.get("domainExpertise"),
      pastCompanies: formData.get("pastCompanies"),
      mentoringStyle: formData.get("mentoringStyle"),
      availability: formData.get("availability"),
    });
    if (!parsedMentor.success) {
      return { error: parsedMentor.error.issues[0]?.message ?? "Invalid mentor profile input." };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...parsedCommon.data,
        linkedinUrl: parsedCommon.data.linkedinUrl,
        mentorProfile: {
          upsert: {
            create: parsedMentor.data,
            update: parsedMentor.data,
          },
        },
      },
    });
  } else if (role === "INVESTOR") {
    const investorSchema = z.object({
      firmName: z.string().min(2, "Firm name is required."),
      checkSizeRange: z.string().min(2, "Check size range is required."),
      investmentStage: z.string().min(2, "Investment stage is required."),
      sectorsOfInterest: z.string().min(2, "Sectors of interest are required."),
      preferredGeography: z.string().optional(),
    });
    const parsedInvestor = investorSchema.safeParse({
      firmName: formData.get("firmName"),
      checkSizeRange: formData.get("checkSizeRange"),
      investmentStage: formData.get("investmentStage"),
      sectorsOfInterest: formData.get("sectorsOfInterest"),
      preferredGeography: formData.get("preferredGeography"),
    });
    if (!parsedInvestor.success) {
      return { error: parsedInvestor.error.issues[0]?.message ?? "Invalid investor profile input." };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...parsedCommon.data,
        linkedinUrl: parsedCommon.data.linkedinUrl,
        investorProfile: {
          upsert: {
            create: parsedInvestor.data,
            update: parsedInvestor.data,
          },
        },
      },
    });
  } else {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...parsedCommon.data,
        linkedinUrl: parsedCommon.data.linkedinUrl,
      },
    });
  }

  return { success: "Profile updated successfully." };
}
