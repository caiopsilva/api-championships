import bcrypt from 'bcrypt'

export default (password) => {
  let hashPassword = bcrypt.hash(password, 10)
  return hashPassword
}
