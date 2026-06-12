const nodemailer = require("nodemailer");

const createMailTransporter = () => {
  if (process.env.MAIL_DELIVERY_ENABLED !== "true") {
    return {
      sendMail: async (message) => {
        console.log(
          `[mail disabled] ${message.subject} -> ${message.to}: ${message.text}`
        );
      },
    };
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 8000,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

module.exports = createMailTransporter;
