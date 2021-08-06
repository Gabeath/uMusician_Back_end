import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Evento1628292778234 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'evento',
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
            name: 'dataInicio',
            type: 'timestamptz',
          }, {
            name: 'dataTermino',
            type: 'timestamptz',
          }, {
            name: 'idContratante',
            type: 'uuid',
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
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['idContratante'],
            referencedColumnNames: ['id'],
            referencedTableName: 'perfil',
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('evento');
  }

}
