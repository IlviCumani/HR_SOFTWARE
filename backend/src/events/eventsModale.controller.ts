import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  HttpException,
  Param,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/createEvent.dto';
import { EventsService } from './eventsModale.service';
import mongoose, { Query, Types } from 'mongoose';
import { AssignEmployeeDto } from './dto/assignEmployee.dto';

@Controller('event')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.createEvent(createEventDto);
  }

  @Get()
  async getEvent() {
    return this.eventsService.findAll();
  }

  @Patch('assign/:id')
  async assignEmployee(
    @Param('id') id: string,
    @Body() assignEmployeeDto: AssignEmployeeDto,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid event ID');
    }

    if (!Types.ObjectId.isValid(assignEmployeeDto.joinEmployee)) {
      throw new BadRequestException('Invalid joinEmployee ID');
    }

    return this.eventsService.assignEmployee(
      id,
      assignEmployeeDto.joinEmployee,
    );
  }

  @Patch('populate/:id')
  async populateEmployee(
    @Param('id') id: string,
    @Body() assignEmployeeDto: AssignEmployeeDto,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid event ID');
    }

    if (!Types.ObjectId.isValid(assignEmployeeDto.joinEmployee)) {
      throw new BadRequestException('Invalid joinEmployee ID');
    }

    return this.eventsService.joinEvent(id, assignEmployeeDto.joinEmployee);
  }

  @Delete('deleteAll')
  async unassignAllEmployeesFromAllEvents() {
    return this.eventsService.unassignAllEmployeesFromAllEvents();
  }

  @Delete(':id')
  async softDeleteById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 404);
    return this.eventsService.softDeleteEventById(id);
  }
}
