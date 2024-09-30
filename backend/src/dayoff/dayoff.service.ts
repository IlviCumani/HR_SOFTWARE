import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, ObjectId } from 'mongoose';
import { CreateDayOffDto } from './dto/CreateDayOff.dto';
import { DayOff } from './schema/dayoff.schema';
import { EmployeeService } from 'src/employee/employe.service';
import { UpdateDayOffDto } from './dto/UpdateDayOff.dto';
import { CreateNotificationDto } from 'src/notificationsGateway/dto/CreateNotificationDto';
import { UserService } from 'src/users/users.service';
import { NotificationsService } from 'src/notificationsGateway/notifications.service';
import { Role, User } from 'src/users/schemas/user.schema';
import { NotificationStatus } from 'src/notificationsGateway/notification.schema';
import { userInfo } from 'os';

@Injectable()
export class DayoffService {
  constructor(
    @InjectModel(DayOff.name) private dayoffModel: Model<DayOff>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly employeeService: EmployeeService,
    private readonly notificationService: NotificationsService,
  ) {}

  async createDayOff(createDayOff: CreateDayOffDto) {
    const employee = await this.employeeService.findOne(
      createDayOff.employeeId,
    );
    if (!employee) {
      throw new HttpException("The ID of the employee doesn't exist", 404);
    }

    const employeeName = await this.employeeService.findNameById(
      createDayOff.employeeId,
    );
    if (!employeeName) {
      throw new HttpException("The name of the employee doesn't exist", 404);
    }

    let totalDays: number;
    if (!createDayOff.EndTime) {
      createDayOff.EndTime = createDayOff.StartTime;
      createDayOff.totalDays = 1;
      totalDays = createDayOff.totalDays;
    } else {
      totalDays = this.calculateTotalDays(
        createDayOff.StartTime,
        createDayOff.EndTime,
      );
    }

    let isApproved = false;
    let approvedDate: Date | null = null;

    if (employee.role.toLowerCase() === Role.CEO) {
      isApproved = true;
      approvedDate = new Date();
    }

    const createdDayoff = new this.dayoffModel({
      ...createDayOff,
      EmployeeName: employeeName,
      totalDays,
      isApproved,
      approvedDate,
    });

    const hrUsers = await this.userModel.find({ role: Role.HR }).exec();

    hrUsers.forEach(async (hrUser) => {
      const createNotification: CreateNotificationDto = {
        message: `A new day off request has been created by ${employeeName}.`,
        isRead: false,
        userId: hrUser.employID,
        path: '/dayoff/requestedLeave',
      };
      console.log(createNotification, 'createdNotification');
      await this.notificationService.createNotification(createNotification);
    });

    return createdDayoff.save();
  }

  async accepted(userId: string): Promise<DayOff[]> {
    const userObjectId = new Types.ObjectId(userId);
    const user = await this.userModel.findById(userObjectId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.role === Role.HR) {
      const approvedDayOffs = await this.dayoffModel
        .find({ isApproved: true })
        .exec();
      return approvedDayOffs;
    } else if (user.role === Role.Employee || user.role === Role.CEO) {
      const approvedDayOffs = await this.dayoffModel
        .find({
          isApproved: true,
          employeeId: user.employID.toString(),
        })
        .exec();
      return approvedDayOffs;
    } else {
      throw new UnauthorizedException(
        'User does not have permission to view day approved offs',
      );
    }
  }

  async findAll(userId: string): Promise<DayOff[]> {
    const userObjectId = new Types.ObjectId(userId);
    const user = await this.userModel.findById(userObjectId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.role === Role.HR) {
      const dayOffs = await this.dayoffModel
        .find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .populate('EmployeeName', 'name')
        .exec();
      return dayOffs;
    } else if (user.role === Role.Employee || user.role === Role.CEO) {
      const dayOffs = await this.dayoffModel
        .find({
          isDeleted: false,
          employeeId: user.employID.toString(),
        })
        .sort({ createdAt: -1 })
        .populate('EmployeeName', 'name')
        .exec();
      return dayOffs;
    } else {
      throw new UnauthorizedException(
        'User does not have permission to view day offs',
      );
    }
  }

  private calculateTotalDays(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    return differenceInDays;
  }

  async softDeleteDayOffById(id: string): Promise<DayOff> {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    return this.dayoffModel
      .findByIdAndUpdate(
        id,
        { isDeleted: true, deleteDate: currentDate },
        { new: true },
      )
      .exec();
  }

  async approved(id: string): Promise<DayOff> {
    
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const dayOffRequest = await this.dayoffModel.findById(id).exec();

    if (!dayOffRequest) {
      throw new Error('Day off request not found');
    }

    if (dayOffRequest.isApproved) {
      throw new Error('Day off request is already approved');
    }

    const isApproved = await this.dayoffModel
      .findByIdAndUpdate(
        id,
        { isApproved: true, approvedDate: currentDate },
        { new: true },
      )
      .exec();


    const createNotification: CreateNotificationDto = {
      message: `Your Day Off request has been approved`,
      isRead: false,
      userId: dayOffRequest.employeeId as unknown as Types.ObjectId,
      path: '/dayoff/requestedLeave',
      status: NotificationStatus.NOTIFICATION,
    };

    await this.notificationService.createNotification(createNotification);

    return isApproved;
  }

  async updateDayOff(
    id: string,
    updateDayOffDto: UpdateDayOffDto,
  ): Promise<DayOff> {
    return this.dayoffModel
      .findByIdAndUpdate(id, updateDayOffDto, { new: true })
      .exec();
  }

  async getRemainingDays(employeeId: string): Promise<number> {
    const approvedDayOffs = await this.dayoffModel
      .find({
        employeeId: employeeId,
        isApproved: true,
      })
      .exec();

    const totalApprovedDays = approvedDayOffs.reduce((acc, dayOff) => {
      return acc + dayOff.totalDays;
    }, 0);

    const totalAvailableDays = 25;

    const remainingDays = totalAvailableDays - totalApprovedDays;

    return remainingDays >= 0 ? remainingDays : 0;
  }
}
