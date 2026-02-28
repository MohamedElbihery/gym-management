const nodemailer = require('nodemailer');
require('dotenv').config();

// Dev mode: log to console. Prod mode: use SMTP.
const isDev = process.env.NODE_ENV !== 'production';

let transporter;

if (isDev || !process.env.SMTP_USER) {
    // Console transport for development
    transporter = {
        sendMail: async (options) => {
            console.log('\n📧 ══════════════════════════════════════');
            console.log(`  To:      ${options.to}`);
            console.log(`  Subject: ${options.subject}`);
            console.log(`  OTP:     ${options.text?.match(/\d{6}/)?.[0] || 'N/A'}`);
            console.log('══════════════════════════════════════════\n');
            return { messageId: `dev-${Date.now()}` };
        }
    };
    console.log('📧 Email: Using console transport (dev mode)');
} else {
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    console.log('📧 Email: Using SMTP transport');
}

module.exports = {
    async sendOTP(to, otp) {
        const html = `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,sans-serif;background:#0a0a0f;">
            <div style="max-width:480px;margin:40px auto;background:#12121a;border:1px solid #2a2a33;border-radius:16px;overflow:hidden;">
                <div style="background:linear-gradient(135deg,#f97316,#ea580c);padding:32px;text-align:center;">
                    <h1 style="color:#fff;margin:0;font-size:24px;">GymForge Pro</h1>
                    <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:14px;">Verify Your Email</p>
                </div>
                <div style="padding:36px 32px;text-align:center;">
                    <p style="color:#a1a1aa;margin:0 0 24px;font-size:15px;">Your OTP verification code is:</p>
                    <div style="background:#1a1a22;border:2px solid #f97316;border-radius:12px;padding:20px;margin:0 auto;display:inline-block;">
                        <span style="font-size:36px;font-weight:800;letter-spacing:8px;color:#f97316;">${otp}</span>
                    </div>
                    <p style="color:#64647a;margin:24px 0 0;font-size:13px;">This code expires in <strong style="color:#f4f4f5;">5 minutes</strong>.</p>
                    <p style="color:#64647a;font-size:13px;">If you didn't request this, please ignore this email.</p>
                </div>
                <div style="border-top:1px solid #2a2a33;padding:16px;text-align:center;">
                    <p style="color:#64647a;margin:0;font-size:12px;">© 2026 GymForge Pro — AI-Powered Fitness</p>
                </div>
            </div>
        </body>
        </html>`;

        return transporter.sendMail({
            from: `"GymForge Pro" <${process.env.EMAIL_FROM || 'noreply@gymforge.pro'}>`,
            to,
            subject: 'GymForge Pro — Your OTP Verification Code',
            text: `Your GymForge Pro verification code is: ${otp}. It expires in 5 minutes.`,
            html,
        });
    },

    async sendWelcome(to, name) {
        return transporter.sendMail({
            from: `"GymForge Pro" <${process.env.EMAIL_FROM || 'noreply@gymforge.pro'}>`,
            to,
            subject: 'Welcome to GymForge Pro! 🎉',
            text: `Welcome ${name}! Your account is now active. Start your fitness journey today!`,
        });
    },

    async sendRetentionOffer(to, name, offer) {
        return transporter.sendMail({
            from: `"GymForge Pro" <${process.env.EMAIL_FROM || 'noreply@gymforge.pro'}>`,
            to,
            subject: 'GymForge Pro — Special Offer Just For You! 💪',
            text: `Hey ${name}, we miss you! ${offer}`,
        });
    },

    async sendAdminNotification(adminEmail, userName, userEmail, role) {
        const html = `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,sans-serif;background:#0a0a0f;">
            <div style="max-width:480px;margin:40px auto;background:#12121a;border:1px solid #2a2a33;border-radius:16px;overflow:hidden;">
                <div style="background:linear-gradient(135deg,#f97316,#ea580c);padding:32px;text-align:center;">
                    <h1 style="color:#fff;margin:0;font-size:24px;">GymForge Pro</h1>
                    <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:14px;">New Registration Request</p>
                </div>
                <div style="padding:36px 32px;text-align:center;">
                    <p style="color:#a1a1aa;margin:0 0 16px;font-size:15px;">A new <strong style="color:#f97316;text-transform:capitalize;">${role}</strong> has registered and needs your approval:</p>
                    <div style="background:#1a1a22;border:1px solid #2a2a33;border-radius:12px;padding:20px;margin:0 auto;text-align:left;">
                        <p style="color:#e4e4e7;margin:0 0 8px;font-size:14px;"><strong>Name:</strong> ${userName}</p>
                        <p style="color:#e4e4e7;margin:0 0 8px;font-size:14px;"><strong>Email:</strong> ${userEmail}</p>
                        <p style="color:#e4e4e7;margin:0;font-size:14px;"><strong>Role:</strong> <span style="text-transform:capitalize;">${role}</span></p>
                    </div>
                    <p style="color:#64647a;margin:24px 0 0;font-size:13px;">Please log in to review and approve or reject this request.</p>
                </div>
                <div style="border-top:1px solid #2a2a33;padding:16px;text-align:center;">
                    <p style="color:#64647a;margin:0;font-size:12px;">© 2026 GymForge Pro — AI-Powered Fitness</p>
                </div>
            </div>
        </body>
        </html>`;

        return transporter.sendMail({
            from: `"GymForge Pro" <${process.env.EMAIL_FROM || 'noreply@gymforge.pro'}>`,
            to: adminEmail,
            subject: `GymForge Pro — New ${role.charAt(0).toUpperCase() + role.slice(1)} Registration Pending Approval`,
            text: `A new ${role} has registered: ${userName} (${userEmail}). Please log in to approve or reject.`,
            html,
        });
    }
};
