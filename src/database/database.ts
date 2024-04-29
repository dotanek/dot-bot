import { DataSource, Repository } from 'typeorm';
import datasource from './datasource';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import {EntityTarget} from "typeorm/common/EntityTarget";

export class Database {
  private static instance: Database;

  constructor(private readonly _dataSource: DataSource) {}

  getRepository<Entity extends ObjectLiteral>(target: EntityTarget<Entity>): Repository<Entity> {
    return this._dataSource.getRepository(target);
  }

  async initialize(): Promise<void> {
    await this._dataSource.initialize();
  }

  static getInstance(): Database {
    return this.instance || (this.instance = this.createInstance());
  }

  private static createInstance(): Database {
    return new Database(datasource);
  }
}

export default Database.getInstance();
