import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateEventDto } from './eventsDTO/events.dto';
import { EventsService } from './events.service';
import { UpdateEventDto } from './eventsDTO/updateEvents.dto';
import { UserService } from 'src/users/users.service';
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto) {
    return await this.eventsService.create(createEventDto);
  }

  @Get()
  async findAllEvents() {
    return await this.eventsService.findAll();
  }

  @Get(':id')
  async findOneEvent(@Param('id') id: string) {
    return await this.eventsService.findById(id);
  }

  @Get('byCreator/:creatorId')
  async findEventsByCreatorId(@Param('creatorId') creatorId: string) {
    return await this.eventsService.findByCreatorId(creatorId);
  }

  @Get('invitee/:inviteesId')
  async findEventsByInviteeId(@Param('inviteesId') inviteesId: string) {
    return await this.eventsService.findByInviteeId(inviteesId);
  }

  @Delete(':id')
  async deleteEvent(@Param('id') id: string) {
    return await this.eventsService.softDeleteEventById(id);
  }

  @Put(':id')
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return await this.eventsService.update(id, updateEventDto);
  }
}
