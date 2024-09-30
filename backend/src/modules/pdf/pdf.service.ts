import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';

@Injectable()
export class PdfService {
  async processFile(file: Express.Multer.File) {
    try {
      const formData = new FormData();
      formData.append('pdfFile', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      const response = await axios.post(process.env.PDF_PY_PROCESS, formData, {
        headers: formData.getHeaders(),
      });

      return response.data;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
