'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with news
 */

const News = use('App/Models/News') 
const User = use('App/Models/User') 
const CRUDService = use('App/Services/CRUDService')

class NewsController {
  /**
   * Show a list of all news.
   * GET news
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response}) {
    const params = request.all()
    
    let page = params.page ? params.page : 1 
    let limit = params.limit ? params.limit : 10
    let key = params.key ? params.key : ''
    let order = params.order ? params.order : 'desc'
    let offset = (page-1) * limit

    const query = News.query()
      .where('is_deleted',false)
      .where((table)=>{
        table.orWhere('description','like', '%'+ key +'%')
        .orWhereHas('user', (userBuilder)=>{
          userBuilder.orWhere('username','like', '%'+ key +'%')
          .orWhere('email','like', '%'+ key +'%')
        })
      })
      .whereHas('user', (builder) => {
        builder.where('is_deleted',false)
      })
      .with('user')
      .orderBy('id',order)


    let data = await query.paginate(page,limit) 
    // let count = await query.limit(limit).offset(offset).getCount()

    const json = data.toJSON()
    json.content = json.data
    delete json.data
    
    if(json.lastPage < page) return response.ok(null,'News not found')
    // if(count==0) return response.ok(null,'News not found')

    // let a = {
    //   data : json.data,
    //   total : json.total,
    //   perPage : json.perPage,
    //   page : json.page,
    //   lastPage : json.lastPage,
    //   totalThisPage : count
    // }

    return response.ok(json, 'List of News')
  }

  /**
   * Render a form to be used for creating a new news.
   * GET news/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new news.
   * POST news
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth}) {
    let data = request.post()
    let current_user = await auth.getUser() 
    let user_id = current_user.id
    const user = await User.find(user_id)
    if(!user) return response.ok(null,'User Not Found')
    data.user_id = user_id
    const news = await CRUDService.store('App/Models/News', data)

    return response.ok(news, 'Data Saved')
  }

  /**
   * Display a single news.
   * GET news/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const data = await News.query().where('id',params.id).with('user').fetch()
    if(!data) return response.ok(null, 'News Not Found')
    return response.ok(data)
  }

  /**
   * Render a form to update an existing news.
   * GET news/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
    
  }

  /**
   * Update news details.
   * PUT or PATCH news/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    let data = request.all()
    let news = await News.find(params.id)
    if(!news) return response.ok(null,'News Not Found')
    
    news.merge(data)
    await news.save()

    return response.ok(news, 'Data Updated')
  }

  /**
   * Delete a news with id.
   * DELETE news/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const all = request.all()
    let permanent = false
    if(all.permanent==true) permanent = true

    await CRUDService.destroy('App/Models/News', params.id, permanent)

    return response.ok(null, 'Delete Success')
  }
}

module.exports = NewsController
