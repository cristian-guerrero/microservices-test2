// import buildClient from '../api/build-client'
import Link from 'next/link'
/**
 *
 */
const Index = ({currentUser, tickets}) => {

  const ticketList = tickets.map(t => {
    return <tr key={t.id}>
      <td>{t.title}</td>
      <td>{t.price}</td>
      <td>
        <Link href='/tickets/[ticketId]' as={`/tickets/${t.id}`}>
          <a >View</a>
        </Link>
      </td>
    </tr>
  })

  return <div>
    <h1>Tickets</h1>
    <table className={'table'}>
      <thead>
      <tr>
        <th>Title</th>
        <th>Price</th>
        <th>Link</th>
      </tr>
      </thead>
      <tbody>
      {ticketList}
      </tbody>
    </table>
  </div>
}

/**
 *
 * @param {*} context
 */
Index.getInitialProps = async (context, client, currentUser) => {

  /*
  console.log('Landing Page!')
  const { data } = await buildClient(context).get('/api/users/currentuser')

  return data

   */

  const {data} = await client.get('/api/tickets')
  return {tickets: data}
}

export default Index
