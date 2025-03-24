import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'mysql',  // Change from PostgreSQL to MySQL as per your setup
  host: '172.17.0.2',  // Replace with your MySQL host (localhost for local setups or container IP)
  port: 3306,  // MySQL default port
  username: 'mysql',  // MySQL user
  password: 'my_password',  // MySQL password for the user
  database: 'my_database',  // The name of the database you want to use
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',  // Automatically sync DB in non-production environments
}));
