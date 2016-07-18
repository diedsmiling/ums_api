'use strict'

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
  const users = yield Users.findAll()
  this.body = {
    users
  }
})

router.get('/v1/users/:id', function * () {
  const user = yield Users.findOne(this.params.id)
  this.body = {
    user
  }
})

router.post('/v1/users', function * () {
  let user = this.request.body.user
  if (typeof user === 'string') {
    user = JSON.parse(user)
  }
  yield Users.add(user)
  this.body = {
    status: 'ok'
  }
})

router.put('/v1/users', function * () {
  let user = this.request.body.user
  if (typeof user === 'string') {
    user = JSON.parse(user)
  }
  yield Users.update(user)
  this.body = {
    status: 'ok'
  }
})

router.delete('/v1/users/:id', function * () {
  yield Users.destroy(this.params.id)
  this.body = {
    status: 'ok'
  }
})

app.use(function *(next) {
  try {
    yield next
  } catch (err) {
    err.status = err.status || 500
    console.log(err)
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
