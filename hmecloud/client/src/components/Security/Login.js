import React, { Component } from 'react'
import './Login.css'
import AuthenticationService from './AuthenticationService'
import { Config } from '../../Config'
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
import { CommonConstants } from '../../Constants'
import * as UserContext from '../Common/UserContext'
import Api from '../../Api'

class Login extends Component {
  constructor () {
    super()
    this.handleChange = this.handleChange.bind(this)
    //this.handleFormSubmit = this.handleFormSubmit.bind(this)
    // this.Auth = new AuthenticationService()
    this.state = {
        language: languageSettings.getCurrentLanguage(),
        path:'', 
        username:'',
        password:''
     }
    this.api = new Api()
    this.authService = new AuthenticationService(Config.authBaseUrl)
  }
  componentWillMount () {
      //  if (this.Auth.loggedIn()) { this.props.history.replace('/') }
      console.log(UserContext.isLoggedIn());
      let isLoggedIn = UserContext.isLoggedIn() 

      if (isLoggedIn) 
      {
          this.props.history.push("/grouphierarchy");
      }

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
                                                      <td><input className='loginInputs' type="text" maxlength="100" name="username" onChange={this.handleChange.bind(this)}/></td>
                          	                    </tr>
                                          <tr>
                                            <th><label for="Password">{t[language].password}</label></th>
                                              <td><input className='loginInputs' type="password" maxlength="16" name="password" onChange={this.handleChange.bind(this)} />
		                                      </td>
	                                      </tr>
                                          <tr>
                                              <td></td>
                                              <td><span className="btn_login"><input type="submit" value={t[language].submitBtn} onClick={this.submit.bind(this)}/></span></td>
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




  submit (e) {
  

    e.preventDefault()
      console.log(this.state.username)
      console.log(this.state.password)
      let user= {
                "username": "nous-selva@hme.com",
                "password": "ChangeMe124!"
                }
          {/*
           let url = Config.apiBaseUrl + CommonConstants.apiUrls.auth
           this.api.postData(url, createTemplateData[0], data => {
                       localStorage.setItem("token", data.token);
                  //this.state.successMessage = data.data;
                  //this.state.errorMessage = "";
                  //this.setState(this.state);
                  //this.getSavedReports();
              }, error => {
                  //this.state.errorMessage = "ERROR";
                  //this.state.successMessage = "";
                  //this.setState(this.state);
              })
          */}

    let url = Config.apiBaseUrl + Config.tokenPath
    this.api.getData(url, data => {
        localStorage.setItem("token", data.token);
        this.authService.setToken(data.token, true)

        if (UserContext.isLoggedIn()) {
            let path = window.location.pathname;
            if (path == '/admin') {
                localStorage.setItem("isAdmin", true)
            } else {
                localStorage.setItem("isAdmin", false)
            } 
            this.props.history.push("/grouphierarchy");
        }
     })
  }
}

export default Login
