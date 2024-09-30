import { Module } from '@nestjs/common';
import { DayoffService } from './dayoff.service';
import { DayoffController } from './dayoff.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DayOff, DayOffSchema } from './schema/dayoff.schema';
import { EmployeeModule } from 'src/employee/employe.module';
import { UsersModule } from 'src/users/users.module';
import { NotificationsModule } from 'src/notificationsGateway/notification.module';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DayOff.name, schema: DayOffSchema },
      { name: User.name, schema: UserSchema },
    ]),
    UsersModule,
    EmployeeModule,
    NotificationsModule,
  ],
  providers: [DayoffService],
  controllers: [DayoffController],
})
export class DayoffModule {}
