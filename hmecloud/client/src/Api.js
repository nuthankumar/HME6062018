import { Config } from './Config'
<<<<<<< HEAD
=======
import * as UserContext from '../src/components/Common/UserContext'
>>>>>>> 156d6f54c0d11a20ae12a259971c0c5c6ac56166
/***
GET, POST and DELETE api methods to be called from different components across the application.
*/


class Api {
  /* Method for POST API calls */
<<<<<<< HEAD
  postData(url, data, callback) {
=======
    postData(url, data, callback) {

        let token = UserContext.getToken()
>>>>>>> 156d6f54c0d11a20ae12a259971c0c5c6ac56166
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
<<<<<<< HEAD
        'x-access-token': Config.token
      },
      body: JSON.stringify(data)
=======
        'x-access-token': token
    },
    body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then(callback)
    .catch((error) => {
      console.log(error)
>>>>>>> 156d6f54c0d11a20ae12a259971c0c5c6ac56166
    })
      .then((response) => response.json())
      .then(callback)
      .catch((error) => {
        console.log(error)
      })
  }

  /* Method for GET API calls */
<<<<<<< HEAD
  getData(url, callback) {
    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Config.ctxToken
        // 'x-access-token': Config.token
      }
=======
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
>>>>>>> 156d6f54c0d11a20ae12a259971c0c5c6ac56166
    })
      .then((response) => response.json())
      .then(callback)
      .catch((error) => {
        console.log(error)
      })
  }

  /* Method for POST API calls */
<<<<<<< HEAD
  deleteData(url, callback) {
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': Config.token
=======
    deleteData(url, callback) {

        let token = UserContext.getToken()
    fetch(url,{
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
>>>>>>> 156d6f54c0d11a20ae12a259971c0c5c6ac56166
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
