import { RecruitmentService } from './recruitments.service';
import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  HttpException,
  Query,
  BadRequestException,
  InternalServerErrorException,
  Patch,
} from '@nestjs/common';
import { CreateRecruitmentDto } from './dto/Recruitments.dto';
import mongoose, { Types } from 'mongoose';
import { UpdateRecruitmentDto } from './dto/UpdateRecruitments.dto';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/users/schemas/user.schema';

@Roles([Role.CEO, Role.HR])
@Controller('recruitments')
export class RecruitmentsController {
  constructor(private recruitmentService: RecruitmentService) {}

  @Post()
  async createRecruitment(@Body() createRecruitmentDto: CreateRecruitmentDto) {
    try {
      const { submittedDate, ...rest } = createRecruitmentDto;
      const formattedDate = new Date(submittedDate);

      if (isNaN(formattedDate.getTime())) {
        throw new BadRequestException('Invalid date format');
      }

      const result = await this.recruitmentService.createRecruitment({
        ...rest,
        submittedDate: formattedDate,
      });

      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error(`Error creating recruitment: ${error.message}`, error);

      throw new InternalServerErrorException(
        'An error occurred while creating recruitment',
      );
    }
  }

  @Get()
  async getRecruitments(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('filters') filters: any,
  ) {
    try {
      if (!filters) {
        filters = {};
      } else {
        for (const key in filters) {
          if (filters[key]) {
            filters[key] = { $regex: new RegExp(filters[key], 'i') };
          }
        }
      }
      const pageNo = parseInt(page.toString());
      const limitNo = parseInt(limit.toString());
      const data =
        await this.recruitmentService.getRecruitmentWithInterviewerDetails(
          pageNo,
          limitNo,
          filters,
        );
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get('chart')
  async getChartData() {
    try {
      return await this.recruitmentService.getApplicationsPerMonth();
    } catch (error) {
      throw new Error(`Error getting chart data : ${error}`);
    }
  }

  @Patch(':id')
  async updateRecruitment(
    @Param('id') id: Types.ObjectId,
    @Body('recruitment') updateRecruitmentDto: UpdateRecruitmentDto,
    @Body('creatorID') creatorID: string,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Id Invalid', 400);

    const updatedRecruitment = await this.recruitmentService.updateRecruitment(
      id,
      updateRecruitmentDto,
      creatorID,
    );
    if (!updatedRecruitment)
      throw new HttpException('Recruitment not Found', 404);
    return updatedRecruitment;
  }

  @Delete(':id')
  async deleteRecruitment(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Id Invalid', 400);
    const deletedRecruitment =
      await this.recruitmentService.softDeleteRecruitById(id);
    if (!deletedRecruitment)
      throw new HttpException('Recruitment not Found', 404);
    return;
  }
}
