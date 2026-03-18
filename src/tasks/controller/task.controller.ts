import {
  Body, Controller, Delete, Get, HttpCode,
  HttpException, HttpStatus, Param, ParseIntPipe,
  Post, Put, Req, UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CreateTaskDto } from '../dto/create-task.dto';
import { updateTaskDTO } from 'src/auth/dto/updateClassDTO';
import { TaskService } from '../service/task.service';
import { Task } from '../entity/task.entity';

@ApiTags('Tasks')
@UseGuards(AuthGuard)        
@Controller('api/task')
export class TaskController {
  constructor(private readonly taskSvc: TaskService) {}

  // Lista solo las tareas del usuario en sesión
  @Get()
  @ApiOperation({ summary: '| Lista las tareas del usuario en sesión' })
  public async fetchTasks(@Req() req: any): Promise<Task[]> {
    const { id } = req['user'];
    return await this.taskSvc.getTasks(id);
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
    @Body() dto: CreateTaskDto,
    @Req() req: any,
  ): Promise<Task> {
    const { id: userId } = req['user'];
    return await this.taskSvc.insertTask(dto, userId);
  }


  @Put(':id')
  @ApiOperation({ summary: '| Actualiza una tarea del usuario en sesión' })
  public async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: updateTaskDTO,
    @Req() req: any,
  ): Promise<Task> {
    const { id: userId } = req['user'];
    const task = await this.taskSvc.updateTask(id, dto, userId);
    if (!task) throw new HttpException('Task not found or unauthorized', HttpStatus.NOT_FOUND);
    return task;
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