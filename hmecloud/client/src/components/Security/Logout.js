import React, { Component } from 'react'
import AuthenticationService from './AuthenticationService'
import { Config } from '../../Config'

class Logout extends Component {
  constructor () {
    super()
    this.authService = new AuthenticationService(Config.authBaseUrl)
  }
  componentWillMount () {
    let isLoggedIn = this.authService.isLoggedIn()
    if (isLoggedIn) {
      if (this.authService.isAdmin()) {
        this.authService.clear()
        window.location.href = Config.adminColdFusionUrl + '?pg=Login'
      } else {
        this.authService.clear()
        //  this.props.history.push(Config.coldFusionUrl)
        window.location.href = Config.coldFusionUrl
      }
    } else {
      // console.log(document.referrer)
      // console.log(window.history.back())
      // window.history.back()
      window.location.href = Config.coldFusionUrl
    }
  }
  render () {
    return (<div />
    )
  }
}

export default Logout
