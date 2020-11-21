
import axios from 'axios'

/**
 * 
 */
const Index = ({currentUser}) => {

  console.log('In the Index component  -> ', currentUser)
  return <h1>Index page</h1>
}


Index.getInitialProps = async  () => {

  const response = await axios.get('/api/users/currentuser')
  console.log('on the server!')

  return response.data
}

export default Index