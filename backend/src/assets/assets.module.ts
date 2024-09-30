import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Asset, AssetSchema } from 'src/assets/schemas/Asset.schema';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { UsersModule } from 'src/users/users.module';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: Asset.name, schema: AssetSchema }]),
   UsersModule
  ],
  providers: [AssetsService],
  controllers: [AssetsController],
  exports: [AssetsService],
})
export class AssetsModule {}
