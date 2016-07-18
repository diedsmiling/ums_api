const koa = require('koa')
const Router = require('koa-router')
const Users = require('./lib/Users')

const app = koa()
const router = new Router()

// Middlewares
app.use(require('./middlewares/logger'))
app.use(require('./middlewares/cors'))
app.use(require('./middlewares/bodyParser'))

router.get('/v1/users', function * () {
  const users = Users.findAll()
  this.body = {
    users
  }
})

router.get('/v1/users/:id', function * () {
  const user = Users.findOne(this.params.id)
  this.body = {
    user
  }
})

app.use(function *(next) {
  try {
    yield next
  } catch (err) {
    err.status = err.status || 500
    err.message = err.expose ? err.message : 'Kaboom!'

    // Set our response.
    this.status = err.status
    this.body = {code: err.status, message: err.message}
    this.app.emit('error', err, this)
  }
})

app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3300)
