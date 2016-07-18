// Parse application/json, application/x-www-form-urlencoded
// NOT form/multipart!
const bodyParser = require('koa-bodyparser')
module.exports = bodyParser({
  extendTypes: {
    json: ['application/x-javascript'] // will parse application/x-javascript type body as a JSON string
  }
})

