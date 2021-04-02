import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
} from 'typeorm';

export class Usuario1617384131256 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'usuario',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          }, {
            name: 'email',
            type: 'varchar',
          }, {
            name: 'senha',
            type: 'varchar',
          }, {
            name: 'nome',
            type: 'varchar',
          }, {
            name: 'cpf',
            type: 'varchar',
          }, {
            name: 'genero',
            type: 'int4',
          }, {
            name: 'dataNascimento',
            type: 'date',
          }, {
            name: 'fotoUrl',
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
        indices: [
          new TableIndex({
            name: 'IDX_USUARIO',
            columnNames: ['email', 'cpf'],
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('usuario');
  }

}
