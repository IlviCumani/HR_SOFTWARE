import { IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../schema/tasks.schema';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

    @IsNotEmpty()
    due_date: Date;



  @IsNotEmpty()
  status: TaskStatus;

  isDeleted: boolean;
  deleteDate: Date;
}
