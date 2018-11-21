import fs from 'fs'
import bookshelf from '../bookshelf'
import Match from './Match'
import Championship from './Championship'

export default bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  uuid: true,
  idAttribute: 'id',
  toJSON: function () {
    const attrs = bookshelf.Model.prototype.toJSON.apply(this, arguments)
    delete attrs.password
    return attrs
  },
  matches: function () {
    return this.belongsToMany(Match)
  },
  championships: function () {
    return this.belongsToMany(Championship)
  },
  constructor: function () {
    bookshelf.Model.apply(this, arguments)
    this.on('updated', () => {
      if (!fs.existsSync('./public/databaseLogger.txt')) {
        fs.writeFileSync(
          './public/databaseLogger.txt',
          `${new Date(Date.now()).toLocaleString()} --> Alteração de usuario\n`,
          err => {
            if (err) throw err
            console.log('Updated!')
          }
        )
      } else {
        fs.appendFileSync(
          './public/databaseLogger.txt',
          `${new Date(Date.now()).toLocaleString()} --> Alteração de usuario\n`,
          err => {
            if (err) throw err
            console.log('Updated!')
          })
      }
    })

    this.on('destroyed', () => {
      if (!fs.existsSync('./public/databaseLogger.txt')) {
        fs.writeFileSync(
          './public/databaseLogger.txt',
          `${new Date(Date.now()).toLocaleString()} --> Exclusão de usuario\n`,
          err => {
            if (err) throw err
            console.log('Exluded!')
          }
        )
      } else {
        fs.appendFileSync(
          './public/databaseLogger.txt',
          `${new Date(Date.now()).toLocaleString()} --> Exclusão de usuario\n`,
          err => {
            if (err) throw err
            console.log('Exluded!')
          })
      }
    })

    this.on('created', () => {
      if (!fs.existsSync('./public/databaseLogger.txt')) {
        fs.writeFileSync(
          './public/databaseLogger.txt',
          `${new Date(Date.now()).toLocaleString()} --> Cadastro de usuario\n`,
          err => {
            if (err) throw err
            console.log('Created!')
          }
        )
      } else {
        fs.appendFileSync(
          './public/databaseLogger.txt',
          `${new Date(Date.now()).toLocaleString()} --> Cadastro de usuario\n`,
          err => {
            if (err) throw err
            console.log('Created!')
          })
      }
    })
  }

})
