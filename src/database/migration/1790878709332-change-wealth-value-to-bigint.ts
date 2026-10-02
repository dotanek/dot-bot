import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeWealthValueToBigint1790878709332 implements MigrationInterface {
  name = 'ChangeWealthValueToBigint1790878709332';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "twitch"."wealth" ALTER COLUMN "value" TYPE bigint`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "twitch"."wealth" SET "value"= 2147483647 WHERE "value" > 2147483647`,
    );
    await queryRunner.query(
      `ALTER TABLE "twitch"."wealth" ALTER COLUMN "value" TYPE integer`,
    );
  }
}
