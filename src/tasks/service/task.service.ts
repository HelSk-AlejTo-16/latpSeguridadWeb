import { Inject, Injectable } from "@nestjs/common";
import { CreateTaskDto } from "../dto/create-task.dto";
import { Client } from "pg";
import { updateTaskDTO } from "src/auth/dto/updateClassDTO";
import { PrismaService } from "src/common/services/prisma.service";
import { Task } from "src/tasks/entity/task.entity";

@Injectable()
export class TaskService {
  constructor(
    @Inject('DATABASE_CONNECTION') private db: Client,
    private prisma: PrismaService,
   
  ) {}
 private tasks: Task[] = [];

  // Solo las tareas del usuario en sesión
  public async getTasks(userId: number): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: { user_id: userId },
    });
    return tasks;
  }

  // Solo si la tarea pertenece al usuario en sesión
  public async getTaskById(id: number, userId: number): Promise<Task | null> {
    const task = await this.prisma.task.findFirst({
      where: { id, user_id: userId },
    });
    return task;
  }

  // Asigna user_id desde el token, no del body
  public async insertTask(task: CreateTaskDto ): Promise<Task> {
    const newTasks= await this.prisma.task.create({
      data: task 
    });
    return newTasks;
  }

  // Verifica que la tarea sea del usuario antes de actualizar
  public async updateTask(id: number, taskUpdated: updateTaskDTO, userId: number): Promise<Task | null> {
    const task = await this.prisma.task.findFirst({
      where: { id:id, user_id: userId },
    });

    if (!task) return null; // no existe o no es del usuario

    return await this.prisma.task.update({
      where: { id },
      data: taskUpdated,
    });
    return task;
  }

  // Verifica que la tarea sea del usuario antes de borrar
  public async deleteTask(id: number, userId: number): Promise<boolean> {
    const task = await this.prisma.task.findFirst({
      where: { id, user_id: userId },
    });

    if (!task) return false; // no existe o no le pertenece

    await this.prisma.task.delete({
      where: { id },
    });

    return true;
  }
}