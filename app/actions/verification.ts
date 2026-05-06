"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

export type VerificationState = {
  error?: string;
  success?: string;
};

const verifySchema = z.object({
  email: z.string().email("Valid email is required.").trim().toLowerCase(),
  emailCode: z.string().length(6, "Email verification code must be 6 digits."),
  phoneCode: z.string().length(6, "Phone verification code must be 6 digits."),
});

export async function verifyAccountAction(
  _prevState: VerificationState | undefined,
  formData: FormData,
): Promise<VerificationState> {
  const parsed = verifySchema.safeParse({
    email: formData.get("email"),
    emailCode: formData.get("emailCode"),
    phoneCode: formData.get("phoneCode"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid verification input." };
  }

  const { email, emailCode, phoneCode } = parsed.data;
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      emailVerified: true,
      phoneVerifiedAt: true,
      verificationCodes: true,
    },
  });

  if (!user) {
    return { error: "No account found for this email." };
  }

  const now = new Date();
  const emailCodeRow = user.verificationCodes.find(
    (entry) => entry.type === "EMAIL" && entry.code === emailCode,
  );
  const phoneCodeRow = user.verificationCodes.find(
    (entry) => entry.type === "PHONE" && entry.code === phoneCode,
  );

  if (!emailCodeRow || emailCodeRow.expiresAt < now) {
    return { error: "Invalid or expired email code." };
  }

  if (!phoneCodeRow || phoneCodeRow.expiresAt < now) {
    return { error: "Invalid or expired phone code." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: now,
      phoneVerifiedAt: now,
      onboardingStatus: "COMPLETED",
      verificationCodes: {
        deleteMany: {},
      },
    },
  });

  return { success: "Verification complete. You can now login." };
}
