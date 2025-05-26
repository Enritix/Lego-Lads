// import { MailerSend, EmailParams, Recipient, Sender } from "mailersend";
// import dotenv from "dotenv";
// dotenv.config();

// const mailerSend = new MailerSend({
//   apiKey: process.env.MAILERSEND_API_KEY || "",
// });

// const sentFrom = new Sender("legoladsap@gmail.com", "LegoLads");

// export async function sendVerificationEmail(to: string, code: string) {
//   const recipients = [new Recipient(to, "")];

//   const subject = "Welkom bij LegoLads! | Welcome to LegoLads!";
//   const text = 
// `ENGLISH VERSION BELOW

// Welkom bij LegoLads! Dit is je verificatiecode: ${code}

// ---

// Welcome to LegoLads! This is your verification code: ${code}
// `;

//   const emailParams = new EmailParams()
//     .setFrom(sentFrom)
//     .setTo(recipients)
//     .setReplyTo(sentFrom)
//     .setSubject(subject)
//     .setText(text);

//   await mailerSend.email.send(emailParams);
// }

import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export async function sendVerificationEmail(to: string, code: string) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "legoladsap@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"LegoLads" <legoladsap@gmail.com>',
    to,
    subject: "Welkom bij LegoLads! | Welcome to LegoLads!",
    text: `Welkom bij LegoLads! Dit is je verificatiecode: ${code}\n\n---\n\nWelcome to LegoLads! This is your verification code: ${code}`,
    // html: `<b>Welkom bij LegoLads! Dit is je verificatiecode: ${code}</b><br><br>---<br><br><b>Welcome to LegoLads! This is your verification code: ${code}</b>`,
  };

  // Verstuur de e-mail
  return await transporter.sendMail(mailOptions);
}