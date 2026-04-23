import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

// each email type has its own dto
type ResetPasswordContext = {
  name: string;
  resetUrl: string;
  expiresIn: string;
};

type WelcomeContext = {
  name: string;
  loginUrl: string;
};

type DeactivationContext = {
  name: string;
  supportEmail: string;
};

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  // base method - all others use this
  private async send(
    to: string,
    subject: string,
    template: string,
    context: Record<string, any>,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  // one method per email type
  public async sendResetPasswordEmail(
    to: string,
    context: ResetPasswordContext,
  ): Promise<void> {
    await this.send(to, 'Reset your password', 'reset-password', context);
  }

  public async sendDeactivationEmail(
    to: string,
    context: DeactivationContext,
  ): Promise<void> {
    await this.send(
      to,
      'Your account has been deactivated',
      'deactivation',
      context,
    );
  }
}
