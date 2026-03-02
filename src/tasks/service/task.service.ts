import { Inject, Injectable } from "@nestjs/common";
import { CreateTaskDto } from "../dto/create-task.dto";
import { Client } from "pg";

@Injectable()
export class TaskService {

  constructor(@Inject('DATABASE_CONNECTION') private db: Client) { }



  private tasks: any[] = [];



  public async getTasks(): Promise<any[]> {
    const query = `SELECT * FROM tasks`;
    const result = await this.db.query(query);
    return result.rows;

  }

  public async getTaskById(id: number): Promise<any> {
    const query = `SELECT * FROM tasks where id = ${id}`;
    const result = await this.db.query(query);
    return result.rows;
  }


  public async insertTask(task: CreateTaskDto): Promise<any> {

    const query = ` INSERT INTO tasks (name, description, priority VALUES ('${task.name}','${task.description}','${task.description}', RETURNING *)`
    console.log(query);
    const result = await this.db.query(query);
    return result.oid;


  }





  public async updateTask(id: number, task: any):Promise<any> {
    const query =
      `UPDATE task
  SET name = ${task.name},
  description = ${task.description},
  priority = ${task.priority}
  where id = ${id}
  returning *
  
  `;

  const result = await this.db.query(query);
  return result.rows[0];
  }



  public deleteTask(id: number): any {
    const array = this.tasks.filter(data => data.id != id)
    this.tasks = array;
    return 'Eliminando la tarea ' + id;
  }
}