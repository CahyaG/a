'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

Factory.blueprint('App/Models/News', (faker) => {
  return {
    description : faker.sentence(),
    user_id : faker.integer({min:1, max:50})
  }
})

Factory.blueprint('App/Models/User', (faker) => {
  return {
    username : faker.username(),
    email : faker.email(),
    password : faker.word({ length : 5})
  }
})
