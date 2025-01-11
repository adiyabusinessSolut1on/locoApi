require("dotenv").config();
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_PASSWORD,
    },
});
module.exports=transporter