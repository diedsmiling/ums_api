'use strict'

const koa = require('koa')
const Router = require('koa-router')
const Users = require('./lib/Users')
const Groups = require('./lib/Groups')

const app = koa()
const router = new Router()

// Middlewares
app.use(require('./middlewares/bodyParser'))
app.use(require('./middlewares/logger'))
app.use(require('./middlewares/cors'))


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
  console.log(this.request.body)
  if (typeof user === 'string') {
    user = JSON.parse(user)
  }
  yield Users.add(user)
  this.body = {
    status: 'ok'
  }
})

router.put('/v1/users', function * () {
  console.log(this.request.body)
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

    // Set our response.
    this.status = err.status
    this.body = {code: err.status, message: err.message}
    this.app.emit('error', err, this)
  }
})

router.get('/v1/groups', function * () {
  const groups = yield Groups.findAll()
  this.body = {
    groups
  }
})

router.get('/v1/groups/:id', function * () {
  const group = yield Groups.findOne(this.params.id)
  this.body = {
    group
  }
})

router.post('/v1/groups', function * () {
  let group = this.request.body.group
  if (typeof group === 'string') {
    group = JSON.parse(group)
  }
  yield Groups.add(group)
  this.body = {
    status: 'ok'
  }
})

router.put('/v1/groups', function * () {
  let group = this.request.body.group
  if (typeof group === 'string') {
    group = JSON.parse(group)
  }
  yield Groups.update(group)
  this.body = {
    status: 'ok'
  }
})

router.delete('/v1/groups/:id', function * () {
  yield Groups.destroy(this.params.id)
  this.body = {
    status: 'ok'
  }
})

app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(process.env.PORT || 3300)
