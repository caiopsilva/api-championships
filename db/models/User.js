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
  }
})
