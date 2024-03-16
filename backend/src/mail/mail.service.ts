import { Injectable, Logger } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';
import { IMailService } from './interface.service';

@Injectable()
export class MailService implements IMailService {
  private readonly transporter: Transporter;
  private readonly log = new Logger(MailService.name);

  constructor() {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL_ADDRESS,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmailVerificationCode(email: string, code: string) {
    const subject = 'Email Verification';
    const body = `<p>Your verification code is: <strong>${code}</strong></p>`;
    await this.sendEmail(email, subject, body);
  }

  async sendEmailVerifiedEmail(email: string) {
    const subject = 'Email Verified';
    const body = `<p>Your email has been verified</p>`;
    await this.sendEmail(email, subject, body);
  }

  private async sendEmail(
    email: string,
    subject: string,
    body: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: email,
        subject: subject,
        html: body,
      });
      this.log.log(`Email sent to ${email}`);
    } catch (error) {
      this.log.error(`Error sending email to ${email}: ${error.message}`);
    }
  }
}
