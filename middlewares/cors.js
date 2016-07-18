const cors = require('koa-cors')
module.exports = cors({
  methods: 'GET,POST, DELETE, PUT'
})
