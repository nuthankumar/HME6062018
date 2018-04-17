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
        this.state.url = this.authService.getColdFusionAppUrl(this.authService.isAdmin())
    }
    render() {
        const { language, token, url } = this.state;
        const { isAdmin, pathName, isLoggedIn } = this.props;
        return (
            <div className={"subMenu menuBar " + (isAdmin && isLoggedIn  ? 'show' : 'hidden')}>
                <ul>
                    <li><a className="headerMenu" href={url + "?pg=SettingsStores&amp;uuid=2IK3Z0P0GO2X1OLU60QCIILD3RJZK1XV&amp;path=Users&amp;token=" + token}>{t[language].stores}</a></li>
                    <li><a className="headerMenu" href={url + "?pg=SettingsUsers&amp;uuid=2IK3Z0P0GO2X1OLU60QCIILD3RJZK1XV&amp;path=Users&amp;token=" + token}>{t[language].users}</a></li>
                    <li><a className="headerMenu" href={url + "?pg=SettingsRoles&amp;uuid=2IK3Z0P0GO2X1OLU60QCIILD3RJZK1XV&amp;path=Users&amp;token=" + token}>{t[language].roles}</a></li>
                    <li><a className="headerMenu" href={url + "?pg=Dashboard&amp;uuid=2IK3Z0P0GO2X1OLU60QCIILD3RJZK1XV&amp;path=Users&amp;token=" + token}>{t[language].subNavbarDashboard}</a></li>
                    <li class="active_tab"><a className="active_tab headerMenu" href='/reports'>{t[language].navbarReports}</a></li>
                    <li><a className="headerMenu" href={url + "?pg=SettingsStores&amp;token=" + token}>{t[language].subNavbarDeviceSettingsHistory}</a></li>
                </ul>
            </div>
        )
    }
}
