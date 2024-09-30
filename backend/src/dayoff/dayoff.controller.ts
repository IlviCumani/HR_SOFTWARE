import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  HttpException,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import { DayoffService } from './dayoff.service';
import { CreateDayOffDto } from './dto/CreateDayOff.dto';
import mongoose from 'mongoose';
import { UpdateDayOffDto } from './dto/UpdateDayOff.dto';
import { DayOff } from './schema/dayoff.schema';

@Controller('dayoff')
export class DayoffController {
  constructor(private readonly dayoffService: DayoffService) {}

  @Post()
  create(@Body() createDayOffDto: CreateDayOffDto) {
    return this.dayoffService.createDayOff(createDayOffDto);
  }

  @Get('accepted/:employeeId')
  accepted(@Param('employeeId') employeeId: string): Promise<DayOff[]> {
    return this.dayoffService.accepted(employeeId);
  }

  @Get('/:employeeId')
  findAll(@Param('employeeId') employeeId: string): Promise<DayOff[]> {
    return this.dayoffService.findAll(employeeId);
  }

  @Get('remainingDays/:employeeId')
  async getRemainingDays(@Param('employeeId') employeeId: string) {

    if (!employeeId) {
      throw new UnauthorizedException('Employee not found');
    }
      const remainingDays =
        await this.dayoffService.getRemainingDays(employeeId);
      return { employeeId, remainingDays };
  
  }

  @Delete(':id/soft-delete')
  async deleteByName(@Param('id') id: string) {
    const result = await this.dayoffService.softDeleteDayOffById(id);
    return result;
  }

  @Patch(':id/approve')
  async approve(@Param('id') id: string) {
    const result = await this.dayoffService.approved(id);
    if (!result) throw new HttpException('Day off not found', 404);
    return result;
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateDayOffDto: UpdateDayOffDto,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 404);
    return this.dayoffService.updateDayOff(id, updateDayOffDto);
  }
}
