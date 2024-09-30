import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { AuthModule } from './auth/auth.module';
import { LoggingMiddleware } from './middlewares/logging.middleware';
import { SalaryModule } from './modules/salary/salary.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './modules/events/events.module';
import { RecruitmentsModule } from './recruitments/recruitments.module';
import { EmployeeModule } from './employee/employe.module';
import { LeftModule } from './left/left.module';
import { AssetsModule } from './assets/assets.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { MailModule } from './modules/mail/mail.module';
import { EventsModuleModale } from './events/eventsModale.module';
import { UploadModule } from './upload/upload.module';
import { FirebaseModule } from './upload/firebaseUpload.module';
import { UploadService } from './upload/upload.service';
import { TasksModule } from './modules/tasks/tasks.module';
import { DayoffModule } from './dayoff/dayoff.module';
import { InventoryModule } from './inventory/inventory.module';
import { GmailApiModule } from './modules/gmail-api/gmail-api.module';
import { PromotionModule } from './promotion/promotion.module';
import { NotificationsGatewayModule } from './notificationsGateway/notificationgateAway.module';
import { NotificationsModule } from './notificationsGateway/notification.module';
import { SchedulerModule } from './schedule/scheduler.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthorizationGuard } from './guards/authorization.guard';
import { AuthenticationGuard } from './guards/authentication.guard';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    MongooseModule.forRoot(process.env.DBURL),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    UsersModule,
    RecruitmentsModule,
    AuthModule,
    SalaryModule,
    EventsModule,
    MailModule,
    EmployeeModule,
    LeftModule,
    AssetsModule,
    EventsModuleModale,
    UploadModule,
    FirebaseModule,
    TasksModule,
    DayoffModule,
    InventoryModule,
    GmailApiModule,
    NotificationsModule,
    NotificationsGatewayModule,
    PromotionModule,
    SchedulerModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AppService,
    JwtService,
    UploadService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
    console.log('Middleware Applied');
  }
}
