import {
  Body, Controller, Delete, Get, HttpCode,
  HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe,
  Post, Put, Req, UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CreateTaskDto } from '../dto/create-task.dto';
import { updateTaskDTO } from 'src/auth/dto/updateClassDTO';
import { TaskService } from '../service/task.service';
import { Task } from '../entity/task.entity';
import { User } from 'src/users/entity/users.entity';

@ApiTags('Tasks')
@UseGuards(AuthGuard)        
@Controller('api/task')
export class TaskController {
  constructor(private readonly taskSvc: TaskService) {}



  // Lista solo las tareas del usuario en sesión
  @Get()
  @ApiOperation({ summary: '| Lista las tareas del usuario en sesión' })
  public async fetchTasks(@Req() request: any): Promise<Task[]> {
    const user = request[ 'user'] as User   
   // const { id } = request['user'];
    return await this.taskSvc.getTasks(user.id);
  }


  @Get(':id')
  @ApiOperation({ summary: '| Obtiene una tarea por ID' })
  public async getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<Task> {
    const { id: userId } = req['user'];
    const task = await this.taskSvc.getTaskById(id, userId);
    if (!task) throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    return task;
  }


  @Post()
  @ApiOperation({ summary: '| Crea una tarea para el usuario en sesión' })
  public async insertTask(
    @Body() task: CreateTaskDto,
    @Req() request: any,
  ): Promise<any> {
    const user = request['user'] as User;
    task.user_id = user.id;
    return this.taskSvc.insertTask(task);
  }


@Put(':id')
  @ApiOperation({ summary: '| Actualiza una tarea del usuario en sesión' })
  public async updateTask(
    @Param("id", ParseIntPipe) id: number,
    @Body() task: updateTaskDTO,
    @Req() request: any,
  ): Promise<Task> {

  const user = request['user'] as User;
    
    const updatedTask = await this.taskSvc.updateTask(id, task, user.id);
    if (!updatedTask) {
      throw new NotFoundException(`La tarea con id ${id} no existe o no tienes permisos para editarla.`);
    }
    return updatedTask;
  }

  // Elimina solo si la tarea pertenece al usuario en sesión
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '| Elimina una tarea del usuario en sesión' })
  public async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<boolean> {
    const { id: userId } = req['user'];
    const deleted = await this.taskSvc.deleteTask(id, userId);
    if (!deleted) throw new HttpException('Task not found or unauthorized', HttpStatus.NOT_FOUND);
    return true;
  }
}