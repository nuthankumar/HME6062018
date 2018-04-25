import React, { Component } from 'react'
import AuthenticationService from './AuthenticationService'
import { Config } from '../../Config'
//import AuthenticationService from '../../components/Common/UserContext'
import * as UserContext from '../Common/UserContext'

export default function authenticate (AuthenticationComponent) {
  // Code here now
  // const authenticationService = new AuthenticationService(Config.authUrl)

  return class AuthWrapped extends Component {
    constructor () {
      super()

      this.authService = new AuthenticationService(Config.authBaseUrl)

      this.state = {
          user: null,
          isLoggedIn: false
      }
    }

    componentWillMount() {
        if (!this.authService.isLoggedIn()) {
            this.props.history.replace('/')
            this.setState({ isLoggedIn : false})
        }

        else {
            this.setState({ isLoggedIn: true })
             }
    }
    render () {
        if (this.state.isLoggedIn) {
        return (
          <AuthenticationComponent history={this.props.history} user={this.state.user} />
        )
      } else {
        return null
      }
    }
  }
}
