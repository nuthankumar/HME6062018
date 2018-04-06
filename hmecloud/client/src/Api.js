import {Config} from './Config'

class Api {
  postData (url, data, callback) {
    fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'x-access-token': Config.token
    },
    body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then(callback)
    .catch((error) => {
      console.log(error)
    })
  }
  getData (url, callback) {
    fetch(url,{
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Config.token
        }
    })
    .then((response) => response.json())
    .then(callback)
    .catch((error) => {
      console.log(error)
    })
  }
  deleteData (url, callback) {
    fetch(url,{
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': Config.token
      }
    })
    .then((response) => response.json())
    .then(callback)
    .catch((error) => {
      console.log(error)
    })
  }
}


 export default Api;
