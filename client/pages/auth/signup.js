import { useState } from 'react'

import axios from 'axios'

import useRequest from '../../hooks/use-request'


const Signup = () => {

  const [email, setEmail] = useState('')
  const [password, setPasswor] = useState('')

  const {doRequest, errors} = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email, password
    }
  })

  const onSubmit = async (event) => {
    event.preventDefault()

    doRequest()

  }

  return <form onSubmit={onSubmit} >
    <h1>Sign Up</h1>
    <div className="form-group">
      <label>Email Addres</label>
      <input value={email} onChange={e => setEmail(e.target.value)}
        className="form-control" />
    </div>

    <div className="form-group">
      <label>Password</label>
      <input value={password} onChange={e => setPasswor(e.target.value)}
        type="password" className="form-control" />
    </div>

    {errors}
    <button className="btn btn-primary" >Sign Up</button>
  </form>
}

export default Signup

