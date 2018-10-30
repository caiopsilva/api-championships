/* eslint-env jest */
import app from '../api/config/server'
import request from 'supertest'
import Database from '../api/utils/knex'
import UserFactory from '../factory/user-factory'
import ChampionshipFactory from './factory/championship-factory'

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

  describe('POST /v1/championships', () => {
    test('should create a new championship', async () => {
      const response = await request(server)
        .post('/v1/championships')
        .set('Authorization', user.token)
        .send({
          name: 'championship-test'
        })
      expect(response.status).toEqual(200)
      expect(response.type).toEqual('application/json')
      expect(Object.keys(response.body)).toEqual(
        expect.arrayContaining(['name'])
      )
    })
  })

  describe('GET /v1/championships', () => {
    beforeEach(async () => {
      await ChampionshipFactory()
    })
    test('should return a list of championships', async () => {
      const response = await request(server)
        .get('/v1/championships')
        .set('Authorization', user.token)
      expect(response.status).toEqual(200)
      expect(response.type).toEqual('application/json')
      expect(Object.keys(response.body[0])).toEqual(
        expect.arrayContaining(['name', 'email'])
      )
    })
  })
})
