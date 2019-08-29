const postResolver = require('./posts')
const userResolver = require('./users')
const commentResolver = require('./comments')

module.exports = {
   Post: {
      commentCount: parent => parent.comments.length,
      likeCount: parent => parent.likes.length
   },
   Query: {
      ...postResolver.Query
   },
   Mutation: {
      ...userResolver.Mutation,
      ...postResolver.Mutation,
      ...commentResolver.Mutation
   },
   Subscription: {
      ...postResolver.Subscription
   }
}