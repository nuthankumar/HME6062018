import { Config } from './Config'
//import * as UserContext from '../src/components/Common/UserContext'
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
    // let token = UserContext.getToken()
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'x-access-token': token
        //'Authorization': 'Bearer ' + this.authService.getToken()
        'Authorization': 'Bearer ' + this.authService.getToken()
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
        //'Authorization': 'Bearer ' + this.authService.getToken()
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
    //let token = UserContext.getToken()
    fetch(url, {
      method: 'DELETE',
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


  deviceData(callback) {

    //let token = UserContext.getToken()
    return fetch('https://hme-dev-public-cloud-func.azurewebsites.net/api/store/getStore?suid=7F671C950B924E4CA61A5E7975765BB0', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      }
    })
      .then((response) =>  response.json())
      .then(callback)
      .catch((error) => {
        console.log(error)
      })
  }

  MergeStoreData(storeNumber,callback) {
    //let token = UserContext.getToken()
    return fetch('https://hme-dev-public-cloud-func.azurewebsites.net/api/store/getAllStores?isAdmin=1&criteria='+{storeNumber}+'&filter=Store_Number&psize=0&pno=0', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      }
    })
      .then((response) =>  response.json())
      .then(callback)
      .catch((error) => {
        console.log(error)
      })
  }
 
}

export default Api;
