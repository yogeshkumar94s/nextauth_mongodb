import User from '@/models/userModel';
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'

// code for sending emails with nodemailer and handling user verification or password reset logic, a good grasp of asynchronous operations and interaction with a database.


export const sendEmail = async({email, emailType, userId}:any) => {
    const TOKEN_EXPIRY_DURATION = 3600000;
    try {

       const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        if (emailType === 'VERIFY') {
          await User.findByIdAndUpdate(userId, 
            {verifyToken: hashedToken,verifyTokenExpiry: Date.now() + TOKEN_EXPIRY_DURATION}
            )
        } else if(emailType === 'RESET') {
          await User.findByIdAndUpdate(userId, 
            {forgotPasswordToken: hashedToken,forgotPasswordTokenExpiry: Date.now() + TOKEN_EXPIRY_DURATION}
            )
        }
        
        var transport = nodemailer.createTransport({
          host: process.env.MAIL_HOST,
          port: process.env.MAIL_PORT,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
          }
        });

          const mailOptions = {
            from: 'yogee@gmail.ai', // sender address
            to: email, // list of receivers
            subject: emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password', // Subject line
            html: `<p>Click <a href='${process.env.DOMAIN}/verifyemail?token=${hashedToken}'>here</a> to ${emailType === 'VERIFY' ? "verify your email" : 'reset your password' }
            or copy and paste the link below in your browser.
            <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`, // html body 
          };

          const mailResponse = await transport.sendMail(mailOptions);
          return mailResponse;

    } catch (error:any) {
        throw new Error(error.message)
    }
}