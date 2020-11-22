


import buildClient from '../api/build-client'

/**
 * 
 */
const Index = ({ currentUser }) => {

  console.log('In the Index component  -> ', currentUser)
  return <h1>Index page</h1>
}

/**
 * 
 * @param {*} context 
 */
Index.getInitialProps = async (context) => {

  const {data } = await buildClient(context).get('/api/users/currentuser')

  return data
}

export default Index