import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateEventDto } from './dto/createEvent.dto';
import { Event } from './schema/events.schema';
import { CreateNotificationDto } from 'src/notificationsGateway/dto/CreateNotificationDto';
import { NotificationsService } from 'src/notificationsGateway/notifications.service';
import { NotificationStatus } from 'src/notificationsGateway/notification.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    private readonly notificationService: NotificationsService,
  ) {}

  async createEvent(createEventDto: CreateEventDto): Promise<Event> {

    const event = await this.eventModel.create(createEventDto);

    const createNotificationDto: CreateNotificationDto = {
      message: `A new event has been created: ${event.eventName}`,
      isRead: false,
      userId: null,
      path: `/company/events`,
      status: NotificationStatus.NOTIFICATION,
    };

    try {
      const notification = await this.notificationService.createNotification(
        createNotificationDto,
      );
      console.log('Notification created:', notification);
    } catch (error) {
      console.error('Error creating notification:', error);
    }

    return event;
  }

  async assignEmployee(eventID: string, joinEmployee: string): Promise<any> {
    await this.eventModel.findByIdAndUpdate(
      eventID,
      {
        $push: { eventParticipants: joinEmployee },
      },
      { new: true },
    );

    const events = await this.eventModel.aggregate([
      {
        $match: { _id: new Types.ObjectId(eventID), isDeleted: false },
      },
      {
        $addFields: {
          eventParticipants: {
            $map: {
              input: '$eventParticipants',
              as: 'participantId',
              in: {
                $convert: {
                  input: '$$participantId',
                  to: 'objectId',
                  onError: '$$participantId',
                  onNull: '$$participantId',
                },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'employees',
          localField: 'eventParticipants',
          foreignField: '_id',
          as: 'eventParticipants',
        },
      },
      {
        $addFields: {
          eventParticipants: {
            $map: {
              input: '$eventParticipants',
              as: 'participant',
              in: {
                _id: '$$participant._id',
                fullName: '$$participant.fullName',
                profilePhoto: '$$participant.profilePhoto',
              },
            },
          },
        },
      },

      {
        $project: {
          _id: 1,
          eventName: 1,
          eventDescription: 1,
          eventDate: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$eventDate',
            },
          },
          eventEndDate: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$eventEndDate',
            },
          },
          eventStartTime: 1,
          eventEndTime: 1,
          location: 1,
          eventParticipants: 1,
          images: 1,
          isDeleted: 1,
          __v: 1,
        },
      },
    ]);

    return events[0];
  }

  async joinEvent(
    eventID: string,
    joinEmployee: string,
  ): Promise<Event> {
    const joinEmploy = this.eventModel.findByIdAndUpdate(eventID, {
      $push: { eventParticipants: joinEmployee },
    });
    const ok = await this.eventModel.findById(eventID).populate('joinEmploy');
    return ok;
  }

  async unassignAllEmployeesFromAllEvents() {
    return await this.eventModel
      .updateMany(
        {},
        {
          $set: { eventParticipants: [] },
        },
      )
      .exec();
  }

  async findAll(): Promise<Event[]> {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const events = await this.eventModel.aggregate([
      {
        $match: { isDeleted: false, eventDate: { $gte: currentDate } },
      },

      {
        $addFields: {
          eventParticipants: {
            $map: {
              input: '$eventParticipants',
              as: 'participantId',
              in: {
                $convert: {
                  input: '$$participantId',
                  to: 'objectId',
                  onError: '$$participantId',
                  onNull: '$$participantId',
                },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'employees',
          localField: 'eventParticipants',
          foreignField: '_id',
          as: 'eventParticipants',
        },
      },
      {
        $addFields: {
          eventParticipants: {
            $map: {
              input: '$eventParticipants',
              as: 'participant',
              in: {
                _id: '$$participant._id',
                fullName: '$$participant.fullName',
                profilePhoto: '$$participant.profilePhoto',
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          eventName: 1,
          eventDescription: 1,
          eventDate: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$eventDate',
            },
          },
          eventEndDate: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$eventEndDate',
            },
          },
          eventStartTime: 1,
          eventEndTime: 1,
          location: 1,
          eventParticipants: 1,
          images: 1,
          isDeleted: 1,
          __v: 1,
        },
      },
    ]);

    return events;
  }

  async softDeleteEventById(id: string): Promise<Event> {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    return this.eventModel
      .findByIdAndUpdate(
        id,
        { isDeleted: true, deleteDate: currentDate },
        { new: true },
      )
      .exec();
  }
}
