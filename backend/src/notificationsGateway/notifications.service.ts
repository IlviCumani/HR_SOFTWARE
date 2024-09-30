import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateNotificationDto } from './dto/CreateNotificationDto';
import { Notifications, NotificationStatus } from './notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notifications.name)
    private  notificationModel: Model<Notifications>,
  ) {}

  async getNotifications(): Promise<Notifications[]> {
    const notifications = this.notificationModel.find().exec();
    return notifications;
  }

  async getNotificationsByUser(
    userId?: string,
    status?: NotificationStatus,
  ): Promise<Notifications[]> {
    let filter: any = {};

    if (userId) {
      filter = {
        $or: [{ userId: userId }, { userId: null }],
      };
    }

    if (status) {
      filter.status = status;
    }

    return this.notificationModel.find(filter).sort({ createdAt: -1 });
  }

  async createNotification(createNotificationDto: CreateNotificationDto) {
    const notification = new this.notificationModel(createNotificationDto);
    return notification.save();
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true },
    );
  }
}
