import nodemailer from "nodemailer";
import { ENV } from "@/config/env";

const transporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: Number(ENV.SMTP_PORT),
    secure: false,
    auth: {
        user: ENV.SMTP_USER,
        pass: ENV.SMTP_PASS,
    },
});

export const sendEmail = async (
    to: string,
    subject: string,
    html: string
) => {
    await transporter.sendMail({
        from: ENV.SMTP_FROM,
        to,
        subject,
        html,
    });
};