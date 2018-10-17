/* eslint-disable*/
import server from '../api/index.js'
import request from 'supertest'
import User from '../db/models/User'

let users = null
const token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiaWQiOiIwZjhhNWIzZi1iZGI1LTRmMzUtOGQwZi01NTZmNGFhMDI5YTMiLCJlbWFpbCI6ImNhaW9AbmF2ZS5ycyIsInJvbGVfaWQiOiI1MjY3NzVkNC03ZjE3LTQ0MzItOGM3NC00NjZlMmYyNWQ1MDEifSwiaWF0IjoxNTM2ODg5NDMzfQ.U1E5nGtCcga5dP31pBtx8PEOPur5J5-5lFB9YbiO3lg'

beforeEach(async () => {
  users = await new User().fetch()
})

afterEach(() => {
  server.close()
})

describe('routes: users', () => {
  describe('GET /v1/users', () => {
    test('should return a list of users', async () => {
      const response = await request(server)
        .get('/v1/users')
        .set('Authorization', token)
      expect(response.status).toEqual(200)
      expect(response.type).toEqual('application/json')
      expect(Object.keys(response.body[0])).toEqual(
        expect.arrayContaining(['name', 'email', 'role_id'])
      )
    })
  })

  describe('POST /v1/users', () => {
    test('should create a new user', async () => {
      const response = await request(server)
        .post('/v1/users/signup')
        .set('Authorization', token)
        .send({
          name: 'teste',
          email: 'teste@nave.rs',
          password: 'teste1',
          role_id: '526775d4-7f17-4432-8c74-466e2f25d501',
        })
      expect(response.status).toEqual(200)
      expect(response.type).toEqual('application/json')
      expect(Object.keys(response.body)).toEqual(
        expect.arrayContaining(['name', 'email', 'role_id'])
      )
    })
  })

  describe('GET /v1/users', () => {
    test('should return a user', async () => {
      const response = await request(server)
        .get('/v1/users/' + users.attributes.id)
        .set('Authorization', token)
      expect(response.status).toEqual(200)
      expect(response.type).toEqual('application/json')
      expect(Object.keys(response.body)).toEqual(
        expect.arrayContaining(['name', 'email', 'role_id'])
      )
    })
  })

  describe('PUT /v1/users', () => {
    test('should update a user', async () => {
      const response = await request(server)
        .put('/v1/users/' + users.attributes.id)
        .set('Authorization', token)
        .send({
          name: 'update',
          email: 'update@nave.rs',
          password: 'update123',
          role_id: '526775d4-7f17-4432-8c74-466e2f25d501',
        })
      expect(response.status).toEqual(200)
      expect(response.type).toEqual('application/json')
      expect(Object.keys(response.body)).toEqual(
        expect.arrayContaining(['name', 'email', 'role_id'])
      )
    })
  })

  describe('DELETE /v1/users', async () => {
    test('should delete a user', async () => {
      const response = await request(server)
        .delete('/v1/users/' + users.attributes.id)
        .set('Authorization', token)
      expect(response.status).toEqual(200)
      expect(response.type).toEqual('application/json')
      expect(Object.keys(response.body)).toEqual(
        expect.arrayContaining([
          'name',
          'message',
          'deleted',
          'statusCode',
          'errorCode',
        ])
      )
    })
  })
})
