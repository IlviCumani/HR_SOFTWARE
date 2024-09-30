import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Types, Model } from 'mongoose';
import { Salary } from '../schema/salary.schema';
import { SalaryDTO } from '../dto/salaryDTO/salary.dto';
import { UpdateSalaryDTO } from '../dto/salaryDTO/updateSalary.dto';
import { PaginatedDTO } from '../../../paginationDTO/paginated.dto';
import { ExportSalaryDTO } from '../dto/salaryDTO/export-salary.dto';
import { EmployeeService } from 'src/employee/employe.service';
import { Employee } from 'src/employee/schema/employe.schema';
import { Role } from 'src/users/schemas/user.schema';

@Injectable()
export class SalaryService {
  constructor(
    @InjectModel(Salary.name) private salaryModel: Model<Salary>,
    private readonly employeeService: EmployeeService,
  ) {}

  async create(createSalaryDto: SalaryDTO): Promise<Salary> {
    try {
      const createdSalary = new this.salaryModel({
        ...createSalaryDto,
        employeeID: new Types.ObjectId(createSalaryDto.employeeID),
      });
      return await createdSalary.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          `A salary record with the same date taken and employee already exists.`,
        );
      }
      if (error instanceof mongoose.Error.ValidationError) {
        throw new ConflictException(
          `A salary record with the same date taken and employee already exists.`,
        );
      }
      throw new InternalServerErrorException('Failed to create salary');
    }
  }

  async find(id: string): Promise<Salary> {
    try {
      const salary = await this.salaryModel.aggregate([
        { $match: { _id: new Types.ObjectId(id), isDeleted: false } },
        {
          $lookup: {
            from: 'employees',
            localField: 'employeeID',
            foreignField: '_id',
            as: 'employeeDetails',
          },
        },
        { $unwind: '$employeeDetails' },
        {
          $project: {
            employeeID: 1,
            dateTaken: 1,
            netSalary: 1,
            workDays: 1,
            bonuses: 1,
            socialSecurityContributions: 1,
            healthInsurance: 1,
            grossSalary: 1,
            total: 1,
            paid: 1,
            healthInsuranceCompany: 1,
            socialInsuranceCompany: 1,
            'employeeDetails.name': 1,
            'employeeDetails.surname': 1,
          },
        },
      ]);

      if (!salary || !salary.length) {
        throw new NotFoundException('Salary not found');
      }

      return salary[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to find salary');
    }
  }

  async deleteSalary(userId: string): Promise<Salary> {
    try {
      return await this.salaryModel.findOneAndDelete({ employeeID: userId });
    } catch (error) {
      throw new Error('Failed to delete salary');
    }
  }

  async softDeleteSalaryById(id: string): Promise<Event> {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    return this.salaryModel.findByIdAndUpdate(
      id,
      { isDeleted: true, deleteDate: currentDate },
      { new: true },
    );
  }

  async updateSalary(
    salaryID: Types.ObjectId,
    newSalary: UpdateSalaryDTO,
  ): Promise<Salary> {
    try {
      const { employeeID, ...otherFields } = newSalary;

      // Update the salary document with the new fields
      const updatedSalary = await this.salaryModel.findByIdAndUpdate(
        salaryID,
        { $set: otherFields },
        { new: true },
      );

      if (!updatedSalary) {
        throw new NotFoundException('Salary not found');
      }

      const enrichedSalary = await this.find(updatedSalary._id.toString());

      return enrichedSalary;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update salary');
    }
  }

  async getPrevSalaryDataPerEmployee(
    employeeID: Types.ObjectId,
  ): Promise<Salary | null> {
    try {
      const { start, end } = this.getPreviousMonthDateRange();
      return await this.salaryModel.findOne({
        employeeID: employeeID,
        dateTaken: { $gte: start, $lte: end },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Not found: ${error.message}`);
    }
  }

  async getSalariesWithEmployeeInfo(
    page: number,
    limit: number,
    employeeID: string,
    role: string,
    filter: {
      startDate?: Date;
      endDate?: Date;
      employeeID?: string;
      name?: string;
    },
  ): Promise<PaginatedDTO<ExportSalaryDTO[]>> {
    const matchStage: any = {};

    if (filter.startDate) {
      matchStage.dateTaken = { $gte: new Date(filter.startDate) };
    }

    if (filter.endDate) {
      if (!matchStage.dateTaken) {
        matchStage.dateTaken = {};
      }
      matchStage.dateTaken.$lte = new Date(filter.endDate);
    }

    if (role === Role.Employee) {
      matchStage.employeeID = new Types.ObjectId(employeeID);
    } else if (filter.employeeID) {
      matchStage.employeeID = new Types.ObjectId(filter.employeeID);
    }

    const skip = (page - 1) * limit;
    const data = await this.salaryModel
      .aggregate([
        { $match: matchStage },
        {
          $lookup: {
            from: 'employees',
            localField: 'employeeID',
            foreignField: '_id',
            as: 'employeeDetails',
          },
        },
        { $unwind: '$employeeDetails' },
        {
          $match: filter.name
            ? { 'employeeDetails.name': new RegExp(filter.name, 'i') }
            : {},
        },
        {
          $project: {
            employeeID: 1,
            dateTaken: 1,
            netSalary: 1,
            workDays: 1,
            bonuses: 1,
            socialSecurityContributions: 1,
            healthInsurance: 1,
            grossSalary: 1,
            total: 1,
            paid: 1,
            healthInsuranceCompany: 1,
            socialInsuranceCompany: 1,
            'employeeDetails.name': 1,
            'employeeDetails.surname': 1,
          },
        },
        { $sort: { dateTaken: -1 } },
      ])
      .skip(skip)
      .limit(limit);

    const itemCount = await this.salaryModel.countDocuments(matchStage);

    return new PaginatedDTO<ExportSalaryDTO[]>(data, page, limit, itemCount);
  }

  async compensateEmployees(): Promise<void> {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      await this.salaryModel.updateMany(
        {
          dateTaken: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
        },
        {
          $set: { paid: true },
        },
      );
    } catch (error) {
      console.log('error:', error);
      throw new Error('Failed to compensate employees.');
    }
  }

  async createSalariesPerMonth(): Promise<void> {
    try {
      const employees: Employee[] = await this.employeeService.findAll();

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      for (const employee of employees) {
        const existingSalary = await this.salaryModel.findOne({
          employeeID: employee._id,
          dateTaken: { $gte: startOfMonth, $lte: endOfMonth },
        });

        if (existingSalary) {
          console.log(
            `Salary for employee ${employee._id} already exists for this month.`,
          );
          continue;
        }

        const prevSalaryData = await this.getPrevSalaryDataPerEmployee(
          employee._id as Types.ObjectId,
        );

        const newSalary: SalaryDTO = prevSalaryData
          ? {
              employeeID: employee._id as Types.ObjectId,
              dateTaken: new Date(),
              netSalary: prevSalaryData.netSalary,
              workDays: prevSalaryData.workDays,
              bonuses: prevSalaryData.bonuses || [],
              socialSecurityContributions:
                prevSalaryData.socialSecurityContributions,
              healthInsurance: prevSalaryData.healthInsurance,
              grossSalary: prevSalaryData.grossSalary,
              total: prevSalaryData.total,
              paid: false,
              isDeleted: false,
              incomeTax: prevSalaryData.incomeTax,
              healthInsuranceCompany: prevSalaryData.healthInsuranceCompany,
              socialInsuranceCompany: prevSalaryData.socialInsuranceCompany,
            }
          : {
              employeeID: employee._id as Types.ObjectId,
              dateTaken: new Date(),
              netSalary: 0,
              workDays: 22,
              bonuses: [],
              socialSecurityContributions: 0,
              healthInsurance: 0,
              grossSalary: 0,
              total: 0,
              paid: false,
              isDeleted: false,
              incomeTax: 0,
              healthInsuranceCompany: 0,
              socialInsuranceCompany: 0,
            };

        await this.create(newSalary);
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to create salaries');
    }
  }

  private getPreviousMonthDateRange(): { start: Date; end: Date } {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const startMonth = month === 0 ? 11 : month - 1;
    const startYear = month === 0 ? year - 1 : year;

    const startDate = new Date(startYear, startMonth, 1);
    const endDate = new Date(startYear, month, 0);

    return { start: startDate, end: endDate };
  }

  async getTotalBonusesPerMonth(id: Types.ObjectId) {
    const year = new Date().getFullYear();
    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${year + 1}-01-01T00:00:00.000Z`);

    const dataset = await this.salaryModel.aggregate([
      {
        $match: {
          employeeID: id,
          dateTaken: {
            $gte: startOfYear,
            $lt: endOfYear,
          },
        },
      },
      {
        $group: {
          _id: { $month: '$dateTaken' },
          totalBonuses: {
            $sum: {
              $reduce: {
                input: '$bonuses',
                initialValue: 0,
                in: { $add: ['$$value', '$$this.amount'] },
              },
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const allMonths = Array.from({ length: 12 }, (_, i) => ({
      month: i,
      totalBonuses: 0,
    }));

    const result = allMonths.map((monthObj) => {
      const existing = dataset.find((item) => item._id === monthObj.month);
      return {
        label: monthObj.month,
        value: existing ? existing.totalBonuses : 0,
      };
    });

    return result;
  }
}
