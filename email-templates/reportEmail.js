const transporter = require("./transporter");

function sendReportMail(email, subject, message) {
  console.log(email, subject, message);

  let mailOptions = {
    from: process.env.NODE_MAILER_EMAIL,
    to: email,
    subject: subject,
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dddddd; border-radius: 10px;">
                <h2 style="color: #333;">${subject}</h2>
                <p style="color: #555;">${message}</p>
                <p style="color: #999; font-size: 12px;">
                    Please contact support if you have further questions.
                </p>
            </div>
        `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return { error: error };
    } else {
      console.log("email sent", info.response);
      return { success: true, message: info.response };
    }
  });
}

module.exports = sendReportMail;
