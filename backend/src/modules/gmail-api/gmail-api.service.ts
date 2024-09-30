import { google } from 'googleapis';
import { RecruitmentService } from 'src/recruitments/recruitments.service';
import { CreateRecruitmentDto } from 'src/recruitments/dto/Recruitments.dto';
import { RecruitmentStage } from 'src/recruitments/schemas/recruitment.schema';
import { Injectable } from '@nestjs/common';
import { UploadService } from 'src/upload/upload.service';
import * as mime from 'mime-types';
import * as path from 'path';
import { Types } from 'mongoose';
import { UpdateRecruitmentDto } from 'src/recruitments/dto/UpdateRecruitments.dto';

@Injectable()
export class GmailApiService {
  private readonly oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  constructor(
    private recruitmentService: RecruitmentService,
    private uploadService: UploadService,
  ) {}

  private async getGmailService(refresh_token: string) {
    this.oauth2Client.setCredentials({
      refresh_token: refresh_token,
    });
    const { token } = await this.oauth2Client.getAccessToken();
    console.log(refresh_token);
    this.oauth2Client.setCredentials({
      access_token: token,
      refresh_token: refresh_token,
      scope: process.env.GOOGLE_CLIENT_SCOPE,
      token_type: 'Bearer',
    });

    return google.gmail({ version: 'v1', auth: this.oauth2Client });
  }

  private getBufferFromBase64Url(base64url: string): Buffer {
    const base64 = base64url
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(base64url.length + ((4 - (base64url.length % 4)) % 4), '=');

    return Buffer.from(base64, 'base64');
  }

  private createMulterFile(
    buffer: Buffer,
    filename: string,
    mimeType: string,
  ): Express.Multer.File {
    const sanitizedFilename = filename.replace(/\s+/g, '_');

    return {
      fieldname: 'file',
      originalname: sanitizedFilename,
      encoding: '7bit',
      mimetype: mimeType,
      buffer,
      size: buffer.length,
      stream: null,
      destination: '',
      filename: path.basename(sanitizedFilename),
      path: '',
    } as Express.Multer.File;
  }

  public async fetchAndSaveEmails(
    subject: string | null = null,
    startDate: string | null = null,
    refresh_token: string,
  ): Promise<UpdateRecruitmentDto[]> {
    try {
      const gmail = await this.getGmailService(refresh_token);

      let query = '';
      if (subject) {
        query += `subject:${subject} `;
      }
      if (startDate) {
        query += `after:${startDate}`;
      }

      const response = await gmail.users.messages.list({
        userId: 'me',
        q: query.trim(),
        labelIds: ['INBOX'],
      });

      const messages = response.data.messages || [];
      const recruitments: UpdateRecruitmentDto[] = [];

      for (const message of messages) {
        const msg = await gmail.users.messages.get({
          userId: 'me',
          id: message.id!,
        });

        const emailData = msg.data;

        const fromHeader = emailData.payload?.headers?.find(
          (h) => h.name === 'From',
        )?.value;
        const [name, email] =
          fromHeader?.match(/(.*) <(.*)>/)?.slice(1, 3) || [];
        const [surname, firstName] = name?.split(' ').reverse() || [];

        const submittedDate = new Date(
          emailData.payload?.headers?.find((h) => h.name === 'Date')?.value ||
            new Date(),
        );

        const createRecruitmentDto: CreateRecruitmentDto = {
          name: firstName,
          surname: surname,
          email: email,
          position: 'Unknown',
          stage: RecruitmentStage.Applied,
          submittedDate: submittedDate,
          cv: '',
          phoneNumber: null,
          isDeleted: false,
          deleteDate: null,
        };

        const recruitmentWithFile = {
          ...createRecruitmentDto,
        };

        const applicant =
          await this.recruitmentService.createRecruitment(createRecruitmentDto);

        const parts = emailData.payload?.parts || [];
        for (const part of parts) {
          if (part.filename && part.body?.attachmentId) {
            const attachment = await gmail.users.messages.attachments.get({
              userId: 'me',
              messageId: message.id!,
              id: part.body.attachmentId,
            });

            const attachmentData = attachment.data.data;
            const dangerousExtensions = ['exe', 'bin', 'bat', 'cmd'];
            const fileExtension = part.filename.split('.').pop()?.toLowerCase();

            if (dangerousExtensions.includes(fileExtension!)) {
              console.warn(`Dangerous file detected: ${part.filename}`);
            } else {
              const cvExtensions = ['pdf', 'doc', 'docx'];
              if (cvExtensions.includes(fileExtension!)) {
                const buffer = this.getBufferFromBase64Url(attachmentData);
                const file = this.createMulterFile(
                  buffer,
                  part.filename,
                  mime.lookup(fileExtension) || 'application/octet-stream',
                );

                if (file) {
                  const fileList = [file];
                  const fileUrl =
                    await this.uploadService.uploadFiles(fileList);
                  recruitmentWithFile.cv = fileUrl[0];
                  const updateRecruitmentDto: UpdateRecruitmentDto = {
                    name: firstName,
                    surname: surname,
                    email: email,
                    position: 'Unknown',
                    stage: RecruitmentStage.Applied,
                    submittedDate: submittedDate,
                    cv: recruitmentWithFile.cv || '',
                    phoneNumber: null,
                    isDeleted: false,
                    deleteDate: null,
                    rejectReason: '',
                  };

                  await this.recruitmentService.updateRecruitment(
                    new Types.ObjectId(applicant._id.toString()),
                    updateRecruitmentDto,
                    '',
                  );
                }

                break;
              }
            }
          }
        }

        recruitments.push(recruitmentWithFile as UpdateRecruitmentDto);
      }
      return recruitments;
    } catch (error) {
      console.error('Error fetching and saving emails:', error);
      throw error;
    }
  }
}
