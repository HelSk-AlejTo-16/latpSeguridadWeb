export class User {
  id: number;
  name: string;
  lastname: string | null;
  username: string;
  password?: string;
  hash?: string | null;
  create_at: Date;
}