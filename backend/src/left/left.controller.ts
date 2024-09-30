import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import { LeftService } from './left.service';
import { PageSizes } from 'pdf-lib';
import { Left } from './schema/left.schema';

@Controller('left')
export class LeftController {
  constructor(private readonly leftService: LeftService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: Left[]; total: number; page: number; limit: number }> {
    const result = await this.leftService.findAll(page, limit);
    return { ...result, page, limit };
  }

  @Get(':id')
  async findId(@Param('id') id: string) {
    return this.leftService.getByID(id);
  }

  @Delete(':id')
  async deleteEmployee(@Param('id') id: string) {
    return this.leftService.deleteEmployee(id);
  }

  @Post('copy/:id')
  async copyEmployeeData(
    @Param('id') id: string,
    @Body('deletedAt') deletedAt: string,
  ) {
    return this.leftService.copyEmployeeData(id, deletedAt);
  }
}
