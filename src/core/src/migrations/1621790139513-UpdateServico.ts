import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
} from 'typeorm';

export class UpdateServico1621790139513 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns(
      'servico',
      [
        new TableColumn({
          name: 'idGeneroMusical',
          type: 'uuid',
          isNullable: true,
        }),
        new TableColumn({
          name: 'valor',
          type: 'float',
          isNullable: true,
        }),
      ]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns(
      'servico',
      [
        new TableColumn({
          name: 'idGeneroMusical',
          type: 'varchar',
          isNullable: true,
        }),
        new TableColumn({
          name: 'valor',
          type: 'float',
          isNullable: true,
        }),
      ]
    );
  }

}
