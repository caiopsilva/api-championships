import bookshelf from '../bookshelf'
import User from './User'
import Match from './Match'

export default bookshelf.Model.extend({
  tableName: 'championships',
  hasTimestamps: true,
  uuid: true,
  idAttribute: 'id',
  users: function () {
    return this.belongsToMany(User)
  },
  matches: function () {
    return this.belongsToMany(Match)
  }
})
