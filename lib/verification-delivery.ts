import { Resend } from "resend";

export async function sendEmailVerificationCode(email: string, code: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    throw new Error("Email provider is not configured. Missing RESEND_API_KEY or RESEND_FROM_EMAIL.");
  }

  const resend = new Resend(apiKey);
  const subject = "Your Aspire Entrepreneur verification code";
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2 style="margin: 0 0 12px;">Aspire Entrepreneur</h2>
      <p>Your email verification code is:</p>
      <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px; margin: 12px 0;">${code}</p>
      <p>This code expires in 10 minutes.</p>
    </div>
  `;

  const result = await resend.emails.send({
    from,
    to: email,
    subject,
    html,
  });

  if (result.error) {
    throw new Error(result.error.message || "Failed to send email verification code.");
  }
}
