import {
  MigrationInterface,
  QueryRunner,
  Table,
} from 'typeorm';

export class GeneroMusical1617392368504 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'genero-musical',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          }, {
            name: 'nome',
            type: 'varchar',
          }, {
            name: 'popularidade',
            type: 'int4',
          }, {
            name: 'iconeUrl',
            type: 'varchar',
            isNullable: true,
          }, {
            name: 'createdBy',
            type: 'varchar',
            isNullable: true,
          }, {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'now()',
          }, {
            name: 'updatedBy',
            type: 'varchar',
            isNullable: true,
          }, {
            name: 'updatedAt',
            type: 'timestamptz',
            default: 'now()',
          }, {
            name: 'deletedBy',
            type: 'varchar',
            isNullable: true,
          }, {
            name: 'deletedAt',
            type: 'timestamptz',
            isNullable: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('genero-musical');
  }

}
