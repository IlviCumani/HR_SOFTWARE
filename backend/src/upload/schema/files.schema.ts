import { SchemaFactory } from '@nestjs/mongoose';
import { Schema, Document, model } from 'mongoose';

export class FileDocument extends Document {
  url: string;
  createdAt: Date;
}


export const FileSchema = SchemaFactory.createForClass(FileDocument);
