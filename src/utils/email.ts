import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailersend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || "JOUW_API_KEY_HIER",
});

const sentFrom = new Sender("legolads@gmail.com", "LegoLads");

export async function sendVerificationEmail(to: string, code: string) {
  const recipients = [new Recipient(to, "")];

  const subject = "Welkom bij LegoLads! | Welcome to LegoLads!";
  const text = 
`ENGLISH VERSION BELOW

Welkom bij LegoLads! Dit is je verificatiecode: ${code}

---

Welcome to LegoLads! This is your verification code: ${code}
`;

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject(subject)
    .setText(text);

  await mailersend.email.send(emailParams);
}