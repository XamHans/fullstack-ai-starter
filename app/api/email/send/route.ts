import type { NextRequest } from 'next/server';
import {
  ApiError,
  parseRequestBody,
  validateRequiredFields,
  withAuthentication,
} from '@/lib/api/base';
import { getContainer } from '@/lib/container';
import type { EmailTemplateName } from '@/lib/email/templates';

interface SendEmailRequest {
  to: string | string[];
  subject: string;
  templateName: EmailTemplateName;
  templateProps?: Record<string, any>;
}

export const POST = withAuthentication(async (session, request: NextRequest) => {
  const body = await parseRequestBody<SendEmailRequest>(request);
  validateRequiredFields(body, ['to', 'subject', 'templateName']);

  const { emailService } = getContainer();

  const result = await emailService.sendEmail({
    to: body.to,
    subject: body.subject,
    templateName: body.templateName,
    templateProps: body.templateProps,
  });

  if (!result.success) {
    throw new ApiError(500, result.error || 'Failed to send email', 'EMAIL_SEND_FAILED');
  }

  return {
    message: 'Email sent successfully',
    emailId: result.id,
  };
});
