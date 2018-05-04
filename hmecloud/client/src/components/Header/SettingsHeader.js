import React from 'react';
import { Link } from 'react-router-dom';
import t from '../Language/language';
import { Config } from '../../Config';
import * as languageSettings from '../Language/languageSettings';
import AuthenticationService from '../Security/AuthenticationService'
//import * as UserContext from '../Common/UserContext'

export default class SettingsHeader extends React.Component {
    constructor(props) {
        super(props)

        this.authService = new AuthenticationService(Config.authBaseUrl)
        this.state = {
            language: languageSettings.getCurrentLanguage(),
            token: this.authService.getToken()
        }
        this.state.url = this.authService.getColdFusionAppUrl(this.authService.isAdmin())
        let path = window.location.pathname;

        this.state.showSettings  = path ? (path.indexOf("/settings") !== -1? true : false): false;
    }
    render() {
        const { language, token, url, uuid } = this.state;
        if (!this.authService.isAdmin() && this.authService.isLoggedIn() && this.state.showSettings) {
            return (
                <div className="subMenu menuBar">
                    <ul>
                        <li><a className="headerMenu" href={url + "?pg=SettingsStores&token=" + token}>{t[language].stores}</a></li>
                        <li><a className={"headerMenu " + window.location.pathname ? (window.location.pathname.indexOf("/settings/users") !== -1 ? "active_tab" : '') : ''} href={url + "?pg=SettingsUsers&token=" + token}>{t[language].users}</a></li>
                        <li><a className="headerMenu" href={url + "?pg=SettingsRoles&token=" + token}>{t[language].roles}</a></li>
                    </ul>
                </div>
            )
        } else {
            return null;
        }
    }
}
