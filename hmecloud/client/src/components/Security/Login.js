import React, { Component } from 'react'
import './Login.css'
import AuthenticationService from './AuthenticationService'

class Login extends Component {
  constructor () {
    super()
    this.handleChange = this.handleChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.Auth = new AuthenticationService()
  }
  componentWillMount () {
    if (this.Auth.loggedIn()) { this.props.history.replace('/') }
  }
  render () {
    return (
      <div className='center'>
        <div className='card'>
          <h1>Login</h1>
          <form onSubmit={this.handleFormSubmit}>
            <input
              className='form-item'
              placeholder='Username goes here...'
              name='username'
              type='text'
              onChange={this.handleChange}
            />
            <input
              className='form-item'
              placeholder='Password goes here...'
              name='password'
              type='password'
              onChange={this.handleChange}
            />
            <input
              className='form-submit'
              value='SUBMIT'
              type='submit'
            />
          </form>
        </div>
      </div>
    )
  }

  handleChange (e) {
    this.setState(
      {
        [e.target.name]: e.target.value
      }
    )
  }
  handleFormSubmit (e) {
    e.preventDefault()
    this.Auth.login(this.state.username, this.state.password)
      .then(token => {
        this.setState(
          {
            token: token
          })
        const url = 'http://localhost:3002/' + token
        // window.location.href('url');
        window.location.assign(url)
        this.props.history.replace(url)
      })
      .catch(err => {
        alert(err)
      })
  }
}

export default Login
