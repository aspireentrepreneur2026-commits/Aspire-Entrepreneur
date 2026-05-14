"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth, signIn, signOut } from "@/auth";
import { getPostAuthRedirectPath } from "@/lib/auth-redirect";
import {
  ENTREPRENEUR_TRACK_FIELDS,
  FOUNDER_TRACK_FIELDS,
  type EntrepreneurTrack,
  type FounderTrack,
} from "@/lib/registration-config";

function readDynamicTrackFields(
  formData: FormData,
  defs: { name: string; label: string; required: boolean }[],
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of defs) {
    const raw = formData.get(f.name);
    const s = raw == null ? "" : String(raw).trim();
    if (f.required && s.length < 1) {
      throw new Error(`${f.label} is required.`);
    }
    if (s.length) out[f.name] = s;
  }
  return out;
}

function buildFounderTractionMeta(parts: {
  registrationPath?: string;
  entrepreneurTrack?: EntrepreneurTrack;
  entrepreneurFields?: Record<string, string>;
  founderTrack?: FounderTrack;
  founderFields?: Record<string, string>;
}): string {
  try {
    return JSON.stringify({ v: 1, ...parts });
  } catch {
    return "registration-meta";
  }
}

const newBusinessRegisterSchema = z.object({
  businessName: z.string().min(2, "Business name is required."),
  businessModel: z.string().min(2, "Business model is required."),
  targetMarket: z.string().min(2, "Target market is required."),
  launchTimeline: z.string().min(2, "Launch timeline is required."),
  teamBackground: z.string().optional(),
  initialBudget: z.string().optional(),
});

const registrationPathSchema = z.enum([
  "MENTOR",
  "INVESTOR",
  "ENTREPRENEUR",
  "FOUNDER",
  "NEW_BUSINESS",
  "STARTUP",
  "NEW_IDEA",
]);

const registerSchema = z.object({
  name: z.string().min(2, "Name should be at least 2 characters."),
  email: z.string().email("Enter a valid email address.").trim().toLowerCase(),
  phoneNumber: z.string().min(10, "Phone number is required."),
  country: z.string().min(2, "Country is required."),
  location: z.string().min(2, "Location is required."),
  zipCode: z.string().min(2, "Zip code is required."),
  registrationPath: registrationPathSchema,
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

const founderBaseSchema = z.object({
  ventureName: z.string().min(2, "Venture or project name is required."),
  industry: z.string().min(2, "Industry is required."),
  stage: z.string().min(2, "Stage is required."),
});

const mentorRegisterSchema = z.object({
  yearsExperience: z.coerce.number().int().min(1, "Years of experience is required."),
  domainExpertise: z.string().min(2, "Domain expertise is required."),
  pastCompanies: z.string().optional(),
  mentoringStyle: z.string().optional(),
  availability: z.string().optional(),
});

const investorRegisterSchema = z.object({
  firmName: z.string().min(2, "Firm or fund name is required."),
  checkSizeRange: z.string().min(2, "Check size range is required."),
  investmentStage: z.string().min(2, "Investment stage is required."),
  sectorsOfInterest: z.string().min(2, "Sectors of interest are required."),
  preferredGeography: z.string().optional(),
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
    registrationPath: formData.get("registrationPath"),
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
    registrationPath,
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
  const locationLine = `${location} (ZIP: ${zipCode})`;

  const baseUser = {
    name,
    email,
    phoneNumber,
    country,
    location: locationLine,
    joinAim,
    aboutYourself,
    experienceLevel,
    primaryGoal,
    linkedinUrl,
    passwordHash,
    emailVerified: now,
    phoneVerifiedAt: now,
  };

  try {
    if (registrationPath === "MENTOR") {
      const m = mentorRegisterSchema.safeParse({
        yearsExperience: formData.get("yearsExperience"),
        domainExpertise: formData.get("domainExpertise"),
        pastCompanies: formData.get("pastCompanies"),
        mentoringStyle: formData.get("mentoringStyle"),
        availability: formData.get("availability"),
      });
      if (!m.success) {
        return { error: m.error.issues[0]?.message ?? "Invalid mentor details." };
      }
      await prisma.user.create({
        data: {
          ...baseUser,
          role: "MENTOR",
          onboardingStatus: "COMPLETED",
          profileApprovalStatus: "PENDING",
          mentorProfile: {
            create: m.data,
          },
        },
      });
      return { success: "Account created successfully." };
    }

    if (registrationPath === "INVESTOR") {
      const inv = investorRegisterSchema.safeParse({
        firmName: formData.get("firmName"),
        checkSizeRange: formData.get("checkSizeRange"),
        investmentStage: formData.get("investmentStage"),
        sectorsOfInterest: formData.get("sectorsOfInterest"),
        preferredGeography: formData.get("preferredGeography"),
      });
      if (!inv.success) {
        return { error: inv.error.issues[0]?.message ?? "Invalid investor details." };
      }
      await prisma.user.create({
        data: {
          ...baseUser,
          role: "INVESTOR",
          onboardingStatus: "COMPLETED",
          profileApprovalStatus: "PENDING",
          investorProfile: {
            create: inv.data,
          },
        },
      });
      return { success: "Account created successfully." };
    }

    if (registrationPath === "ENTREPRENEUR") {
      const fb = founderBaseSchema.safeParse({
        ventureName: formData.get("ventureName"),
        industry: formData.get("industry"),
        stage: formData.get("stage"),
      });
      if (!fb.success) {
        return { error: fb.error.issues[0]?.message ?? "Venture details are invalid." };
      }
      const t = String(formData.get("entrepreneurTrack") ?? "").trim() as EntrepreneurTrack;
      const defs = ENTREPRENEUR_TRACK_FIELDS[t];
      if (!defs) {
        return { error: "Select your entrepreneur track (e.g. new beginner, new startup)." };
      }
      const entrepreneurFields = readDynamicTrackFields(formData, defs);
      const tractionMeta = buildFounderTractionMeta({
        registrationPath,
        entrepreneurTrack: t,
        entrepreneurFields,
      });
      await prisma.user.create({
        data: {
          ...baseUser,
          role: "FOUNDER",
          onboardingStatus: "ROLE_PROFILE",
          profileApprovalStatus: "PENDING",
          founderProfile: {
            create: {
              startupName: fb.data.ventureName,
              stage: fb.data.stage,
              industry: fb.data.industry,
              teamSize: `Entrepreneur: ${t}`,
              fundingNeeded: formData.get("fundingNeeded")?.toString().trim() || null,
              traction: tractionMeta,
            },
          },
        },
      });
      return { success: "Account created successfully." };
    }

    if (registrationPath === "FOUNDER") {
      const fb = founderBaseSchema.safeParse({
        ventureName: formData.get("ventureName"),
        industry: formData.get("industry"),
        stage: formData.get("stage"),
      });
      if (!fb.success) {
        return { error: fb.error.issues[0]?.message ?? "Venture details are invalid." };
      }
      const t = String(formData.get("founderTrack") ?? "").trim() as FounderTrack;
      const defs = FOUNDER_TRACK_FIELDS[t];
      if (!defs) {
        return { error: "Select your founder track (e.g. early-stage startup, growth company)." };
      }
      const founderFields = readDynamicTrackFields(formData, defs);
      const tractionMeta = buildFounderTractionMeta({
        registrationPath,
        founderTrack: t,
        founderFields,
      });
      await prisma.user.create({
        data: {
          ...baseUser,
          role: "FOUNDER",
          onboardingStatus: "ROLE_PROFILE",
          profileApprovalStatus: "PENDING",
          founderProfile: {
            create: {
              startupName: fb.data.ventureName,
              stage: fb.data.stage,
              industry: fb.data.industry,
              teamSize: `Founder: ${t}`,
              fundingNeeded: formData.get("fundingNeeded")?.toString().trim() || null,
              traction: tractionMeta,
            },
          },
        },
      });
      return { success: "Account created successfully." };
    }

    if (registrationPath === "NEW_IDEA") {
      const fb = founderBaseSchema.safeParse({
        ventureName: formData.get("ventureName"),
        industry: formData.get("industry"),
        stage: formData.get("stage"),
      });
      if (!fb.success) {
        return { error: fb.error.issues[0]?.message ?? "Venture details are invalid." };
      }
      const ideaTrack: FounderTrack = "IDEA_STAGE";
      const ideaDefs = FOUNDER_TRACK_FIELDS[ideaTrack];
      const founderFields = readDynamicTrackFields(formData, ideaDefs);
      const tractionMeta = buildFounderTractionMeta({
        registrationPath,
        founderTrack: ideaTrack,
        founderFields,
      });
      await prisma.user.create({
        data: {
          ...baseUser,
          role: "FOUNDER",
          onboardingStatus: "ROLE_PROFILE",
          profileApprovalStatus: "PENDING",
          founderProfile: {
            create: {
              startupName: fb.data.ventureName,
              stage: fb.data.stage,
              industry: fb.data.industry,
              teamSize: "Venture: new idea · IDEA_STAGE",
              fundingNeeded: formData.get("fundingNeeded")?.toString().trim() || null,
              traction: tractionMeta,
            },
          },
        },
      });
      return { success: "Account created successfully." };
    }

    if (registrationPath === "NEW_BUSINESS") {
      const fb = founderBaseSchema.safeParse({
        ventureName: formData.get("ventureName"),
        industry: formData.get("industry"),
        stage: formData.get("stage"),
      });
      if (!fb.success) {
        return { error: fb.error.issues[0]?.message ?? "Venture details are invalid." };
      }
      const nb = newBusinessRegisterSchema.safeParse({
        businessName: formData.get("businessName"),
        businessModel: formData.get("businessModel"),
        targetMarket: formData.get("targetMarket"),
        launchTimeline: formData.get("launchTimeline"),
        teamBackground: formData.get("teamBackground"),
        initialBudget: formData.get("initialBudget"),
      });
      if (!nb.success) {
        return { error: nb.error.issues[0]?.message ?? "New business details are invalid." };
      }
      const tractionMeta = buildFounderTractionMeta({
        registrationPath,
        founderFields: {
          businessModel: nb.data.businessModel,
          targetMarket: nb.data.targetMarket,
          teamBackground: nb.data.teamBackground ?? "",
          initialBudget: nb.data.initialBudget ?? "",
        },
      });
      await prisma.user.create({
        data: {
          ...baseUser,
          role: "FOUNDER",
          onboardingStatus: "ROLE_PROFILE",
          profileApprovalStatus: "PENDING",
          founderProfile: {
            create: {
              startupName: nb.data.businessName,
              stage: nb.data.launchTimeline,
              industry: fb.data.industry,
              teamSize: fb.data.ventureName,
              fundingNeeded: nb.data.initialBudget ?? null,
              traction: tractionMeta,
            },
          },
        },
      });
      return { success: "Account created successfully." };
    }

    if (registrationPath === "STARTUP") {
      const fb = founderBaseSchema.safeParse({
        ventureName: formData.get("ventureName"),
        industry: formData.get("industry"),
        stage: formData.get("stage"),
      });
      if (!fb.success) {
        return { error: fb.error.issues[0]?.message ?? "Venture details are invalid." };
      }
      const startupTrack: FounderTrack = "EARLY_STARTUP";
      const startupDefs = FOUNDER_TRACK_FIELDS[startupTrack];
      const founderFields = readDynamicTrackFields(formData, startupDefs);
      const tractionMeta = buildFounderTractionMeta({
        registrationPath,
        founderTrack: startupTrack,
        founderFields,
      });
      await prisma.user.create({
        data: {
          ...baseUser,
          role: "FOUNDER",
          onboardingStatus: "ROLE_PROFILE",
          profileApprovalStatus: "PENDING",
          founderProfile: {
            create: {
              startupName: fb.data.ventureName,
              stage: fb.data.stage,
              industry: fb.data.industry,
              teamSize: "Venture: startup · EARLY_STARTUP",
              fundingNeeded: formData.get("fundingNeeded")?.toString().trim() || null,
              traction: tractionMeta,
            },
          },
        },
      });
      return { success: "Account created successfully." };
    }

    throw new Error("Invalid registration path.");
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Registration failed.";
    return { error: msg };
  }
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
    const account = await prisma.user.findFirst({
      where: { email: { equals: parsed.data.email, mode: "insensitive" } },
      select: { role: true, onboardingStatus: true },
    });

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
