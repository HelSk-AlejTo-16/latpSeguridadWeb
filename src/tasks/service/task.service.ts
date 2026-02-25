import { Inject, Injectable } from "@nestjs/common";
import { CreateTaskDto } from "../dto/create-task.dto";
import { Client } from "pg";
import { updateTaskDTO } from "src/auth/dto/updateClassDTO";

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
    const results = (await this.db.query(query)).rows;
    return results[0];
  }


  public async insertTask(task: CreateTaskDto): Promise<any> {

    const query = ` INSERT INTO tasks (name, description, priority VALUES ('${task.name}','${task.description}','${task.description}', RETURNING *)`
    console.log(query);
    const result = await this.db.query(query);
    return result.oid;


  }

  public async updateTask(id: number, taskUpdated:updateTaskDTO):Promise<any> {
    const task = await this.getTaskById(id);
    task.name= taskUpdated.name ?? task.name;
    task.description= taskUpdated.description ?? task.description;
    task.priority= taskUpdated.priority ?? task.priority;


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



  public async deleteTask(id: number): Promise<boolean> {
    const sql = `DELETE FROM tasks where id = ${id}`
    const result = await this.db.query(sql);

    return result.rowCount! > 0;
  }
}