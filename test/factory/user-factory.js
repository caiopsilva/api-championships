import User from '../../db/models/User'
import generateJWTforUser from '../../api/utils/jwt-generate'
import hashPassword from '../../api/utils/hash-password'

export default async () => {
  const password = 'test123'

  let user = await new User({
    name: 'teste',
    email: 'teste@teste.com',
    password: await hashPassword(password),
    rating: '1800'
  }).save()

  user = generateJWTforUser(user.attributes)
  user.password = password
  user.token = `Bearer ${user.token}`
  return user
}
