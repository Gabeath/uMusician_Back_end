import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Endereco1628293235418 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'endereco',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          }, {
            name: 'idEvento',
            type: 'uuid',
          }, {
            name: 'cep',
            type: 'varchar',
          }, {
            name: 'pais',
            type: 'varchar',
          }, {
            name: 'estado',
            type: 'varchar',
          }, {
            name: 'cidade',
            type: 'varchar',
          }, {
            name: 'bairro',
            type: 'varchar',
          }, {
            name: 'rua',
            type: 'varchar',
          }, {
            name: 'numero',
            type: 'varchar',
          }, {
            name: 'complemento',
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
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['idEvento'],
            referencedColumnNames: ['id'],
            referencedTableName: 'evento',
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('endereco');
  }

}
