'use strict'

const User = use('App/Models/User') 

class AuthController {
    async login({request, response, auth}){
        const {username, email, password} = request.all()
        if(email) return auth.authenticator('email').attempt(email,password)
        return auth.attempt(username,password)
    }

    async profile({request, response, auth}){
        return response.ok(await auth.getUser())
    }

    async logout({request, response, auth}){
        const token = auth.getAuthHeader()
        await auth.revokeTokens([token],true)
        return response.ok(null, 'Logout Successfully')
    }
}

module.exports = AuthController
