'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const config = use('Config');
const key = config.get("app.encryptionKey");

const cryptLib = require('@skavinvarnan/cryptlib');

const appEncrypt = config.get('app.appEncryption');
class ResponseHelper {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response }, next) {
    response.ok = (data, message = 'OK', code = 200, otherObject) => {
      let result = {
        code,
        status: code,
        message,
      };

      for(let i in otherObject) {
          result[i] = otherObject[i]
      }

      if (data) {
        if(appEncrypt) {
          let dataString = JSON.stringify(data);
          let encryptedData = cryptLib.encryptPlainTextWithRandomIV(dataString, key);
          result.data = encryptedData;
        } else {
          result.data = data
        }   
      } 

      return response.status(code).send(result);
    }

    await next()
  }
}

module.exports = ResponseHelper
