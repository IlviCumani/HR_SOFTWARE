import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './eventsDTO/events.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Events } from './schema/events.schema';
import { Model } from 'mongoose';
import { UpdateEventDto } from './eventsDTO/updateEvents.dto';
import { Employee } from 'src/employee/schema/employe.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Events.name) private eventsModel: Model<Events>,
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Events> {
    try {
      const { creatorId, invitees, ...eventData } = createEventDto;
      const user = await this.employeeModel.findById(creatorId);

      if (!user) {
        throw new Error('User not found');
      }

      const sanitizedInvitees = invitees && invitees.length > 0 ? invitees : [];

      const createdEvent = new this.eventsModel({
        ...eventData,
        creator: user._id,
        invitees: sanitizedInvitees,
      });

      return createdEvent.save();
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Error creating event: ' + error.message);
    }
  }

  async findAll(): Promise<Events[]> {
    return this.eventsModel.find({ isDeleted: false }).exec();
  }

  async findById(id: string): Promise<Events> {
    return this.eventsModel.findById(id).exec();
  }

  async findByCreatorId(creatorId: string): Promise<Events[]> {
    return this.eventsModel.find({ creator: creatorId }).exec();
  }

  async findByInviteeId(inviteesId: string): Promise<Events[]> {
    return this.eventsModel.find({ invitees: inviteesId }).exec();
  }

  async softDeleteEventById(id: string): Promise<Event> {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    return this.eventsModel.findByIdAndUpdate(
      id,
      { isDeleted: true, deleteDate: currentDate },
      { new: true },
    );
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Events> {
    return this.eventsModel
      .findByIdAndUpdate(id, updateEventDto, { new: true })
      .exec();
  }
}
