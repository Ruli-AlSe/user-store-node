import nodemailer, { Transporter } from 'nodemailer';

export interface SendEmailOptions {
  emailTo: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachment[];
}

export interface Attachment {
  filename: string;
  path: string;
}

export class EmailService {
  private transporter: Transporter;

  constructor(mailerService: string, mailerEmail: string, senderEmailPassword: string) {
    this.transporter = nodemailer.createTransport({
      service: mailerService,
      auth: {
        user: mailerEmail,
        pass: senderEmailPassword,
      },
    });
  }

  async sendEmail(options: SendEmailOptions) {
    const { emailTo, subject, htmlBody, attachments = [] } = options;

    try {
      await this.transporter.sendMail({
        to: emailTo,
        subject,
        html: htmlBody,
        attachments,
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
