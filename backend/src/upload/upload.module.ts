import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FirebaseModule } from './firebaseUpload.module';
import { FileController } from './upload.controller';
import { FileSchema } from './schema/files.schema';
import { FileModule } from './file.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FirebaseService } from './firebaseUpload.service';

@Module({
  imports: [
    FirebaseModule,
    MongooseModule.forFeature([{ name: 'File', schema: FileSchema }]),
    FirebaseModule,
  ],
  controllers: [FileController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
