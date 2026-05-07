import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendQuoteEmail(to, quoteData) {
  const { fullName, vehicleType, marketValue, coverageType, premium } = quoteData;
  const html = `
    <h2>Thank you for your quote, ${fullName}</h2>
    <p>Here are the details of your motor insurance quote:</p>
    <ul>
      <li>Vehicle Type: ${vehicleType}</li>
      <li>Market Value: ZMW ${marketValue}</li>
      <li>Coverage: ${coverageType}</li>
      <li>Premium: ZMW ${premium}</li>
    </ul>
    <p>If you have any questions, contact us at info@wenchi.com</p>
  `;
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your Wenchi Motor Insurance Quote',
    html,
  });
}
