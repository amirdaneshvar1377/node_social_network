const nodeMailer = require("nodemailer");
require('dotenv').config()

exports.sendEmail = emailData => {
    const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: "amirdaneshvar33@gmail.com",
            // pass: "uubzyjjwrmwauxkm"
            pass: process.env.PASS_EMAIL
        }
    });
    return (
        transporter
            .sendMail(emailData)
            .then(info => console.log(`Message sent: ${info.response}`))
            .catch(err => console.log(`Problem sending email: ${err}`))
    );
};
