import { TABLE_NAME } from '../models/Translation'

export async function up ({ schema }) {
  return schema.createTable(TABLE_NAME, ($table) => {
    $table.increments('id')
    $table.string('locale', 10)
    $table.string('namespace', 150).defaultTo('*')
    $table.string('group', 150)
    $table.string('item', 150)
    $table.text('text')
    $table.boolean('unstable').defaultTo(false)
    $table.boolean('locked').defaultTo(false)
    $table.timestamps(true, true)
    $table
      .timestamp('deleted_at')
      .nullable()
      .comment('Soft delete col')
    $table
      .foreign('locale')
      .references('code')
      .inTable('translator_languages')
    $table.unique(['locale', 'namespace', 'group', 'item'])
  })
}

export async function down ({ schema }) {
  return schema.dropTableIfExists(TABLE_NAME)
}
