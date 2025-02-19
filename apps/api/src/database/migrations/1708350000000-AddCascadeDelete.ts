import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeDelete1708350000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // First drop the existing foreign key
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT IF EXISTS "FK_18a04c9720ea052eac80971ba48"`);
        
        // Recreate with CASCADE delete
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_18a04c9720ea052eac80971ba48" 
            FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert back to the original constraint
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT IF EXISTS "FK_18a04c9720ea052eac80971ba48"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_18a04c9720ea052eac80971ba48" 
            FOREIGN KEY ("productId") REFERENCES "products"("id")`);
    }
}
