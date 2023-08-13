import {DatabaseType, DataSource} from 'typeorm';
import {Config} from '../config/config';

export class Database {
  private readonly dataSource: DataSource;

  constructor(private readonly config: Config) {
    this.dataSource = new DataSource(config.database);
  }
}
