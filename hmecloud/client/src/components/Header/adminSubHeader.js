import React from 'react'
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
import SettingService from '../Common/SettingService'
import NavigationServices from '../Common/NavigationServices'

export default class AdminSubHeader extends React.Component {
  constructor (props) {
    super(props)
    this.settings = new SettingService()
    this.navigation = new NavigationServices()
    this.state = {
      language: languageSettings.getCurrentLanguage()
    }
  }
  render () {
    const { language } = this.state
    if (this.settings.canShowAdminSubHeader()) {
      return (
        <div className='subMenu menuBar ' >
          <ul className='subHeaders'>
            <li><a className={'headerMenu ' + (window.location.pathname ? (window.location.pathname.indexOf('/stores') !== -1 ? 'active_tab_sub' : '') : '')} href={this.navigation.getUserStoresUrl()}>{t[language].stores}</a></li>
            <li><a className='headerMenu' href={this.navigation.getSelectedUserUrl()}>{t[language].users}</a></li>
            <li><a className='headerMenu' href={this.navigation.getUserRoleUrl()}>{t[language].roles}</a></li>
            <li><a className='headerMenu' href={this.navigation.getUserDashboardUrl()}>{t[language].subNavbarDashboard}</a></li>
            <li><a className={'headerMenu ' + (window.location.pathname ? (window.location.pathname.indexOf('/reports') !== -1 ? 'active_tab_sub' : '') : '')} href='/reports'>{t[language].navbarReports}</a></li>
            <li><a className='headerMenu' href={this.navigation.getDeviceSettingsHistoryUrl()}>{t[language].subNavbarDeviceSettingsHistory}</a></li>
          </ul>
        </div>

      )
    } else {
      return ''
    }
  }
}
