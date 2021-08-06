import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class GeneroServico1628294140227 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'genero-servico',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          }, {
            name: 'idServico',
            type: 'uuid',
          }, {
            name: 'idApresentacaoGenero',
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
            columnNames: ['idServico'],
            referencedColumnNames: ['id'],
            referencedTableName: 'servico',
          }),
          new TableForeignKey({
            columnNames: ['idApresentacaoGenero'],
            referencedColumnNames: ['id'],
            referencedTableName: 'apresentacao-genero',
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('genero-servico');
  }

}
