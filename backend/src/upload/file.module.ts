import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadService } from './upload.service';
import { FileSchema } from './schema/files.schema';
import { FileController } from './upload.controller';
import { FirebaseModule } from './firebaseUpload.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'File', schema: FileSchema }]),
  ],
  controllers: [FileController],
  providers: [ UploadService ],
  exports: [FileModule]
})
export class FileModule {}
