import React from 'react';
import { Link } from 'react-router-dom';
import t from '../Language/language';
import { Config } from '../../Config';
import * as languageSettings from '../Language/languageSettings';
import AuthenticationService from '../Security/AuthenticationService'
import * as UserContext from '../Common/UserContext'

export default class AdminSubHeader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            language: languageSettings.getCurrentLanguage(),
            token: UserContext.getToken()
        }
        this.authService = new AuthenticationService(Config.authBaseUrl)
        this.state.uuid = this.authService.getUUID()
        this.state.url = this.authService.getColdFusionAppUrl(UserContext.isAdmin())
    }
    render() {
        const { language, token, url, uuid } = this.state;
        const { isAdmin, pathName, isLoggedIn } = this.props;
        return (
            <div className={"subMenu menuBar " + (isAdmin && isLoggedIn  ? 'show' : 'hidden')}>
                <ul>
                    <li><a className="headerMenu" href={uuid ? (url + "?pg=SettingsStores&uuid=" + uuid + "&path=Users&token=" + token) : ( url + "?pg=SettingsStores&path=Users&token=" + token ) }>{t[language].stores}</a></li>
                    <li><a className="headerMenu" href={uuid ? (url + "?pg=SettingsUsers&uuid=" + uuid + "&path=Users&token=" + token) : (url + "?pg=SettingsUsers&path=Users&token=" + token)}>{t[language].users}</a></li>
                    <li><a className="headerMenu" href={uuid ? (url + "?pg=SettingsRoles&uuid=" + uuid + "&path=Users&token=" + token) : (url + "?pg=SettingsRoles&path=Users&token=" + token)}>{t[language].roles}</a></li>
                    <li><a className="headerMenu" href={uuid ? (url + "?pg=Dashboard&uuid=" + uuid + "&path=Users&token=" + token) : (url + "?pg=Dashboard&path=Users&token=" + token)}>{t[language].subNavbarDashboard}</a></li>
                    <li class="active_tab"><a className="active_tab headerMenu" href='/reports'>{t[language].navbarReports}</a></li>
                    <li><a className="headerMenu" href={uuid ? (url + "?pg=SettingsStores&uuid=" + uuid + "&token=" + token) : (url + "?pg=SettingsStores&token=" + token)}>{t[language].subNavbarDeviceSettingsHistory}</a></li>
                </ul>
            </div>
        )
    }
}
