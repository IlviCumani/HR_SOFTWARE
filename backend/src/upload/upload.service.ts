import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FirebaseService } from './firebaseUpload.service';
import { FileDocument } from './schema/files.schema';

@Injectable()
export class UploadService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async uploadFiles(files: Express.Multer.File[]): Promise<string[] | string> {
    const storage = this.firebaseService.getStorageInstance();
    const bucket = storage.bucket();

    const uploadPromises = files.map(async (file) => {
      const fileName = `${Date.now()}_${file.originalname}`;
      const fileUpload = bucket.file(fileName);
      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      const imageUrl = await new Promise<string>((resolve, reject) => {
        stream.on('error', (error) => {
          reject(error);
        });
        stream.on('finish', async () => {
          try {
            await fileUpload.makePublic(); // Make file public
            const url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            resolve(url);
          } catch (error) {
            reject(error);
          }
        });
        stream.end(file.buffer);
      });

      // await this.fileModel.create({ url: imageUrl });

      return imageUrl;
    });

    return Promise.all(uploadPromises);
  }

  async deleteFile(fileName: string): Promise<void> {
    const storage = this.firebaseService.getStorageInstance();
    const bucket = storage.bucket();
    const file = bucket.file(fileName);

    return new Promise((resolve, reject) => {
      file.delete((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async getAllFiles(): Promise<string[]> {
    const storage = this.firebaseService.getStorageInstance();
    const bucket = storage.bucket();

    const [files] = await bucket.getFiles();

    const fileUrls = files.map((file) => {
      return `https://storage.googleapis.com/${bucket.name}/${file.name}`;
    });

    return fileUrls;
  }
}
