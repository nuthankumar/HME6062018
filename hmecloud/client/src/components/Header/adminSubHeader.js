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
        const { isAdmin, pathName } = this.props;
        return (
            <div className={"subMenu menuBar " + (isAdmin && pathName == '/reports' ? 'show' : 'hidden')}>
                <ul>
                    <li><a className="headerMenu" href={Config.coldFusionUrl}>{t[language].subNavbarStores}</a></li>
                    <li id="zoomLabel"><a className="headerMenu" href={Config.coldFusionUrl + "?pg=Dashboards"}>{t[language].subNavbarUsers}</a></li>
                    <li id="zoomLabel"><Link className="headerMenu" to='/reports'>{t[language].subNavbarRoles}</Link></li>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?pg=SettingsAccount"}>{t[language].subNavbarDashboard}</a></li>
                    <li><a className="active_tab headerMenu" href={Config.coldFusionUrl + "?pg=SettingsStores"}>{t[language].subNavbarReports}</a></li>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?pg=SettingsStores"}>{t[language].subNavbarDeviceSettingsHistory}</a></li>
                </ul>
            </div>
        )
    }
}
