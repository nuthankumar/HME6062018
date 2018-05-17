import React, { Component } from 'react';
import './Systems.css'
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'


const Online = require("../../images/connection_online.png");
const Offline = require("../../images/connection_offline.png");

class Systems extends Component { //ensure you dont export component directly
    
    constructor (props) {
        super(props)
        this.state = {
          showStores: this.props.showStores,
          language: languageSettings.getCurrentLanguage(),
        }
      
    }
    
    
    render() {
        const { language } = this.state;
        return (
            <section className="systems">
                    <div className="settings forms">
                            <div className="settings_plug clear">
                                <div className="settings_search clear">
                                    <h3 className="clear">Systems</h3>
                                    <div> 
                                        <a href="./?pg=SettingsDevices&amp;st=odcsv"><span className="additem">Unregistered Systems</span></a>
                                    </div>
                                </div>
                                <div className="settings_list">
                                    <div className="ctable">
                                        <table>
                                            <tbody><tr className="theader clear">
                                                <th></th>
                                                <th className="actcold"><a href="./?pg=SettingsDevices&amp;sort=bbrand&amp;page=1&amp;search=&amp;per=10&amp;path=Main&amp;filter=">Brand</a></th>
                                                <th><a href="./?pg=SettingsDevices&amp;sort=sstord&amp;page=1&amp;search=&amp;per=10&amp;path=Main&amp;filter=">Store #</a></th>
                                                <th><a href="./?pg=SettingsDevices&amp;sort=ddevcd&amp;page=1&amp;search=&amp;per=10&amp;path=Main&amp;filter=">System</a></th>
                                                <th><a href="./?pg=SettingsDevices&amp;sort=sserld&amp;page=1&amp;search=&amp;per=10&amp;path=Main&amp;filter=">Serial #</a></th>
                                                <th><a href="./?pg=SettingsDevices&amp;sort=mversd&amp;page=1&amp;search=&amp;per=10&amp;path=Main&amp;filter=">Version</a></th>
                                                <th><a href="./?pg=SettingsDevices&amp;sort=sfirmd&amp;page=1&amp;search=&amp;per=10&amp;path=Main&amp;filter=">Settings Version</a></th>
                                                <th><a href="./?pg=SettingsDevices&amp;sort=lconfd&amp;page=1&amp;search=&amp;per=10&amp;path=Main&amp;filter=">Lane Config</a></th>
                                                <th><a href="./?pg=SettingsDevices&amp;sort=sstusd&amp;page=1&amp;search=&amp;per=10&amp;path=Main&amp;filter=">System Status</a></th>
                                            </tr> 
                                                <tr className="tdata clear">
                                                    <td className="cdet">N/A</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>CIB</td>
                                                    <td>-</td>
                                                    <td>2.00.19</td>
                                                    <td>A2.00.14</td>
                                                    <td></td>
                                                    <td>
                                                        <img src={Offline} className="cstat on_img_margin" alt="Device Offline"/><span className="cstat">Offline</span>
                                                    </td>
                                                </tr>
                                                <tr className="tdata clear">
                                                    <td className="cdet">N/A</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>CIB</td>
                                                    <td>-</td>
                                                    <td>2.00.22</td>
                                                    <td>A2.00.15</td>
                                                    <td></td>
                                                    <td>
                                                        <img src={Offline} className="cstat on_img_margin" alt="Device Offline"/><span className="cstat">Offline</span>
                                                    </td>
                                                    
                                                </tr>
                                                
                                             
                                                
                                        </tbody></table>
                                    </div>
                                </div>
                            </div>
                        </div>

            </section>



        );
    }
}

export default Systems;

















