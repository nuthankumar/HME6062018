import React from 'react';
import { Link } from 'react-router-dom';
import t from '../Language/language';
import { Config } from '../../Config';
import * as languageSettings from '../Language/languageSettings';
import * as UserContext from '../Common/UserContext'

export default class AdminSubHeader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            language: languageSettings.getCurrentLanguage(),
            token: UserContext.getToken()
        }
    }
    render() {
        const { language, token } = this.state;
        const { isAdmin, pathName, isLoggedIn } = this.props;
        return (
            <div className={"subMenu menuBar " + (isAdmin && isLoggedIn  ? 'show' : 'hidden')}>
                <ul>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?pg=SettingsStores&amp;uuid=2IK3Z0P0GO2X1OLU60QCIILD3RJZK1XV&amp;path=Users;token=" + token}>{t[language].stores}</a></li>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?pg=SettingsUsers&amp;uuid=2IK3Z0P0GO2X1OLU60QCIILD3RJZK1XV&amp;path=Users;token=" + token}>{t[language].users}</a></li>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?pg=SettingsRoles&amp;uuid=2IK3Z0P0GO2X1OLU60QCIILD3RJZK1XV&amp;path=Users;token=" + token}>{t[language].roles}</a></li>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?pg=Dashboard&amp;uuid=2IK3Z0P0GO2X1OLU60QCIILD3RJZK1XV&amp;path=Users;token=" + token}>{t[language].subNavbarDashboard}</a></li>
                    <li class="active_tab"><a className="active_tab headerMenu" href='/reports'>{t[language].navbarReports}</a></li>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?pg=SettingsStores;token=" + token}>{t[language].subNavbarDeviceSettingsHistory}</a></li>
                </ul>
            </div>
        )
    }
}
