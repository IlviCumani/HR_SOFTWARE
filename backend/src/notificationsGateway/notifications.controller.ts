import { CreateNotificationDto } from 'src/notificationsGateway/dto/CreateNotificationDto';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notifications, NotificationStatus } from './notification.schema';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  @Get()
  getNotifications(
    @Query('userId') userId?: string,
    @Query('status') status?: NotificationStatus,
  ): Promise<Notifications[]> {
    return this.notificationsService.getNotificationsByUser(userId, status);
  }

  @Post()
  createNotification(@Body() createdNotifications: CreateNotificationDto) {
    return this.notificationsService.createNotification(createdNotifications);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
