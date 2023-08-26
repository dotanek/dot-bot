import { DataSource, Repository } from 'typeorm';
import datasource from './datasource';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import {EntityTarget} from "typeorm/common/EntityTarget";

export class Database {
  private static instance: Database;

  constructor(readonly dataSource: DataSource) {}

  getRepository<Entity extends ObjectLiteral>(target: EntityTarget<Entity>): Repository<Entity> {
    return this.dataSource.getRepository(target);
  }

  static async getInstance(): Promise<Database> {
    return this.instance || (this.instance = await this.createInstance());
  }

  private static async createInstance(): Promise<Database> {
    const dataSource = datasource;

    await dataSource.initialize();

    return new Database(dataSource);
  }
}

export default Database.getInstance();
