import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'mysql',
  host: process.env.DB_HOST || 'mysql',
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USER ?? 'mysql',
  password: process.env.DB_PASSWORD ?? 'my_password',
  database: process.env.DB_NAME ?? 'my_database',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
}));
