/* eslint-env jest */
import app from '../api/config/server'
import request from 'supertest'
import Database from '../api/utils/knex'
import UserFactory from './factory/user-factory'

let server
let knex = new Database()
let user

describe('TEST USERS', () => {
  beforeEach(async () => {
    await knex.create()
    server = app.listen()
    user = await UserFactory()
  })

  afterEach(async () => {
    await knex.destroy()
    server.close()
  })

  describe('POST /v1/users', () => {
    test('should create a new user', async () => {
      const response = await request(server).post('/v1/users/signup').send({
        name: 'user-test',
        email: 'userTest@teste.com',
        password: 'test123'
      })
      expect(response.status).toEqual(200)
      expect(response.type).toEqual('application/json')
      expect(Object.keys(response.body)).toEqual(
        expect.arrayContaining(['name', 'email'])
      )
    })
  })

  describe('POST /v1/users/login', () => {
    test('should do login', async () => {
      const response = await request(server).post('/v1/users/login').send({
        email: user.email,
        password: user.password
      })
      expect(response.status).toEqual(200)
      expect(response.type).toEqual('application/json')
      expect(Object.keys(response.body)).toEqual(
        expect.arrayContaining(['name', 'email', 'token'])
      )
    })
  })

  describe('GET /v1/users', () => {
    test('should return a list of users', async () => {
      const response = await request(server)
        .get('/v1/users')
        .set('Authorization', user.token)
      expect(response.status).toEqual(200)
      expect(response.type).toEqual('application/json')
      expect(Object.keys(response.body[0])).toEqual(
        expect.arrayContaining(['name', 'email'])
      )
    })
  })

  describe('GET /v1/users', () => {
    test('should return a user', async () => {
      const response = await request(server)
        .get(`/v1/users/${user.id}`)
        .set('Authorization', user.token)
      expect(response.status).toEqual(200)
      expect(response.type).toEqual('application/json')
      expect(Object.keys(response.body)).toEqual(
        expect.arrayContaining(['name', 'email'])
      )
    })
  })

  describe('PUT /v1/users', () => {
    test('should update a user', async () => {
      const response = await request(server)
        .put(`/v1/users/${user.id}`)
        .set('Authorization', user.token)
        .send({
          name: 'user-test-update',
          email: 'userTestUpdate@teste.com',
          password: 'update123',
          role_id: user.role_id
        })
      expect(response.status).toEqual(200)
      expect(response.type).toEqual('application/json')
      expect(Object.keys(response.body)).toEqual(
        expect.arrayContaining(['name', 'email'])
      )
    })
  })

  describe('DELETE /v1/users', async () => {
    test('should delete a user', async () => {
      const response = await request(server)
        .delete(`/v1/users/${user.id}`)
        .set('Authorization', user.token)
      expect(response.status).toEqual(200)
      expect(response.type).toEqual('application/json')
      expect(Object.keys(response.body)).toEqual(
        expect.arrayContaining([
          'name',
          'message',
          'deleted',
          'statusCode',
          'errorCode'
        ])
      )
    })
  })
})
