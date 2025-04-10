import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'mysql',  
  host: 'localhost',  
  port: 3306,  
  username: 'mysql', 
  password: 'my_password',  
  database: 'my_database',  
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,  
}));
