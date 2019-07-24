'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class News extends Model {
    user(){
        return this.belongsTo('App/Models/User')
    }
    static get hidden () {
        return ['is_deleted']
    }
}

module.exports = News
