'use strict'
const fs = require('mz/fs')
const _ = require('lodash')
const groupsStore = './data/groups.json'
const usersStore = './data/users.json'
const usersGroupsStore = './data/usersGroups.json'

module.exports = {
  getAllStores: function () {
    const stores = [groupsStore, usersStore, usersGroupsStore]
    return stores.map(store => {
      return new Promise((resolve, reject) => {
        fs
          .readFile(store)
          .then((data) => { resolve(JSON.parse(data)) })
          .catch((err) => { reject(err) })
      })
    })
  },

  updateStore: function (store, data) {
    return new Promise((resolve, reject) => {
      fs
        .writeFile(store, JSON.stringify(data, null, 4))
        .then(() => resolve())
        .catch((err) => reject(err))
    })
  },
  findGroups: function (usersGroups, user, groups) {
    let userGroups = []
    usersGroups.forEach(relation => {
      if (relation.idUser === user.id) {
        let groupIndex = _.findIndex(groups, {id: relation.idGroup})
        if (groupIndex > -1) {
          userGroups.push(groups[groupIndex])
        }
      }
    })
    return userGroups
  },
  findUsers: function (usersGroups, group, users) {
    let userGroups = []
    usersGroups.forEach(relation => {
      if (relation.idGroup === group.id) {
        let userIndex = _.findIndex(users, {id: relation.idUser})
        if (userIndex > -1) {
          userGroups.push(users[userIndex])
        }
      }
    })
    return userGroups
  },
  groupsStore,
  usersStore,
  usersGroupsStore
}
