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
  confirmEmail: z.string().email("Confirm email is required.").trim().toLowerCase(),
  phoneNumber: z.string().min(10, "Phone number is required."),
  confirmPhoneNumber: z.string().min(10, "Confirm phone number is required."),
  emailCode: z.string().length(6, "Email code must be 6 digits."),
  phoneCode: z.string().length(6, "Phone code must be 6 digits."),
  country: z.string().min(2, "Country is required."),
  location: z.string().min(2, "Location is required."),
  joinAim: z.string().min(10, "Please share your main aim to join this portal."),
  aboutYourself: z.string().min(20, "Tell us more about yourself (minimum 20 characters)."),
  experienceLevel: z.string().min(2, "Experience level is required."),
  primaryGoal: z.string().min(2, "Primary goal is required."),
  linkedinUrl: z.string().url("Enter a valid LinkedIn URL.").optional().or(z.literal("")),
  password: z
    .string()
    .min(8, "Password should be at least 8 characters.")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter.")
    .regex(/[0-9]/, "Password must contain at least one number."),
  role: z.enum(["FOUNDER", "MENTOR", "INVESTOR"] satisfies AppRole[]),
});

const founderProfileSchema = z.object({
  startupName: z.string().min(2, "Startup name is required."),
  stage: z.string().min(2, "Startup stage is required."),
  industry: z.string().min(2, "Industry is required."),
  teamSize: z.string().optional(),
  fundingNeeded: z.string().optional(),
  traction: z.string().optional(),
});

const mentorProfileSchema = z.object({
  yearsExperience: z.coerce.number().int().min(1, "Years of experience is required."),
  domainExpertise: z.string().min(2, "Domain expertise is required."),
  pastCompanies: z.string().optional(),
  mentoringStyle: z.string().optional(),
  availability: z.string().optional(),
});

const investorProfileSchema = z.object({
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
    confirmEmail: formData.get("confirmEmail"),
    phoneNumber: formData.get("phoneNumber"),
    confirmPhoneNumber: formData.get("confirmPhoneNumber"),
    emailCode: formData.get("emailCode"),
    phoneCode: formData.get("phoneCode"),
    country: formData.get("country"),
    location: formData.get("location"),
    joinAim: formData.get("joinAim"),
    aboutYourself: formData.get("aboutYourself"),
    experienceLevel: formData.get("experienceLevel"),
    primaryGoal: formData.get("primaryGoal"),
    linkedinUrl: formData.get("linkedinUrl"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid registration input." };
  }

  const {
    name,
    email,
    confirmEmail,
    phoneNumber,
    confirmPhoneNumber,
    emailCode,
    phoneCode,
    country,
    location,
    joinAim,
    aboutYourself,
    experienceLevel,
    primaryGoal,
    linkedinUrl,
    password,
    role,
  } = parsed.data;

  if (email !== confirmEmail) {
    return { error: "Email and confirm email do not match." };
  }

  if (phoneNumber !== confirmPhoneNumber) {
    return { error: "Phone number and confirm phone number do not match." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }
  const existingPhone = await prisma.user.findUnique({ where: { phoneNumber } });
  if (existingPhone) {
    return { error: "An account with this phone number already exists." };
  }

  const verification = await prisma.registrationVerification.findUnique({
    where: { email },
  });

  const now = new Date();
  const codeMissingOrInvalid =
    !verification ||
    verification.phone !== phoneNumber ||
    verification.expiresAt < now ||
    verification.emailCode !== emailCode ||
    verification.phoneCode !== phoneCode;

  if (codeMissingOrInvalid) {
    const generatedEmailCode = String(Math.floor(100000 + Math.random() * 900000));
    const generatedPhoneCode = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.registrationVerification.upsert({
      where: { email },
      update: {
        phone: phoneNumber,
        emailCode: generatedEmailCode,
        phoneCode: generatedPhoneCode,
        expiresAt,
      },
      create: {
        email,
        phone: phoneNumber,
        emailCode: generatedEmailCode,
        phoneCode: generatedPhoneCode,
        expiresAt,
      },
    });

    // Demo-friendly fallback: logs code when email/SMS providers are not configured.
    console.log(`[REGISTER VERIFY] Email code for ${email}: ${generatedEmailCode}`);
    console.log(`[REGISTER VERIFY] Phone code for ${phoneNumber}: ${generatedPhoneCode}`);

    return {
      error:
        "Verification codes sent. Check your email/phone (or server logs in demo), enter codes, and submit again.",
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  if (role === "FOUNDER") {
    const founderParsed = founderProfileSchema.safeParse({
      startupName: formData.get("startupName"),
      stage: formData.get("stage"),
      industry: formData.get("industry"),
      teamSize: formData.get("teamSize"),
      fundingNeeded: formData.get("fundingNeeded"),
      traction: formData.get("traction"),
    });
    if (!founderParsed.success) {
      return { error: founderParsed.error.issues[0]?.message ?? "Founder profile data is invalid." };
    }

    await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        country,
        location,
        joinAim,
        aboutYourself,
        experienceLevel,
        primaryGoal,
        linkedinUrl: linkedinUrl || null,
        role,
        onboardingStatus: "ROLE_PROFILE",
        emailVerified: now,
        phoneVerifiedAt: now,
        passwordHash,
        founderProfile: {
          create: founderParsed.data,
        },
      },
    });
  } else if (role === "MENTOR") {
    const mentorParsed = mentorProfileSchema.safeParse({
      yearsExperience: formData.get("yearsExperience"),
      domainExpertise: formData.get("domainExpertise"),
      pastCompanies: formData.get("pastCompanies"),
      mentoringStyle: formData.get("mentoringStyle"),
      availability: formData.get("availability"),
    });
    if (!mentorParsed.success) {
      return { error: mentorParsed.error.issues[0]?.message ?? "Mentor profile data is invalid." };
    }

    await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        country,
        location,
        joinAim,
        aboutYourself,
        experienceLevel,
        primaryGoal,
        linkedinUrl: linkedinUrl || null,
        role,
        onboardingStatus: "ROLE_PROFILE",
        emailVerified: now,
        phoneVerifiedAt: now,
        passwordHash,
        mentorProfile: {
          create: mentorParsed.data,
        },
      },
    });
  } else {
    const investorParsed = investorProfileSchema.safeParse({
      firmName: formData.get("firmName"),
      checkSizeRange: formData.get("checkSizeRange"),
      investmentStage: formData.get("investmentStage"),
      sectorsOfInterest: formData.get("sectorsOfInterest"),
      preferredGeography: formData.get("preferredGeography"),
    });
    if (!investorParsed.success) {
      return { error: investorParsed.error.issues[0]?.message ?? "Investor profile data is invalid." };
    }

    await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        country,
        location,
        joinAim,
        aboutYourself,
        experienceLevel,
        primaryGoal,
        linkedinUrl: linkedinUrl || null,
        role,
        onboardingStatus: "ROLE_PROFILE",
        emailVerified: now,
        phoneVerifiedAt: now,
        passwordHash,
        investorProfile: {
          create: investorParsed.data,
        },
      },
    });
  }

  await prisma.registrationVerification.deleteMany({
    where: { email },
  });

  return {
    success: "Account verified and created successfully.",
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

    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: getPostAuthRedirectPath(account?.role, account?.onboardingStatus),
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
    linkedinUrl: z.string().url("Enter a valid LinkedIn URL.").optional().or(z.literal("")),
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
        linkedinUrl: parsedCommon.data.linkedinUrl || null,
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
        linkedinUrl: parsedCommon.data.linkedinUrl || null,
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
        linkedinUrl: parsedCommon.data.linkedinUrl || null,
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
        linkedinUrl: parsedCommon.data.linkedinUrl || null,
      },
    });
  }

  return { success: "Profile updated successfully." };
}
