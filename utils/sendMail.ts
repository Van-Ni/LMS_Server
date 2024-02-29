import nodemailer, { Transporter } from "nodemailer";
import { env } from "../config/enviroment";
import ejs from "ejs";
import path from "path";

interface EmailOptions {
    email: string;
    subject: string;
    template: string;
    data: { [key: string]: any }
}

const sendMail = async (options: EmailOptions): Promise<void> => {
    let transporter: Transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: parseInt(env.SMTP_POST as string),
        service: "",
        secure: false, // true for 465, false for other ports
        auth: {
            user: env.SMTP_MAIL, // generated ethereal user
            pass: env.SMTP_PASSWORD, // generated ethereal password
        },
    });

    const { email, subject, template, data } = options;

    // get the path to the email template file
    const templatePath = path.join(__dirname, "../mails", template)
    // render the email template with EJS
    const html: string = await ejs.renderFile(templatePath, data);

    const mailOptions = {
        from: env.SMTP_MAIL, // sender address
        to: email, // list of receivers
        subject,// Subject line
        html // html body
    };

    await transporter.sendMail(mailOptions);
}

export default sendMail;