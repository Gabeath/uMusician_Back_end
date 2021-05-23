import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
} from 'typeorm';

export class FKGenroMusicalServico1621791996634 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'servico',
      new TableForeignKey({
        columnNames: ['idGeneroMusical'],
        referencedColumnNames: ['id'],
        referencedTableName: 'genero-musical-perfil',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'servico',
      new TableForeignKey({
        columnNames: ['idGeneroMusical'],
        referencedColumnNames: ['id'],
        referencedTableName: 'genero-musical-perfil',
      })
    );
  }

}
