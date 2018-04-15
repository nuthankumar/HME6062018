import { Config } from './Config'
import * as UserContext from '../src/components/Common/UserContext'
/***
GET, POST and DELETE api methods to be called from different components across the application.
*/


class Api {
  /* Method for POST API calls */
    postData(url, data, callback) {

        let token = UserContext.getToken()
    fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
    },
    body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then(callback)
    .catch((error) => {
      console.log(error)
    })
  }

  /* Method for GET API calls */
    getData(url, callback) {

        let token = UserContext.getToken()
    fetch(url,{
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    })
    .then((response) => response.json())
    .then(callback)
    .catch((error) => {
      console.log(error)
    })
  }

  /* Method for POST API calls */
    deleteData(url, callback) {

        let token = UserContext.getToken()
    fetch(url,{
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
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
