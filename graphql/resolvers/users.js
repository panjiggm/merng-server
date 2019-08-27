const bycript = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')

const { validateRegisterInput } = require('../../util/validator')
const User = require('../../models/User')
const { SECRET_KEY } = require('../../config')

module.exports = {
   Mutation: {
      async register(_, { registerInput: { username, email, password, confirmPassword } }){
         // TODO: Validate user data
         const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)

         if (!valid) {
            throw new UserInputError('Error', { errors })
         }

         // TODO: Make sure user dosn't already exist
         const user = await User.findOne({ username })

         if (user) {
            throw new UserInputError('Username is taken', {
               errors: {
                  username: 'This username is taken'
               }
            })
         }

         // TODO: Hash password and auth token
         password = await bycript.hash(password, 12)

         const newUser = new User({
            email,
            username,
            password,
            createdAt: new Date().toISOString()
         })

         const res = await newUser.save()

         const token = jwt.sign({
            id: res.id,
            email: res.email,
            username: res.username
         }, SECRET_KEY, { expiresIn: '1h' })

         return {
            ...res._doc,
            id: res._id,
            token
         }
      }
   }
}