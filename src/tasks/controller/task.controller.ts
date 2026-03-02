import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { TaskService } from '../service/task.service'
import { updateTaskDTO } from 'src/auth/dto/updateClassDTO';
import { Task } from 'src/auth/entity/task.entity';
import { STATUS_CODES } from 'http';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("Tasks")


@Controller('api/task')
export class TaskController {
  constructor(private readonly taskSvc: TaskService) { }
  @Get()
  @ApiOperation({summary: '|Lista las tareas disponibles'})
  public async fetchTasks(): Promise<any[]> {
    return await this.taskSvc.getTasks();
  }

  /** !GET http:localhost:3000/api/task/1 */
// %27%20OR%20%271%27=%271
  // ' OR '1'='1
  // ' UNION SELECT * FROM users

  @Get(":id")
  public async getTaskById(@Param("id", ParseIntPipe) id: number):Promise <Task> {
    var task =  await this.taskSvc.getTaskById(id);
    if (task) return task;

    else throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    

  }
  /** !POST GET http:localhost:3000/api/task*/
  @Post()
  public insertTask(@Body() task: any): any {
    return this.taskSvc.insertTask(task);
  }
  @Put(":id")
  public updateTask(@Body("id", ParseIntPipe) id: number, task: updateTaskDTO): any {
    return this.taskSvc.updateTask(id, task);
  }
  @Delete()
  @HttpCode(HttpStatus.OK)
  public async deleteTask(@Param("id", ParseIntPipe) id: number):Promise <boolean> {
    
    const result = await this.taskSvc.deleteTask(id);

    if(!result)
      throw new HttpException("No se puede eliminar la tarea", HttpStatus.INTERNAL_SERVER_ERROR)
    return result;
  }


}

