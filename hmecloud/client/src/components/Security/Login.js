import React, { Component } from 'react'
import './Login.css'
import AuthenticationService from './AuthenticationService'
import { Config } from '../../Config'
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'

class Login extends Component {
  constructor () {
    super()
    this.handleChange = this.handleChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.Auth = new AuthenticationService()
    this.state = {
        language: languageSettings.getCurrentLanguage(),
     }
  }
  componentWillMount () {
    if (this.Auth.loggedIn()) { this.props.history.replace('/') }
  }
  render() {

    const { language, showSubMenu } = this.state;
    return (
      <div>
        <div>
          <div id="Content">
              <div className="col1">
                        <div className="forms clear">
                                   <form action="./?pg=Login&amp;st=Validate" method="post">
                                        <table className="user_login">
                                            <tbody>
                                                <tr>
                                            <th><label for="Username">{t[language].username}</label></th>
                                                      <td><input className='loginInputs' type="text" maxlength="100" name="Username" value=""/></td>
                          	                    </tr>
                                          <tr>
                                            <th><label for="Password">{t[language].password}</label></th>
                                              <td><input className='loginInputs' type="password" maxlength="16" name="Password" value=""/>
		                                      </td>
	                                      </tr>
                                          <tr>
                                              <td></td>
                                              <td><span className="btn_login"><input type="submit" value={t[language].submitBtn}/></span></td>
	                                      </tr>
                                                </tbody>
                                            </table>
                                  </form>
                                   <h5 className="forgot_up"><a href="/?pg=ManageAccount&amp;st=rq">{t[language].forgotpass}</a></h5>
                                   </div>
                                 </div>
                    </div>
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
        const url = Config.jwtUrl + token
        // window.location.href('url');
        window.location.assign(url)
        this.props.history.replace(url)
      })
      .catch(err => {
        console.log(err)
      })
  }
}

export default Login
