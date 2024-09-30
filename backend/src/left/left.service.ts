import { Injectable, Inject } from '@nestjs/common';
import mongoose, { Model, Types } from 'mongoose';
import { EmployeeService } from 'src/employee/employe.service';
import { Employee } from 'src/employee/schema/employe.schema';
import { Left } from './schema/left.schema';
import { InjectModel } from '@nestjs/mongoose';
import { LeftDto } from './dto/left.dto';

@Injectable()
export class LeftService {
  constructor(
    @Inject(EmployeeService)
    private readonly employeeService: EmployeeService,
    @InjectModel(Left.name)
    private leftModel: mongoose.Model<Left>,
  ) {}

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ data: Left[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.leftModel.find().skip(skip).limit(limit).exec(),
      this.leftModel.countDocuments(),
    ]);
    return { data, total };
  }

  getByID(id: string): Promise<Employee | null> {
    return this.employeeService.findOne(id);
  }

  deleteEmployee(id: string): Promise<Employee | null> {
    return this.employeeService.delete(id);
  }

  async copyEmployeeData(id: string, deletedAt: string): Promise<Left> {
    const employeeData = await this.employeeService.findOne(id);

    if (!employeeData) {
      throw new Error('Employee not found');
    }

    const leftData = new this.leftModel({
      ...employeeData.toObject(),
      deletedAt: deletedAt,
    });

    await leftData.save();

    await this.employeeService.delete(id);

    return leftData;
  }
}
