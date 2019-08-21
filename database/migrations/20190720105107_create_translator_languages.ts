
import { TABLE_NAME } from '../models/Language'

export function up (knex) {
  return knex.schema.createTable(TABLE_NAME, ($table) => {
    $table.increments('id')
    $table
      .string('code', 10)
      .unique()
      .comment('Language abbr')
    $table
      .string('name', 60)
      .unique()
      .comment('Language name')
    $table
      .string('script', 10)
      .nullable()
      .comment('Language script')
    $table
      .string('native', 60)
      .comment('Language name in native languate')
      .nullable()
    $table
      .string('regional', 10)
      .comment('Regiolan code')
      .nullable()
    $table
      .boolean('yandex')
      .comment(`flag for yandex translation`)
      .defaultTo(false)
    $table
      .integer('order')
      .comment('primary sort for table')
      .defaultTo(0)
    $table.timestamps(true, true)
    $table
      .timestamp('deleted_at')
      .nullable()
      .comment('Soft delete col')
  })
}

export function down ({ schema }) {
  return schema.dropTableIfExists(TABLE_NAME)
}
