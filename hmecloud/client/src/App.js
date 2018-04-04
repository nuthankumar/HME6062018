import React, { Component } from 'react'

import logo from './logo.svg'
import './App.css'
import AuthenticationService from './components/Security/AuthenticationService'
import authenticate from './components/Security/Authentication'
const authenticationService = new AuthenticationService()

class App extends Component {
  render() {
    return (
      <div className='App'>
        <div className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />

          <h2>Welcome {this.props.user.username}</h2>
          <a href='http://localhost:3002?token:++'>asd</a>
        </div>
        <p className='App-intro'>
          <button type='button' className='form-submit' onClick={this.handleLogout.bind(this)}>Logout</button>
        </p>
      </div>
    )
  }
  handleLogout() {
    authenticationService.logout()
    this.props.history.replace('/login')
  }
}

export default authenticate(App)
