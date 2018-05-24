import React from 'react'
import "../Alerts/Alerts.css";
import Footer from "../Footer/Footer";
import HmeHeader from "../Header/HmeHeader";
import { Config } from '../../Config'
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
import AuthenticationService from '../Security/AuthenticationService'

export default class EmailAlert extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentLanguage: languageSettings.getCurrentLanguage(),
            emailId: this.props.history.location.state
        }
        this.authService = new AuthenticationService(Config.authBaseUrl)
    }
    render() {
        const language = this.state.currentLanguage
        let user = this.authService.isAdmin() ? this.authService.getAdminProfile() : this.authService.getProfile();
        let emailId =  user.User_EmailAddress? user.User_EmailAddress : user.unique_name;
        return (
            <section>
                    <div id="Content">
                            <div class="forms clear">
                        <div class="appr">
                            <h4>{t[language].pleasecheckemailreport} {emailId}.</h4>
                                </div>
                            </div>
                    </div>
                </section>
            )
    }
}
