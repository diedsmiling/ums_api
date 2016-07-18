'use strict'
const Store = require('./Store')
const _ = require('lodash')

const validate = function (id) {
  id = parseInt(id)
  if (!id) {
    throw new Error('wrong id param')
  }
  return id
}

module.exports = {
  findAll: function * () {
    const stores = yield Store.getAllStores()
    const groups = stores[0]
    const users = stores[1]
    const usersGroups = stores[2]

    return users.map(user => {
      user.groups = Store.findGroups(usersGroups, user, groups)
      return user
    })
  },
  findOne: function * (id) {
    id = validate(id)
    const stores = yield Store.getAllStores()
    const groups = stores[0]
    const users = stores[1]
    const usersGroups = stores[2]

    const index = _.findIndex(users, {id})
    let user = users[index]
    user.groups = Store.findGroups(usersGroups, user, groups)
    return user
  },
  add: function * (user) {
    const stores = yield Store.getAllStores()
    const users = stores[1]
    const usersGroups = stores[2]

    let userGroups = user.groups
    let id = users[users.length - 1].id
    user.id = ++id
    userGroups.forEach((group) => {
      usersGroups.push({
        idUser: id,
        idGroup: group.id
      })
    })
    delete user.groups
    users.push(user)

    let promises = []
    promises.push(Store.updateStore(Store.usersGroupsStore, usersGroups))
    promises.push(Store.updateStore(Store.usersStore, users))
    yield promises
  },
  destroy: function * (id) {
    id = validate(id)
    const stores = yield Store.getAllStores()
    let users = stores[1]
    let usersGroups = stores[2]

    const userIndex = _.findIndex(users, {id})
    users.splice(userIndex, 1)
    let promises = []
    promises.push(Store.updateStore(
      Store.usersGroupsStore,
      usersGroups.filter(relation => relation.idUser !== id))
    )
    promises.push(Store.pdateStore(Store.usersStore, users))
    yield promises
  },
  update: function * (user) {
    const stores = yield Store.getAllStores()
    const users = stores[1]
    let usersGroups = stores[2]
    const userIndex = _.findIndex(users, {id: user.id})

    if (userIndex < 0) {
      throw new Error('User not found')
    }

    usersGroups = usersGroups.filter(relation => relation.idUser !== user.id)

    user.groups.forEach((group) => {
      usersGroups.push({
        idUser: user.id,
        idGroup: group.id
      })
    })
    delete user.groups
    users[userIndex] = user

    let promises = []
    promises.push(Store.updateStore(Store.usersGroupsStore, usersGroups))
    promises.push(Store.updateStore(Store.usersStore, users))
    yield promises
  }
}
