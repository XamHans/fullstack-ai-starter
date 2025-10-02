import { Resend } from 'resend';
import { type EmailTemplateName, emailTemplates } from '@/lib/email/templates';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  templateName: EmailTemplateName;
  templateProps?: Record<string, any>;
  from?: string;
}

export class EmailService {
  private resend: Resend | null = null;
  private fromEmail: string;
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY;
    this.fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com';
  }

  private ensureInitialized(): void {
    if (!this.apiKey) {
      throw new Error('RESEND_API_KEY environment variable is required to send emails');
    }
    if (!this.resend) {
      this.resend = new Resend(this.apiKey);
    }
  }

  async sendEmail(
    options: EmailOptions,
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      this.ensureInitialized();

      const Template = emailTemplates[options.templateName];

      const result = await this.resend!.emails.send({
        from: options.from || this.fromEmail,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        react: Template(options.templateProps || {}),
      });

      return { success: true, id: result.data?.id };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
