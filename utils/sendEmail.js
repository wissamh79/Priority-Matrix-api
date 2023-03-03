const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USER, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      // html: `<p>Verify your email address to complete the signup and login into your account.</p><p>This link <b>expires in 6 hours</b>.</p> <p>Press <a href=${
      //   currentUrl + "auth/verify/" + uniqueString
      // }>here</a> to proceed.</p> `, // html body
    });
  } catch (error) {
    console.log(`Email not sent because ${error}`);
  }
};
module.exports = sendEmail;
