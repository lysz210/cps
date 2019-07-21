const TABLE_NAME = 'translator_translations'
exports.up = function ({ schema }) {
  return schema.createTable(TABLE_NAME, ($table) => {
    $table.increments('id')
    $table.string('locale', 10)
    $table.string('namespace', 150).default('*')
    $table.string('group', 150)
    $table.string('item', 150)
    $table.text('text')
    $table.boolean('unstable').default(false)
    $table.boolean('locked').default(false)
    $table.timestamps()
    $table
      .timestamp('deleted_at')
      .nullable()
      .comment('Soft delete col')
    $table
      .foreign('locale')
      .references('locale')
      .on('translator_languages')
    $table.unique(['locale', 'namespace', 'group', 'item'])
  })
}

exports.down = function ({ schema }) {
  return schema.dropTableIfExists(TABLE_NAME)
}
