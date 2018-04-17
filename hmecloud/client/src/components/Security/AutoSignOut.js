import React, { Component } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
import './Login.css'
import * as UserContext from '../Common/UserContext'
import { Config } from '../../Config'

class AutoSignOut extends Component {
    constructor() {
        super(),

            this.state = {
                language: languageSettings.getCurrentLanguage(),
                token: UserContext.getToken()
            }
    }
    componentWillMount() {
    }

  


    notify = (Msg,e) => this.toastId = toast( Msg
    , { type: toast.TYPE.INFO, autoClose: false });

    render() {
        const { language, token } = this.state;
        const Msg = ({ closeToast }) => (
            <div>
                <div>You are currently viewing the site as another User </div>
                <div className="toastButtons">
                <button> <a className="black_link" href={Config.coldFusionUrl + "?pg=Logout&amp;token=" + token} onClick={this.logout.bind(this)}> {t[language].headerSignOut}</a></button>
                <button onClick={closeToast}>Continue </button>
                </div>
                </div>
        )

        return (
            <div>
                <a onClick={this.notify.bind(this,Msg)}>Timer</a>
                <ToastContainer autoClose={false} />
            </div>
        )
    }
    logout(e) {
        UserContext.clearToken();
    }
}

export default AutoSignOut
