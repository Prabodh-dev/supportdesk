import { Resend } from "resend";
import { env } from "../config/env";
import type { EmailPayload } from "./types";

export async function sendEmail(payload: EmailPayload) {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) return;
  const resend = new Resend(env.RESEND_API_KEY);

  await resend.emails.send({
    from: env.EMAIL_FROM,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  });
}
