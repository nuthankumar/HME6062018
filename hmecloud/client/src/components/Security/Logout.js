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
       this.props.history.push('/admin')
      }
      else{
        this.authService.clear()
        this.props.history.push('/')
      }
  
  }
  render() {
    return (<div/>
    )
  }

}

export default Logout
