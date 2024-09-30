import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { Inventory, InventorySchema } from './schemas/Inventory.schema';
import { AssetsModule } from 'src/assets/assets.module';
import { EmployeeModule } from 'src/employee/employe.module';
import { Employee, EmployeeSchema } from 'src/employee/schema/employe.schema';
import { NotificationsGatewayModule } from 'src/notificationsGateway/notificationgateAway.module';
import { NotificationsModule } from 'src/notificationsGateway/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inventory.name, schema: InventorySchema },
      { name: Employee.name, schema: EmployeeSchema },
    ]),
    AssetsModule,
    NotificationsGatewayModule,
    NotificationsModule,
    forwardRef(() => EmployeeModule),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
