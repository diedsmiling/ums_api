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
  /**
   * Finds all groups
   *
   * @returns {Array}
   */
  findAll: function * () {
    const stores = yield Store.getAllStores()
    const groups = stores[0]
    const users = stores[1]
    const usersGroups = stores[2]

    return groups.map(group => {
      group.users = Store.findUsers(usersGroups, group, users)
      return group
    })
  },
  findOne: function * (id) {
    id = validate(id)
    const stores = yield Store.getAllStores()
    const groups = stores[0]
    const users = stores[1]
    const usersGroups = stores[2]

    const index = _.findIndex(groups, {id})
    let group = groups[index]
    group.users = Store.findUsers(usersGroups, group, users)
    return group
  },
  add: function * (group) {
    const stores = yield Store.getAllStores()
    const groups = stores[0]
    const usersGroups = stores[2]

    let userGroups = group.users
    let id = groups[groups.length - 1].id
    group.id = ++id
    userGroups.forEach((user) => {
      usersGroups.push({
        idUser: user.id,
        idGroup: id
      })
    })
    delete group.users
    groups.push(group)

    let promises = []
    promises.push(Store.updateStore(Store.usersGroupsStore, usersGroups))
    promises.push(Store.updateStore(Store.groupsStore, groups))
    yield promises
  },
  destroy: function * (id) {
    id = validate(id)
    const stores = yield Store.getAllStores()
    let groups = stores[0]
    let usersGroups = stores[2]

    const groupIndex = _.findIndex(groups, {id})
    groups.splice(groupIndex, 1)
    let promises = []
    promises.push(Store.updateStore(
      Store.usersGroupsStore,
      usersGroups.filter(relation => relation.idGroup !== id))
    )
    promises.push(Store.updateStore(Store.groupsStore, groups))
    yield promises
  },
  update: function * (group) {
    const stores = yield Store.getAllStores()
    const groups = stores[0]
    let usersGroups = stores[2]
    const groupIndex = _.findIndex(groups, {id: group.id})

    if (groupIndex < 0) {
      throw new Error('User not found')
    }

    usersGroups = usersGroups.filter(relation => relation.idGroup !== group.id)

    group.users.forEach((user) => {
      usersGroups.push({
        idUser: user.id,
        idGroup: group.id
      })
    })
    delete group.users
    groups[groupIndex] = group

    let promises = []
    promises.push(Store.updateStore(Store.usersGroupsStore, usersGroups))
    promises.push(Store.updateStore(Store.groupsStore, groups))
    yield promises
  }
}
