import { Client } from "pg";

export const databaseProvider = [{
    provide: 'DATABASE_CONNECTION',
    useFactory: async() =>{
        const client = new Client(
            {
                host: 'localhost',
                port:5432,
                user:'postgres',
                password:'linux123',
                database:'latp_db'
            }
        );
        await client.connect();
        return client;
    }

}];