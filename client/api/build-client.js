import axios from 'axios'

/**
 * 
 * @param {*} param0 
 */
const buildClient = ({req}) => {

  if( typeof window === 'undefined') {

    return axios.create({
      baseURL: 'htpp://ingress-nginx',
      headers: req.headers
    })
  }else  {
    return axios.create({
      baseURL: '',
    })
  }

}

export default buildClient