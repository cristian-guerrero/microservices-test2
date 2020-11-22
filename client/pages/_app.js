import 'bootstrap/dist/css/bootstrap.css'

import buildClient from '../api/build-client'


const AppComponent = ({ Component, pageProps , currentUser}) => {

  console.log(currentUser)

  return <div>
    <h1>User: {currentUser.email}</h1>
<Component {...pageProps} />
  </div> 
}


AppComponent.getInitialProps = async (appContext) => {

  const client = buildClient(appContext.ctx)
  const { data } = await client.get('/api/users/currentuser')

  let pageProps = {}
  if(appContext.Component.getInitialProps) {
    // ejecutar manualmente getInitialProps de los componentes
     pageProps = await appContext.Component.getInitialProps(appContext.ctx) 
  }


  return {
    pageProps,
    ...data
  }
}



export default AppComponent

