import request from 'supertest';
import app from '../../app';
import { signupTest } from '../../test/signup';

it('responds with details about the current user', async ( ) => {

  const cookie = await signupTest()

  const response = await request(app)
  .get('/api/users/currentuser')
  .set('Cookie', cookie)
  .send()
  .expect(200)

  // console.log(response.body)

  expect(response.body.currentUser.email).toEqual('test@test.com')

})