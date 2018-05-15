import React, { Component } from 'react'
import AuthenticationService from './AuthenticationService'
import { Config } from '../../Config'

class Logout extends Component {
  constructor() {
    super()
    this.authService = new AuthenticationService(Config.authBaseUrl)
  }
  componentWillMount() {
      if(this.authService.isAdmin()){
       this.authService.clear()
       window.location.href = Config.adminColdFusionUrl + '/admin'
      }
      else{
       this.authService.clear()
     //  this.props.history.push(Config.coldFusionUrl)
     window.location.href = Config.coldFusionUrl
    }
  }
  render() {
    return (<div/>
    )
  }

}

export default Logout
