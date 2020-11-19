import request from 'supertest'
import app from '../../app'

it('returns a 201 on successful signup', async () => {

  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'g@g.com',
      password: 'password'
    })
    .expect(201)
})

it('return a 400 with an invalid email', async () => {

  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'g@g_com',
      password: 'password'
    })
    .expect(400)
})

it('return a 400 with an invalid password ', async () => {

  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'g@g.com',
      password: 'pas'
    })
    .expect(400)
})


it('return a 400 with missing email and password ', async () => {

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com'
    })
    .expect(400)

  await request(app)
    .post('/api/users/signup')
    .send({
      password: '123456'
    })
    .expect(400)
})


it('Disallows duplcate emails ', async () => {


  await  request(app)
  .post('/api/users/signup')
  .send({
    email: 'g2@g.com',
    password: 'password'
  })
  .expect(201)

  await  request(app)
  .post('/api/users/signup')
  .send({
    email: 'g2@g.com',
    password: 'password'
  })
  .expect(400)

})