import React from 'react';
import { Link } from 'react-router-dom';
import t from '../Language/language';
import * as languageSettings from '../Language/languageSettings';
import SettingService from "../Common/SettingService";
import NavigationServices from "../Common/NavigationServices";

//import * as UserContext from '../Common/UserContext'

export default class AdminSubHeader extends React.Component {
    constructor(props) {
        super(props)
        this.settings = new SettingService()
        this.navigation = new NavigationServices();
        this.state = {
            language: languageSettings.getCurrentLanguage()
        }
    }
    render() {
        const { language } = this.state;
        if (this.settings.canShowAdminSubHeader()) {
            return (
                <div className="subMenu menuBar " >
                    <ul>
                        <li><a className="headerMenu" href={this.navigation.getUserStoresUrl()}>{t[language].stores}</a></li>
                        <li><a className="headerMenu" href={this.navigation.getSelectedUserUrl()}>{t[language].users}</a></li>
                        <li><a className="headerMenu" href={this.navigation.getUserRoleUrl()}>{t[language].roles}</a></li>
                        <li><a className="headerMenu" href={this.navigation.getUserDashboardUrl()}>{t[language].subNavbarDashboard}</a></li>
                        <li class="active_tab"><a className="active_tab headerMenu" href='/reports'>{t[language].navbarReports}</a></li>
                        <li><a className="headerMenu" href={this.navigation.getDeviceSettingsHistoryUrl()}>{t[language].subNavbarDeviceSettingsHistory}</a></li>
                    </ul>
                </div>

            )
        } else {
            return "";
        }
    }
}
