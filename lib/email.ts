import nodemailer from "nodemailer"
type SendEmailArg = {
    email : string,
    otp : string
}
export async function sendMail({email, otp }: SendEmailArg){
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.SMTP_USER_ID,
          pass: process.env.SMTP_USER_PASSWORD
        }
    });
    const result = await transport.sendMail({
        from: 'Buy&Sell.com',
        to: email,
        subject: "Email Verification via OTP",
        html : `<html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification - Buy and Sell</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
            .container {
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              text-align: center;
              max-width: 600px;
              width: 100%;
            }
            .header {
              font-size: 24px;
              margin-bottom: 20px;
            }
            .otp {
              font-size: 32px;
              font-weight: bold;
              margin: 20px 0;
              color: #333333;
            }
            .message {
              font-size: 16px;
              margin-bottom: 20px;
              color: #666666;
            }
            .footer {
              font-size: 14px;
              color: #999999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              Welcome to Buy and Sell!
            </div>
            <div class="message">
              We're excited to have you on board. Verify your email address by entering the OTP below:
            </div>
            <div class="otp">
              ${otp}
            </div>
            <div class="message">
              If you did not request this verification, please ignore this email.
            </div>
            <div class="footer">
              © 2025 Buy and Sell. All rights reserved.
            </div>
          </div>
        </body>
        </html>`
    })
    return result;
}