"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth, signIn, signOut } from "@/auth";
import { getPostAuthRedirectPath } from "@/lib/auth-redirect";
import { sendEmailVerificationCode } from "@/lib/verification-delivery";
import { getFirebaseAdminAuth } from "@/lib/firebase-admin";

type AppRole = "FOUNDER" | "MENTOR" | "INVESTOR" | "ADMIN";

const registerSchema = z.object({
  name: z.string().min(2, "Name should be at least 2 characters."),
  email: z.string().email("Enter a valid email address.").trim().toLowerCase(),
  phoneNumber: z.string().min(10, "Phone number is required."),
  emailCode: z.string().length(6, "Email code must be 6 digits."),
  phoneVerificationToken: z.string().min(20, "Please verify your phone number first."),
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
  const intent = String(formData.get("intent") ?? "createAccount");

  if (intent === "verifyEmail") {
    const verificationTargetSchema = z.object({
      email: z.string().email("Enter a valid email address.").trim().toLowerCase(),
    });
    const targetParsed = verificationTargetSchema.safeParse({
      email: formData.get("email"),
    });
    if (!targetParsed.success) {
      return { error: targetParsed.error.issues[0]?.message ?? "Invalid verification request." };
    }

    const { email } = targetParsed.data;
    const existingUserByEmail = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existingUserByEmail) {
      return { error: "An account with this email already exists." };
    }

    const existingVerification = await prisma.registrationVerification.findUnique({
      where: { email },
    });
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const generatedCode = String(Math.floor(100000 + Math.random() * 900000));
    const generatedEmailCode =
      intent === "verifyEmail"
        ? generatedCode
        : existingVerification?.emailCode ?? String(Math.floor(100000 + Math.random() * 900000));
    const generatedPhoneCode = existingVerification?.phoneCode ?? "";

    try {
      await sendEmailVerificationCode(email, generatedCode);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to send verification code right now. Please try again.";
      return { error: message };
    }

    await prisma.registrationVerification.upsert({
      where: { email },
      update: {
        phone: existingVerification?.phone ?? "",
        emailCode: generatedEmailCode,
        phoneCode: generatedPhoneCode,
        expiresAt,
      },
      create: {
        email,
        phone: existingVerification?.phone ?? "",
        emailCode: generatedEmailCode,
        phoneCode: generatedPhoneCode,
        expiresAt,
      },
    });

    return {
      success: "Email verification code sent successfully.",
    };
  }

  if (intent === "verifyEmailCode") {
    const verifyCodeSchema = z.object({
      email: z.string().email("Enter a valid email address.").trim().toLowerCase(),
      emailCode: z.string().length(6, "Email code must be 6 digits."),
    });
    const verifyParsed = verifyCodeSchema.safeParse({
      email: formData.get("email"),
      emailCode: formData.get("emailCode"),
    });
    if (!verifyParsed.success) {
      return { error: verifyParsed.error.issues[0]?.message ?? "Invalid email verification request." };
    }

    const { email, emailCode } = verifyParsed.data;
    const verification = await prisma.registrationVerification.findUnique({ where: { email } });
    const now = new Date();
    if (!verification || verification.expiresAt < now || verification.emailCode !== emailCode) {
      return { error: "Invalid or expired email code. Please click Verify email to get a new code." };
    }

    return { success: "Email code verified successfully." };
  }

  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber"),
    emailCode: formData.get("emailCode"),
    phoneVerificationToken: formData.get("phoneVerificationToken"),
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
    phoneNumber,
    emailCode,
    phoneVerificationToken,
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
    verification.expiresAt < now ||
    verification.emailCode !== emailCode;

  if (codeMissingOrInvalid) {
    return {
      error: "Invalid or expired email code. Please use Verify email and try again.",
    };
  }

  try {
    const decoded = await getFirebaseAdminAuth().verifyIdToken(phoneVerificationToken);
    const verifiedPhone = decoded.phone_number ?? "";
    const normalizedSubmitted = phoneNumber.replace(/\s+/g, "");
    const normalizedVerified = verifiedPhone.replace(/\s+/g, "");
    if (!normalizedVerified || normalizedSubmitted !== normalizedVerified) {
      return { error: "Phone verification failed. Please verify the same phone number and try again." };
    }
  } catch {
    return { error: "Phone verification token is invalid or expired. Please verify phone number again." };
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
    success: "Email and phone verified. Account created successfully.",
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
