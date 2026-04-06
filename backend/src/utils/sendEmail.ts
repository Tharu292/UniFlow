import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    console.log("Sending email...");
    console.log("TO:", to);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true, // TLS
      logger:true,
      auth: {
        user: process.env.EMAIL_USER, //  your outlook email
        pass: process.env.EMAIL_PASS, // app password
      },
      tls: {
        rejectUnauthorized: true, // helpful for local testing
      },
    });

    // Verify connection first (IMPORTANT DEBUG)
    await transporter.verify();
    console.log(" SMTP server is ready");

    // Send email to real email
    const info = await transporter.sendMail({
      from: `"UniFlow" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("Email sent:", info.messageId);

  } catch (error: any) {
    console.error("Email sending failed:");
    console.error(error.message);

    throw new Error("Email sending failed"); 
  }
};