'use strict'
const fs = require('mz/fs')
const _ = require('lodash')

module.exports = {
  findAll: function () {
    const users = require('../data/users')
    const groups = require('../data/groups')
    const usersGroups = require('../data/usersGroups')
    return users.map(user => {
      let userGroups = []
      usersGroups.forEach(relation => {
        if (relation.idUser === user.id) {
          let groupIndex = _.findIndex(groups, {id: relation.idGroup})
          userGroups.push(groups[groupIndex])
        }
      })
      user.groups = userGroups
      return user
    })
  },
  findOne: function (id) {
    id = parseInt(id)
    if (!id) {
      throw new Error('wrong id param')
    }

    const users = require('../data/users')
    const groups = require('../data/groups')
    const usersGroups = require('../data/usersGroups')
    const index = _.findIndex(users, {id})
    let user = users[index]
    let userGroups = []
    usersGroups.forEach(relation => {
      if (relation.idUser === user.id) {
        let groupIndex = _.findIndex(groups, {id: relation.idGroup})
        userGroups.push(groups[groupIndex])
      }
    })
    user.groups = userGroups
    return user
  }
}
