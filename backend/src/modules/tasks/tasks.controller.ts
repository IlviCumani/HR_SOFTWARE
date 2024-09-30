import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './tasksDTO/tasks.dto';
import { Types } from 'mongoose';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get()
  findAllTasks() {
    return this.tasksService.findAllTasks();
  }

  @Get(':id')
  findTaskById(@Param('id') id: string) {
    return this.tasksService.findTaskById(id);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const result = await this.tasksService.softDeleteTaskById(id);
    if (!result) {
      throw new NotFoundException('Task not found');
    }

    return { message: 'Task deleted successfully' };
  }

  @Put(':id')
  editTask(@Param('id') id: string, @Body() updateTaskDto: CreateTaskDto) {
    return this.tasksService.editTask(id, updateTaskDto);
  }
}
