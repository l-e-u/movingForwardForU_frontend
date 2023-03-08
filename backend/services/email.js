import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: false,
    auth: {
        user: process.env.EMAIL_ACCOUNT_SENDER_T0_REGISTER_NEW_USER,
        pass: process.env.EMAIL_PASSWORD_SENDER_TO_REGISTER_NEW_USER
    }
});

export const sendVerifyEmailRequest = async ({ firstName, email, token }) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_ACCOUNT_SENDER_T0_REGISTER_NEW_USER,
            to: email,
            subject: `Moving Forward. ${firstName}, please complete your account set up.`,
            html: `Hello ${firstName},<br/><br/>The link below will have you set up your account, this link expires in one hour after this message has been sent.<br />Please note, you must complete this step in order to login to Moving Forward. Contact us if this link expires.<br/><br/><a href="http://localhost:3000/verify/${token}/${firstName}">Go set up my account with Moving Forward.</a><br/><br/> Best regards,<br/>Moving Forward, LLC.`
        });
    }
    catch (err) {
        console.error(err);
    };
};