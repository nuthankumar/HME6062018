import decode from 'jwt-decode'
import jwt from 'jsonwebtoken'
import {Config} from '../../Config'
import fetch from 'isomorphic-fetch'
import btoa from 'btoa'
// import crypto from 'crypto-js';
// import * as crypto from 'crypto-js';

// const crypto = require('crypto')

export default class AuthenticationService {
  // Initializing important variablescls

  constructor (domain) {
    this.domain = domain || Config.authUrl // API server domain
    this.fetch = this.fetch.bind(this) // React binding stuff
    this.login = this.login.bind(this)
    this.getProfile = this.getProfile.bind(this)
  }
  login (username, password) {
    const data = {
      name: 'Nandish',
      date: '03/21/2018',
      age: '27'
    }
    var encodedString = jwt.sign({ username: username, password: password, data: data }, 'super', {
      expiresIn: 5 // expires in 24 hours
    })
    console.log(encodedString)
    this.setToken(encodedString)
    // encodedString= crypto.createCipher("aes-256-ctr",'super').update(token,"utf-8","hex");
    encodedString = btoa(encodedString)
    return Promise.resolve(encodedString)

    // Get a token from api server using the fetch api
    // return this.fetch(`${this.domain}/login`, {
    //     method: 'POST',
    //     body: JSON.stringify({
    //         username,
    //         password
    //     })
    // }).then(res => {
    //     this.setToken(res.token) // Setting the token in localStorage
    //     return Promise.resolve(res);
    // })
  }

  loggedIn () {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken() // GEtting token from localstorage
    return !!token && !this.isTokenExpired(token) // handwaiving here
  }

  isTokenExpired (token) {
    try {
      const decoded = decode(token)
      if (decoded.exp < Date.now() / 1000) { // Checking if token is expired. N
        return true
      } else { return false }
    } catch (err) {
      return false
    }
  }

  setToken (idToken) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken)
  }

  getToken () {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token')
  }

  logout () {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token')
  }

  getProfile () {
    // Using jwt-decode npm package to decode the token
    return decode(this.getToken())
  }

  fetch (url, options) {
    // performs api calls sending the required authentication headers
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (this.loggedIn()) {
      headers['Authorization'] = 'Bearer ' + this.getToken()
    }

    return fetch(url, {
      headers,
      ...options
    })
      .then(this._checkStatus)
      .then(response => response.json())
  }

  _checkStatus (response) {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
      return response
    } else {
      var error = new Error(response.statusText)
      error.response = response
      throw error
    }
  }
}
