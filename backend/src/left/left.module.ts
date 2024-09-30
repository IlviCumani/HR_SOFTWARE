import { Module } from '@nestjs/common';
import { LeftController } from './left.controller';
import { EmployeeModule } from 'src/employee/employe.module';
import { LeftService } from './left.service';
import { Left, LeftSchema } from './schema/left.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Left.name,
        schema: LeftSchema,
      },
    ]),
    EmployeeModule,
  ],
  controllers: [LeftController],
  providers: [LeftService],
})
export class LeftModule {}
