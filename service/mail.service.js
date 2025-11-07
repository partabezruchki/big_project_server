const nodeMailer = require("nodemailer");

class MailService {
  constructor() {
    this.transporter = nodeMailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // console.log("MailService transporter config:", {
    //   host: process.env.SMTP_HOST,
    //   port: process.env.SMTP_PORT,
    //   user: process.env.SMTP_USER,
    //   pass: process.env.SMTP_PASSWORD ? "******" : undefined,
    // });
  }

  async sendMail(email, link) {
    await this.transporter.sendMail({
      from: `"MyApp Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Activate your account",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; padding: 20px;">
          <h2>Welcome to MyApp!</h2>
          <p>Thank you for registering. Please click the button below to activate your account:</p>
          <a href="${link}" style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #007BFF;
            color: white;
            text-decoration: none;
            border-radius: 5px;
          ">Activate Account</a>
          <p>If the button doesn't work, copy and paste the following URL into your browser:</p>
          <p>${link}</p>
        </div>
      `,
    });
  }
}

module.exports = new MailService();
