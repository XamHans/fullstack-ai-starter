import { Resend } from 'resend';
import { emailTemplates, type EmailTemplateName } from '@/lib/email/templates';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  templateName: EmailTemplateName;
  templateProps?: Record<string, any>;
  from?: string;
}

export class EmailService {
  private resend: Resend;
  private fromEmail: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is required');
    }

    this.resend = new Resend(apiKey);
    this.fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com';
  }

  async sendEmail(options: EmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const Template = emailTemplates[options.templateName];

      const result = await this.resend.emails.send({
        from: options.from || this.fromEmail,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        react: Template(options.templateProps || {}),
      });

      return { success: true, id: result.data?.id };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}