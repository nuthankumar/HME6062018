import { Config } from './Config'
/***
GET, POST and DELETE api methods to be called from different components across the application.
*/

class Api {

  /* Method for POST API calls */
  postData(url, data, callback) {
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

  /* Method for GET API calls */
  getData(url, callback) {
    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Config.ctxToken
        // 'x-access-token': Config.token
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
    fetch(url, {
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
