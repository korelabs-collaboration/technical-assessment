import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1739854888248 implements MigrationInterface {
    name = 'Migration1739854888248'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_18a04c9720ea052eac80971ba48"`);
        await queryRunner.query(`CREATE TABLE "product_properties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "properties" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "productId" uuid, CONSTRAINT "REL_cffc9e18f85a8d8173e5d835ee" UNIQUE ("productId"), CONSTRAINT "PK_c51d81a7e32d11a7b59c13192cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "properties"`);
        await queryRunner.query(`CREATE INDEX "IDX_18a04c9720ea052eac80971ba4" ON "tasks" ("productId") `);
        await queryRunner.query(`ALTER TABLE "product_properties" ADD CONSTRAINT "FK_cffc9e18f85a8d8173e5d835ee3" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_18a04c9720ea052eac80971ba48" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_18a04c9720ea052eac80971ba48"`);
        await queryRunner.query(`ALTER TABLE "product_properties" DROP CONSTRAINT "FK_cffc9e18f85a8d8173e5d835ee3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_18a04c9720ea052eac80971ba4"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "properties" jsonb`);
        await queryRunner.query(`DROP TABLE "product_properties"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_18a04c9720ea052eac80971ba48" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
