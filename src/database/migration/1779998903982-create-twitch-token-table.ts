import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTwitchTokenTable1779998903982 implements MigrationInterface {
  name = 'CreateTwitchTokenTable1779998903982';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "twitch"."tokens" ("id" uuid NOT NULL, "access" character varying NOT NULL, "refresh" character varying NOT NULL, "updated_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "twitch"."tokens"`);
  }
}
