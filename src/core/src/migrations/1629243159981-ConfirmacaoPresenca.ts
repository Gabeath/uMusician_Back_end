import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class ConfirmacaoPresenca1629243159981 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'confirmacao-presenca',
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
            name: 'idMusico',
            type: 'uuid',
          }, {
            name: 'idContratante',
            type: 'uuid',
          }, {
            name: 'codigo',
            type: 'varchar',
          }, {
            name: 'status',
            type: 'int4',
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
            columnNames: ['idMusico'],
            referencedColumnNames: ['id'],
            referencedTableName: 'perfil',
          }),
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
    await queryRunner.dropTable('confirmacao-presenca');
  }

}
