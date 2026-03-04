import { Inject, Injectable } from "@nestjs/common";
import { CreateTaskDto } from "../dto/create-task.dto";
import { Client } from "pg";
import { updateTaskDTO } from "src/auth/dto/updateClassDTO";
import { PrismaService } from "src/prisma.service";
import { Task } from "src/tasks/entity/task.entity";

@Injectable()
export class TaskService {

  constructor(@Inject('DATABASE_CONNECTION') private db: Client,
    private prisma: PrismaService) { }



  private tasks: any[] = [];



  public async getTasks(): Promise<Task[]> {
    const task = await this.prisma.task.findMany();
    return task;

  }

  public async getTaskById(id: number): Promise<Task> {
    const task = await this.prisma.task.findUniqueOrThrow({
      where: { id: id },
    });
    return task;
  }


  public async insertTask(task: CreateTaskDto): Promise<any> {

    const newtask = await this.prisma.task.create({
      data: task
    })

    return newtask;
  }

  public async updateTask(id: number, taskUpdated: updateTaskDTO): Promise<any> {
    const task = await this.prisma.task.update({
      where:{id},
      data: taskUpdated
    });

    
  }



  public async deleteTask(id: number): Promise<boolean> {
    const task = await this.prisma.task.delete({
      where:{id}
    });

    return false;



}
}