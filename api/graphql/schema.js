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

  input UserInput {
    email: String!
    name: String!
    password: String!
  }

  type AuthData {
    user: User!
    token: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type RootQuery {
    login(input: LoginInput!): AuthData!
  }

  type RootMutation {
    createUser(input: UserInput): User!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)
