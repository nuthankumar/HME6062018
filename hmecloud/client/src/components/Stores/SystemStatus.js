import React, { Component } from 'react'
import './Stores.css'

import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'

class SystemStatus extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentLanguage: languageSettings.getCurrentLanguage(),
    }
  }

  render () {
    const language = this.state.currentLanguage
    let displayData = this.props.systemStats
    return (
      <div>
        <table class="settab">
            <tbody>
                <tr>
                    <th><span translate="" key="StoreSettingsHeaderName">System Name</span></th>
                    <td>ZOOM</td>
                </tr>
                <tr>
                    <th><span translate="" key="StoreSettingsHeaderVersion">System Version</span></th>
                    <td>2.31.7</td>
                </tr>
                <tr>
                    <th><span translate="" key="settingsDevicesSettingVersion">Settings Version</span></th>
                    <td>A.2.31</td>
                </tr>
                
                <tr>
                    <th><span translate="" key="settingsDevicesRegisteredToStoreInfo">Registered to Store Info</span></th>
                    <td>
                        <ul>
                            <li><a href="./?pg=SettingsStores&amp;st=Edit&amp;suid=5D8B2DED97894183927020E4CCB0700E">McDonald's - 3001</a></li>
                            <li></li>
                            <li>,</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <th><span translate="" key="settingsDevicesLaneConfiguration">Lane Configuration</span></th>
                    <td><span translate="" key="SingleLane">Single Lane</span></td>
                </tr>
                <tr>
                    <th><span translate="" key="settingsStoresSerialNumber">Serial Number</span></th>
                    <td>E07X0508</td>
                </tr>
                <tr>						
                    <th><span translate="" key="StoreSettingsHeaderStatus">System Status</span></th>
                    <td>
                        <img src="/images/connection_offline.png" class="cstat" alt="Device Offline"/><span class="cstat" translate="" key="settingsStoresOffline">Offline</span>
                    </td>
                </tr>
                <tr>
                    <th><span translate="" key="settingsDevicesFirstActivity">First Activity</span></th>
                    <td>February 23, 2018 14:51</td>
                </tr>
                <tr>
                    <th><span translate="" key="settingsDevicesLastActivity">Last Activity</span></th>
                    <td>February 23, 2018 18:18 </td>
                </tr>
                <tr>
                    <th><span translate="" key="settingsDevicesNumberOfRecords">Number of Records</span></th>
                    <td>207</td>
                </tr>
            </tbody>
        </table>
      </div>
    )
  }
}

export default SystemStatus
