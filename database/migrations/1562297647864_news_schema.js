'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NewsSchema extends Schema {
  up () {
    this.create('news', (table) => {
      table.increments()
      table.string('description')
      table.integer('user_id').nullable()
      table.boolean('is_deleted').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('news')
  }
}

module.exports = NewsSchema
