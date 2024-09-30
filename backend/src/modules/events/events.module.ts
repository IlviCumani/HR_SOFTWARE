import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Events } from './schema/events.schema';
import { EventsSchema } from './schema/events.schema';

import { Employee, EmployeeSchema } from 'src/employee/schema/employe.schema';
import { EmployeeModule } from 'src/employee/employe.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Events.name, schema: EventsSchema },
      {name: Employee.name, schema: EmployeeSchema},
    ]),
    EmployeeModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
