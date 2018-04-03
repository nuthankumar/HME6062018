import React, { Component } from 'react'
import AuthenticationService from './AuthenticationService'

export default function authenticate (AuthenticationComponent) {
  // Code here now
  const authenticationService = new AuthenticationService('http://localhost:8080')

  return class AuthWrapped extends Component {
    constructor () {
      super()
      this.state = {
        user: null
      }
    }

    componentWillMount () {
      if (!authenticationService.loggedIn()) {
        this.props.history.replace('/login')
      } else {
        try {
          const profile = authenticationService.getProfile()
          this.setState({
            user: profile
          })
        } catch (err) {
          authenticationService.logout()
          this.props.history.replace('/login')
        }
      }
    }
    render () {
      if (this.state.user) {
        return (
          <AuthenticationComponent history={this.props.history} user={this.state.user} />
        )
      } else {
        return null
      }
    }
  }
}
