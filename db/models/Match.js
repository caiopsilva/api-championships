import bookshelf from '../bookshelf'
import User from './User'

export default bookshelf.Model.extend({
  tableName: 'matches',
  hasTimestamps: true,
  uuid: true,
  users: function () {
    return this.belongsToMany(User)
  }
})
