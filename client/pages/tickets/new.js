import {useState} from 'react'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

const NewTicket = () => {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')

  const { doRequest,errors} = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title, price
    },
    onSuccess: ticket => Router.push('/')

  })

  const onSubmit = event => {
    event.preventDefault()

    doRequest()
  }

  const onBlur = () => {
    const value = parseFloat(price)

    if (isNaN(value)) {
      return
    }

    setPrice(value.toFixed(2))
  }

  return <div>
    <h1>Create new ticket</h1>

    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="">Title</label>
        <input className={'form-control'} value={title} onChange={e => setTitle(e.target.value)} type="text"/>
      </div>
      <div className="form-group">
        <label htmlFor="">Price</label>
        <input className={'form-control'}
               onBlur={onBlur}
               value={price} onChange={e => setPrice(e.target.value)} type="text"/>
      </div>
      {errors}
      <button className="btn btn-primary">Submit</button>
    </form>
  </div>
}

export default NewTicket
