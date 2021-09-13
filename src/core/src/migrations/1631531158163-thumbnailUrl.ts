import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
} from 'typeorm';

export class thumbnailUrl1631531158163 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('midia', new TableColumn({
      name: 'thumbnailUrl',
      type: 'varchar',
      isNullable: true,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('midia', 'thumbnailUrl' );
  }

}
