


import buildClient from '../api/build-client'

/**
 * 
 */
const Index = ({ currentUser }) => {

  // console.log('In the Index component  -> ', currentUser)
  return currentUser ? <h1>You are signed in</h1> : <h1>You are Not signed in</h1>
}

/**
 * 
 * @param {*} context 
 */
Index.getInitialProps = async (context) => {

  console.log('Landing Page!')
  const { data } = await buildClient(context).get('/api/users/currentuser')

  return data
}

export default Index