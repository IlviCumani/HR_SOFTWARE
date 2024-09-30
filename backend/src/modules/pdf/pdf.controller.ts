import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { PdfService } from './pdf.service';

@Controller('upload')
export class PdfController {
  constructor(private readonly fileUploadService: PdfService) {}

  @Post()
  @UseInterceptors(FileInterceptor('pdfFile'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No PDF file uploaded.');
    }
    return this.fileUploadService.processFile(file);
  }
}
