import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TaskService } from '../service/task.service'

@Controller('api/task')
export class TaskController {
  constructor(private readonly taskSvc: TaskService) {}
  @Get('1')
  public fetchTasks(): string[] {
    return this.taskSvc.getTasks();
  }
@Get(":id")
public getTaskById(@Param("id") id:string):any{
    return this.taskSvc.getTaskById(parseInt(id));


}
  @Post()
  public insertTask(task: any): any {
    return this.taskSvc.insertTask(task);
  }
  @Put()
  public updateTask(id: number, task: any): any {
    return this.taskSvc.updateTask(id, task);
  }
  @Delete()
  public deleteTask(id: number): any {
    return this.taskSvc.deleteTask(id);
  }


}

