import axios from 'axios'

/**
 * 
 * @param {*} param0 
 */
const buildClient = ({req}) => {
  
  // console.log('build client----------------------------------------------------------')

  if( typeof window === 'undefined') {

    return axios.create({
      baseURL: 'http://ingress-nginx',
      headers: req.headers
    })
  }else  {
    return axios.create({
      baseURL: '',
    })
  }

}

export default buildClient