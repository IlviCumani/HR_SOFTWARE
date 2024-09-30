import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { ServiceAccount } from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private readonly storage: admin.storage.Storage;

  constructor(@Inject(ConfigService) private configService: ConfigService) {
    const adminConfig: ServiceAccount = {
      projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
      privateKey: this.configService
        .get<string>('FIREBASE_PRIVATE_KEY')
        .replace(/\\n/g, '\n'),
      clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
    };

    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(adminConfig),
        storageBucket: `${this.configService.get<string>('FIREBASE_STORAGE_BACKET')}`,
      });
    }

    this.storage = admin.storage();
  }

  getStorageInstance(): admin.storage.Storage {
    return this.storage;
  }
}
