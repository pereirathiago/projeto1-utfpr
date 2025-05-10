import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Medicoes1746919560937 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'medicoes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'comodo_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'data_hora',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'nivel_sinal_2_4ghz',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'nivel_sinal_5ghz',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'velocidade_2_4ghz',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'velocidade_5ghz',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'interferencia',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()'
          }
        ],
        foreignKeys: [
          {
            name: 'FKUserMedicao',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'FKComodoMedicao',
            referencedTableName: 'comodos',
            referencedColumnNames: ['id'],
            columnNames: ['comodo_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('medicoes');
  }
}
