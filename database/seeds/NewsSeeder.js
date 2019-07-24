'use strict'

/*
|--------------------------------------------------------------------------
| NewsSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class NewsSeeder {
  async run () {
    const newssArray = await Factory
    .model('App/Models/News')
    .createMany(50)
  }
}

module.exports = NewsSeeder
