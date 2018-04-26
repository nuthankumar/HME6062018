import React from 'react';
import { Link } from 'react-router-dom';
import t from '../Language/language';
import { Config } from '../../Config';
import * as languageSettings from '../Language/languageSettings';
import AuthenticationService from '../Security/AuthenticationService'
import * as UserContext from '../Common/UserContext'


export default class MasqueradeHeader extends React.Component {
    constructor(props) {
        super(props)

        this.authService = new AuthenticationService(Config.authBaseUrl)
        this.state = {
            language: languageSettings.getCurrentLanguage(),
            token: this.authService.getToken(),
        }
        this.state.masquerade = this.authService.getIdToken()
        this.state.url = this.authService.getColdFusionAppUrl(this.authService.isAdmin())

    }
    render() {
        const { language, masquerade, url } = this.state;
        // let user = this.authService.getAdminProfile();
        let user = this.authService.getProfile();
        let userName = user.name ? user.name : user.User_FirstName + ' ' + user.User_LastName;
        if (this.authService.isMasquerade()) {
            //const { isAdministrator, viewAsUser } = this.props;
            return (
                <div className="view-as">
                    <button type="button" onClick={this.logout.bind(this)}>
                        <span> X </span>
                    </button>
                    <span>Currently Viewing As {userName}</span>
                </div>
            )
        } else {
            return (<span></span>)
        }
    }

    logout(e) {
        this.authService.clear()
        let url= Config.adminColdFusionUrl + "?token=" + this.state.masquerade
        window.location.href =url;
    }
}
