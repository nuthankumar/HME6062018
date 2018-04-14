import React from 'react';
import { Link } from 'react-router-dom';
import t from '../Language/language';
import { Config } from '../../Config';
import * as languageSettings from '../Language/languageSettings';

export default class AdminSubHeader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            language: languageSettings.getCurrentLanguage()
        }
    }
    render() {
        const { language } = this.state;
        const { isAdmin, pathName, isLogin} = this.props;
        return (
            <div className={"subMenu menuBar " + (isAdmin && !isLogin  ? 'show' : 'hidden')}>
                <ul>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?pg=SettingsStores&amp;uuid=2IK3Z0P0GO2X1OLU60QCIILD3RJZK1XV&amp;path=Users"}>{t[language].stores}</a></li>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?pg=SettingsUsers&amp;uuid=2IK3Z0P0GO2X1OLU60QCIILD3RJZK1XV&amp;path=Users"}>{t[language].users}</a></li>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?pg=SettingsRoles&amp;uuid=2IK3Z0P0GO2X1OLU60QCIILD3RJZK1XV&amp;path=Users"}>{t[language].roles}</a></li>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?pg=Dashboard&amp;uuid=2IK3Z0P0GO2X1OLU60QCIILD3RJZK1XV&amp;path=Users"}>{t[language].subNavbarDashboard}</a></li>
                    <li class="active_tab"><a className="active_tab headerMenu" href='/reports'>{t[language].navbarReports}</a></li>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?pg=SettingsStores"}>{t[language].subNavbarDeviceSettingsHistory}</a></li>
                </ul>
            </div>
        )
    }
}
