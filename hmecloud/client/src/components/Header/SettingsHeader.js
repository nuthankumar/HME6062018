import React from 'react';
import { Link } from 'react-router-dom';
import t from '../Language/language';
import { Config } from '../../Config';
import * as languageSettings from '../Language/languageSettings';
import AuthenticationService from '../Security/AuthenticationService'
import * as UserContext from '../Common/UserContext'

export default class SettingsHeader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            language: languageSettings.getCurrentLanguage(),
            token: UserContext.getToken()
        }
        this.authService = new AuthenticationService(Config.authBaseUrl)
       // this.state.uuid = this.authService.getUUID()
        this.state.url = this.authService.getColdFusionAppUrl(UserContext.isAdmin())
    }
    render() {
        const { language, token, url, uuid } = this.state;
        const { isLoggedIn } = this.props;
        return (
            <div className={"subMenu menuBar " + (isLoggedIn ? 'show' : 'hidden')}>
                <ul>
                    <li><a className="headerMenu" href={url + "?pg=SettingsStores?token=" + token}>{t[language].stores}</a></li>
                    <li class="active_tab"><a className="headerMenu" href={ url + "?pg=SettingsUsers?token=" + token }>{t[language].users}</a></li>
                    <li><a className="headerMenu" href={url + "?pg=SettingsRoles?token=" + token}>{t[language].roles}</a></li>
                </ul>
            </div>
        )
    }
}
