const TABLE_NAME = 'translator_languages'

exports.up = function (knex) {
  return knex.schema.createTable(TABLE_NAME, ($table) => {
    $table.increments('id')
    $table
      .string('locale', 10)
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
    $table.timestamps()
    $table
      .timestamp('deleted_at')
      .nullable()
      .comment('Soft delete col')
  })
}

exports.down = function ({ schema }) {
  return schema.dropTableIfExists(TABLE_NAME)
}
