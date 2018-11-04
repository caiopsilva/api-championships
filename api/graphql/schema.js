import { buildSchema } from 'graphql'

export default buildSchema(`
  type Post {
    id: ID!
    title: String!
    content: String!
    creator: User!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    rating: String!
    posts: [Post!]!
  }

  type UserInput {
    email: String!
    name: String!
    password: String!
  }

  type Mutation {
    createUser(input: UserInput): User!
  }

  schema {
    mutation: Mutation
  }
`)
