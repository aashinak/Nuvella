import nodemailer from "nodemailer";
import logger from "./logger";
import ApiError from "./apiError";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

interface MailOptions {
    subject: string;
    html: string;
    to: string;
}

async function sendMail({ subject, html, to }: MailOptions): Promise<boolean> {
    try {
        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: `"Nuvella" <${process.env.GMAIL_USER}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            html, // html body
        });

        logger.info(`Message sent successfully to ${to}: ${info.messageId}`);
        return true;
    } catch (error: any) {
        // Log detailed error information
        logger.error(`Error while sending email to ${to}: ${error.message}`);

        // Throw a more specific error
        throw new ApiError(
            500,
            `Failed to send email to ${to}. Reason: ${error.message}`
        );
    }
}

export default sendMail;