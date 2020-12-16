


const OrderIndex = ({orders }) => {


  return <div>
    <ul>
      {orders.map(x => {
        return <li key={x.id}>
          {x.ticket.title} - {x.status}
        </li>
      })}
    </ul>
  </div>
}


OrderIndex.getInitialProps = async (context, client ) => {

  const { data } = await client.get('/api/orders')

  return {orders: data}

}


export default  OrderIndex
