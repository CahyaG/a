'use strict'

const User = use('App/Models/User')
const News = use('App/Models/News')
const CRUDService = use('App/Services/CRUDService')

class UserController {
    async index({request, response}) {
        const params = request.all()

        let page = params.page ? params.page : 1
        let limit = params.limit ? params.limit : 10
        const offset = (page-1)*limit

        const data = await User.query()
        .where('is_deleted', false)
        .paginate(page, limit)
        
        let json = data.toJSON()
        json.content = json.data
        delete json.data

        return response.ok(json, 'list of user') 
    }

    async getUserWithNews({request, response, params}) {
        const data = await User.query().where('id', params.id).with('news').fetch()
        
        return response.ok(data)
    }

    async show({request, response, params}) {
        const data = await User.find(params.id)
    
        return response.ok(data) 
    }

    async store({request, response, params}) {
        const data = request.post()
        let user = await CRUDService.store('App/Models/User', data)

        return response.ok(user)
    }

    async update({request, response, params}) {
        const data = request.post()
        
        let user = await User.find(params.id)
        user.merge(data)
        await user.save()

        return response.ok(user)
    }

    async destroy({request, response, params}) {   
        const all = request.all()
        let permanent = false
        if(all.permanent==true) permanent = true

        await CRUDService.destroy('App/Models/User', params.id, permanent)

        return response.ok(null, 'Delete Success')
    }
}

module.exports = UserController
