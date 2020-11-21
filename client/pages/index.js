
import axios from 'axios'

/**
 * 
 */
const Index = ({ currentUser }) => {

  console.log('In the Index component  -> ', currentUser)
  return <h1>Index page</h1>
}


Index.getInitialProps = async ({ req }) => {

  let response

  console.log('getInitialProps executed!')

  if (typeof window === 'undefined') {
    const { headers } = req
    // console.log(headers)
    response = await axios.get('htpp://ingress-nginx/api/users/currentuser', {
      headers: {
        // agregar este header para que ingress-ngix separa para donde va la petición
        // Host: 'ticketing.dev'
        // pasar todos los headers que llegan del navegador (incluida la cookie)
        ...headers
      }
    })
  } else {
    response = await axios.get('/api/users/currentuser')
  }
  return response.data
}

export default Index