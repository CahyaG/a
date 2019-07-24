'use strict'

class CRUDService{
    static async destroy (model, id, permanent = false){
        const Model = use(model)
        const data = await Model.find(id)
        
        console.log(data)
        data.merge({'is_deleted':true})
        if(permanent) await data.delete()
        await data.save()
    }

    static async store(model, data){
        const Model = use(model)
        let res = new Model()
        res.fill(data)
        await res.save()

        return res
    }
}

module.exports = CRUDService