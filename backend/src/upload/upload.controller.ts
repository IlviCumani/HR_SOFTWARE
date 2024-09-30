import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { InjectModel } from '@nestjs/mongoose/dist/common';
import { Model } from 'mongoose';
import { FileDocument } from './schema/files.schema';

@Controller('files')
export class FileController {
  constructor(
    private readonly fileService: UploadService,
    @InjectModel('File') private readonly fileModel: Model<FileDocument>,
  ) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const fileUrls = await this.fileService.uploadFiles(files);
    return { fileUrls };
  }

  @Get()
  async getUploadedFiles(): Promise<{ fileUrls: string[] }> {
    const files = await this.fileModel.find().exec();
    const fileUrls = files.map((file) => file.url);
    console.log(fileUrls, 'filesss');
    return { fileUrls };
  }

  @Delete('delete/:fileName')
  async deleteFile(@Param('fileName') fileName: string) {
    await this.fileService.deleteFile(fileName);
    return { message: 'File deleted successfully' };
  }

  @Get('list')
  async listFiles() {
    const fileUrls = await this.fileService.getAllFiles();
    return { files: fileUrls };
  }
}
