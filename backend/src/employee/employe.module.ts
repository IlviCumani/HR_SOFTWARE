import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Employee, EmployeeSchema } from './schema/employe.schema';
import { EmployeeController } from './employe.controller';
import { EmployeeService } from './employe.service';
import { UsersModule } from 'src/users/users.module';
import { NotificationsModule } from 'src/notificationsGateway/notification.module';
import { InventoryModule } from 'src/inventory/inventory.module';
import {
  Inventory,
  InventorySchema,
} from 'src/inventory/schemas/Inventory.schema';
import { MailModule } from 'src/modules/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Employee.name,
        schema: EmployeeSchema,
      },
      { name: Inventory.name, schema: InventorySchema },
    ]),
    UsersModule,
    NotificationsModule,
    MailModule,
    forwardRef(() => InventoryModule),
  ],
  providers: [EmployeeService],
  controllers: [EmployeeController],
  exports: [EmployeeService],
})
export class EmployeeModule {}
