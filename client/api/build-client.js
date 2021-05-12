import axios from 'axios';

const Named = ({ req }) => {
  if (typeof window === 'undefined') {
    //we are on the server
    console.log('Server side called');
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx',
      headers: req.headers,
    });
  } else {
    //we are on the client
    return axios.create({
      baseURL: '/',
    });
  }
};

export default Named;
