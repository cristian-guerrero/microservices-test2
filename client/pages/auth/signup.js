import { useState } from 'react'

import axios from 'axios'

const Signup = () => {

  const [email, setEmail] = useState('')
  const [password, setPasswor] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()

    
    const response = await axios.post('/api/users/signup', {
      email, password
    })
    
    console.log(response)

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
    <button className="btn btn-primary" >Sign Up</button>
  </form>
}

export default Signup