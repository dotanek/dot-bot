import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveQuoteTable1779999303618 implements MigrationInterface {
  name = 'RemoveQuoteTable1779999303618';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "twitch"."quote"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "twitch"."quote" ("id" uuid NOT NULL, "number" integer NOT NULL, "content" character varying NOT NULL, "date" TIMESTAMP NOT NULL, CONSTRAINT "PK_b772d4cb09e587c8c72a78d2439" PRIMARY KEY ("id"))`,
    );
  }
}
