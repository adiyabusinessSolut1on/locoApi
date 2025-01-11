const transporter =require("./transporter")
function sendAlerMail(email) {
    let mailOptions = {
        from: process.env.NODE_MAILER_EMAIL,
        to: email,
        subject: "Warning Alert !",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dddddd; border-radius: 10px;">
                <h2 style="color: #FF0034;">Someone Trying to Login Your Accound </h2>
                <h4 style="color: #555;">
                    If not You Then Take Action .
                </h4>
                <p style="color: #555; font-size: 12px;">
                    cahnges your password if not you
                </p>
               
            </div>
        `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return { error: error };
        } else {
            console.log("email sent",info.response)
            return { success: true, message: info.response };
        }
    });
}

module.exports = sendAlerMail;
