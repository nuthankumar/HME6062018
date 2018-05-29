import React, { Component } from 'react'
import './Stores.css'

import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
// const Online = require('../../images/connection_online.png')
const Offline = require('../../images/connection_offline.png')

class SystemStatus extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showStores: this.props.showStores,
      currentLanguage: languageSettings.getCurrentLanguage()
    }
    this.state.isMasterSettings = window.location.pathname.indexOf('/masterSettings') === -1
  }

  render () {
    const language = this.state.currentLanguage
    if (this.props.data !== undefined) {
      let displayData = this.props.data.systemStatus[0]
      return (
        <div class='system-settings-status clear'>
          <table class='system-status-table'>
            <tbody>
              <tr>
                <td colspan='2'>
                  <h3 class='clear system_header'>{t[language].settingsStoresSystemStatus}</h3>
                </td>
              </tr>
              <tr>
                <th><span>{t[language].settingsStoresSystemName}</span></th>
                <td>{}</td>
              </tr>
              <tr>
                <th><span>{t[language].settingsStoresSystemVersion}</span></th>
                <td>{displayData.Device_MainVersion}</td>
              </tr>
              <tr>
                <th><span>{t[language].settingsStoresSystemVersion}</span></th>
                <td>{displayData.Device_SettingVersion}</td>
              </tr>

              <tr>
                <th>{t[language].settingsDevicesRegisteredToStoreInfo}</th>
                <td>
                  <ul className='list-style-none registered-store-list'>
                    <li><a href='./?pg=SettingsStores&amp;st=Edit&amp;suid=5D8B2DED97894183927020E4CCB0700E' className='store-link'>{displayData.Store_Name} - {displayData.Store_Number}</a></li>
                    <li>{displayData.Store_AddressLine1}</li>
                    <li>{displayData.Store_Locality}, {displayData.Store_Region}</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <th><span>{t[language].settingsDevicesLaneConfiguration}</span></th>
                <td><span>Single Lane</span></td>
              </tr>
              <tr className={(this.state.isMasterSettings ? '' : 'hidden')}>
                <th><span>{t[language].settingsStoresSerialNumber}</span></th>
                <td>{displayData.Device_SerialNumber}</td>
              </tr>
              <tr className={(this.state.isMasterSettings ? '' : 'hidden')}>
                <th><span>{t[language].StoreSettingsHeaderStatus}</span></th>
                <td>
                  <img src={Offline} className='cstat on_img_margin' alt='Device Offline' /><span className='cstat'>Offline</span>
                </td>
              </tr>
              <tr className={(this.state.isMasterSettings ? '' : 'hidden')}>
                <th><span>{t[language].settingsDevicesFirstActivity}</span></th>
                <td>{displayData.Device_Created_DTS}</td>
              </tr>
              <tr className={(this.state.isMasterSettings ? '' : 'hidden')}>
                <th><span>{t[language].settingsDevicesLastActivity}</span></th>
                <td>{displayData.Device_LastMod_DTS}</td>
              </tr>
              <tr className={(this.state.isMasterSettings ? '' : 'hidden')}>
                <th><span>{t[language].settingsDevicesNumberOfRecords}</span></th>
                <td>207</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    }
  }
}

export default SystemStatus
