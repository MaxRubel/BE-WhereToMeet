import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendMail(
  to: string,
  subject: string,
  text: string
): Promise<void> {
  // send mail with defined transport obj
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to, // list of emails
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email Sent to ", to);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
