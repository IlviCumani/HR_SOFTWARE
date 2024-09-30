import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { SentEmailDTO } from './dto/sendEmail.dto';
import { MailService } from './mail.service';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/users/schemas/user.schema';
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}
  @Roles([Role.HR])
  @Post()
  sendEmail(@Body() dto: SentEmailDTO) {
    try {
      if (dto.template === 'interview-template') {
        return this.mailService.sendInterviewEmail(dto);
      } else {
        return this.mailService.sendEmail(dto);
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
