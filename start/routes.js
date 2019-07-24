'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const config = use('Config')
const key = config.get("app.encryptionKey");
const cryptLib = require('@skavinvarnan/cryptlib');
const User = use('App/Models/User')
const ms = require('ms')

Route.group(()=>{
    Route.resource('/', 'NewsController')
        .middleware(new Map([
            [['store'], ['authtoken','auth']]
        ]))
}).prefix('/news')

Route.group(()=>{
    Route.resource('', 'UserController')
    Route.get('/news/:id', 'UserController.getUserWithNews')
}).prefix('/user')

Route.post('/login', 'AuthController.login')
Route.get('/profile', 'AuthController.profile').middleware(['authtoken','auth'])
Route.delete('/logout', 'AuthController.logout').middleware(['authtoken'])

Route.post('/decrypt', ({request, response})=>{
    const params = request.header('encryptKey')
    let encryptKey = params.encryptKey

    if(!encryptKey || encryptKey != key) return response.ok(null, 'Wrong Encryption Key')

    let raw = params.data
    let dataRaw = cryptLib.decryptCipherTextWithRandomIV(raw,encryptKey)
    let data = {}
    data = JSON.parse(dataRaw)
    return data
})

Route.any('/test',async ({response})=>{ 
    // let id = Math.ceil(Math.random() * 52)
    // console.log(id)
    let user = await User.query().fetch()
    user = user.toJSON()
    user = user.map(item =>{
        let date = new Date(item.updated_at)
        item.test_map = Math.ceil(Math.random() * 26)
        console.log(item.test)
        return item
    })
    return response.ok(user)
    // return ms('1m')
})

Route.any('*', ({request, response}) => {
    return response.ok(null, "Route "+request.method()+" "+request.url()+" Not Found", 404)
})
