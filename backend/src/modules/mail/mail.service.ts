import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SentEmailDTO } from './dto/sendEmail.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(dto: SentEmailDTO) {
    try {
      const result = await this.mailerService.sendMail({
        from: dto.sender,
        to: dto.recepients,
        subject: dto.subject,

        template: dto.template,
        context: {
          title: 'Welcome',
          name: dto.name,
          email: dto.email,
          password: dto.password,
          hr: dto.hr,
        },
        text: dto.text,
      });
      return result;
    } catch (error) {
      console.error('Email sending failed:', error);

      if (error.response) {
        const errorMessage = error.response.body
          ? error.response.body
          : 'An unknown error occurred';
        console.error('Mailjet Error Details:', errorMessage);

        throw new BadRequestException(`Mailjet Error: ${errorMessage}`);
      }

      throw new InternalServerErrorException(
        `Failed to send email. Please try again later.${error}`,
      );
    }
  }
  async sendInterviewEmail(dto: SentEmailDTO) {
    try {
      const res = await this.mailerService.sendMail({
        from: dto.sender,
        to: dto.recepients,
        template: 'interview-template',
        subject: dto.subject,
        context: {
          content: dto.text,
          closure: dto.closure,
        },
      });
      return res;
    } catch (error) {
      console.error('Email sending failed:', error);

      if (error.response) {
        const errorMessage = error.response.body
          ? error.response.body
          : 'An unknown error occurred';
        console.error('Mailjet Error Details:', errorMessage);

        throw new BadRequestException(`Mailjet Error: ${errorMessage}`);
      }

      throw new InternalServerErrorException(
        'Failed to send email. Please try again later.',
      );
    }
  }
}
