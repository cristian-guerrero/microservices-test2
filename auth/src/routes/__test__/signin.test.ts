import request from 'supertest'
import app from '../../app'



it('Fails when a email that does not exist is supplied', async () => {

  await request (app).post('/api/users/signin')
  .send({
    email: 'test@tes.com',
    password: 'password'
  }).expect(400)

})

it('Fails when an incorrect password is supplied', async () => {

  await request (app).post('/api/users/signup')
  .send({
    email: 'test@tes.com',
    password: 'password'
  }).expect(201)

  await request (app).post('/api/users/signin')
  .send({
    email: 'test@tes.com',
    password: 'password2'
  }).expect(400)

})