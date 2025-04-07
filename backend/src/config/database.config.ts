import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'mysql',  
  host: '172.17.0.2',  
  port: 3306,  
  username: 'mysql', 
  password: 'my_password',  
  database: 'my_database',  
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',  
}));
