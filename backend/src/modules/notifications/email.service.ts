import nodemailer from "nodemailer";
import { ENV } from "@/config/env";

const transporter = nodemailer.createTransport({
  host: ENV.SMTP_HOST,
  port: Number(ENV.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports (587)
  auth: {
    user: ENV.SMTP_USER,
    pass: ENV.SMTP_PASS,
  },
});

interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

const sendMail = async (options: MailOptions) => {
  return transporter.sendMail({
    from: ENV.SMTP_FROM,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
};

export const emailService = {
  sendMail,
};
