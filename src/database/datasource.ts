import { DataSource } from 'typeorm';
import { databaseSchema } from '../config/schema';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { config } from 'dotenv';

config();

const result = databaseSchema.validate(process.env, { allowUnknown: true });

if (result.error) {
  throw result.error;
}

console.error(`${__dirname}\\..\\**\\*.ts`);

export default new DataSource({
  type: 'postgres',
  host: process.env['DATABASE__HOST'],
  port: +process.env['DATABASE__PORT']!,
  username: process.env['DATABASE__USER'],
  password: process.env['DATABASE__PASSWORD'],
  database: process.env['DATABASE__NAME'],
  entities: [`${__dirname}\\..\\**\\*.entity.ts`],
  migrations: [`${__dirname}\\migration\\*.ts`],
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
});
