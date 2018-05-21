import React, { Component } from 'react'
import './Stores.css'

import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'

class SystemStatus extends Component {
    constructor (props) {
        super(props)
        this.state = {
            showStores: this.props.showStores,
            currentLanguage: languageSettings.getCurrentLanguage(),
        }
        this.state.isMasterSettings =  window.location.pathname.indexOf("/masterSettings") !== -1  ? false : true;
    }
    
    componentWillMount () {
        
    }
    
    render () {
        const language = this.state.currentLanguage
        let displayData = this.props.systemStats
        return (
            <div class='sys-settings forms'>
                <div class='settings_plug clear'>
                    <div class="clear">			
			            <h3 class="clear system_header">{t[language].settingsStoresSystemStatus}</h3>
		            </div>
                    <table class="settab">
                        <tbody>
                            <tr>
                                <th><span>{t[language].settingsStoresSystemName}</span></th>
                                <td>ZOOM</td>
                            </tr>
                            <tr>
                                <th><span>{t[language].settingsStoresSystemVersion}</span></th>
                                <td>2.31.7</td>
                            </tr>
                            <tr>
                                <th><span>{t[language].settingsStoresSystemVersion}</span></th>
                                <td>A.2.31</td>
                            </tr>
                            
                            <tr>
                                <th><span>{t[language].settingsDevicesRegisteredToStoreInfo}</span></th>
                                <td>
                                    <ul>
                                        <li><a href="./?pg=SettingsStores&amp;st=Edit&amp;suid=5D8B2DED97894183927020E4CCB0700E">McDonald's - 3001</a></li>
                                        <li>,</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <th><span>{t[language].settingsDevicesLaneConfiguration}</span></th>
                                <td><span>Single Lane</span></td>
                            </tr>
                            <tr className = {(this.state.isMasterSettings?'':'hidden')}>
                                <th><span>{t[language].settingsStoresSerialNumber}</span></th>
                                <td>E07X0508</td>
                            </tr>
                            <tr className = {(this.state.isMasterSettings?'':'hidden')}>						
                                <th><span>{t[language].StoreSettingsHeaderStatus}</span></th>
                                <td>
                                    <img src="/images/connection_offline.png" class="cstat" alt="Device Offline"/><span class="cstat">Offline</span>
                                </td>
                            </tr>
                            <tr className = {(this.state.isMasterSettings?'':'hidden')}>
                                <th><span>{t[language].settingsDevicesFirstActivity}</span></th>
                                <td>February 23, 2018 14:51</td>
                            </tr>
                            <tr className = {(this.state.isMasterSettings?'':'hidden')}>
                                <th><span>{t[language].settingsDevicesLastActivity}</span></th>
                                <td>February 23, 2018 18:18 </td>
                            </tr>
                            <tr className = {(this.state.isMasterSettings?'':'hidden')}>
                                <th><span>{t[language].settingsDevicesNumberOfRecords}</span></th>
                                <td>207</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }




}

export default SystemStatus
