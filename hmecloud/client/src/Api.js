import { Config } from './Config'
import * as UserContext from '../src/components/Common/UserContext'
import AuthenticationService from './components/Security/AuthenticationService'
/***
GET, POST and DELETE api methods to be called from different components across the application.
*/


class Api {
  constructor() {
    this.authService = new AuthenticationService(Config.authBaseUrl)
  }
  /* Method for POST API calls */
  postData(url, data, callback) {
    console.log('data: ', data)
    // let token = UserContext.getToken()
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'x-access-token': token
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then(callback)
      .catch((error) => {
        console.log(error)
      })
      .then((response) => response.json())
      .then(callback)
      .catch((error) => {
        console.log(error)
      })
  }

  /* Method for GET API calls */
  getData(url, callback) {
    // let token = UserContext.getToken()
    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        // 'x-access-token': token
        'Authorization': 'Bearer ' + this.authService.getToken()
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
    fetch(url, {
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

  // verifyToken(token, cb) {
  //   fetch(`${Config.apiBaseUrl}${Config.tokenPath}`, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer ' + token
  //     }
  //   }).then(result => {
  //     console.log('result: ', result)
  //     return result.json()
  //   }).then(data =>{
  //     console.log('data: ', data)
  //     cb(data)
  //   })
  // }
}

export default Api;
