import React, { Component } from 'react';
import './Stores.css'

import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
const Online = require("../../images/connection_online.png");
const Offline = require("../../images/connection_offline.png");
//export default class BookList extends Component {
class StoreDetail extends Component { //ensure you dont export component directly
    
    constructor (props) {
        super(props)
        this.state = {
          showStores: this.props.showStores,
          currentLanguage: languageSettings.getCurrentLanguage(),
        }
      
    }
    
    
    render() {
    console.log(this.props.showStores);
   
    const language = this.state.language
   
   
   
    return (
            <section className={"stores "+ (this.state.showStores? 'show':'hidden')}>
<div className="settings forms">
    <div className="settings_plug clear">
      <div className="settings_search clear">
         <h3 className="clear">{t[language].storeListStores}</h3>
         <div>
            <a href="./?pg=SettingsGroups"><span className="additem"><span>{t[language].manageleaderboardgroups}</span></span></a>
            <a href="http://hme-uat-dtcloud-app.azurewebsites.net/grouphierarchy?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyX0lEIjoxNDQ0NSwiVXNlcl9VSUQiOiJMN0tSREkxMTJVTlRQOFA0UFRBOVhJTlQ1UFVZMFIwVSIsIlVzZXJfT3duZXJBY2NvdW50X0lEIjoyNTY1LCJVc2VyX0NvbXBhbnlfSUQiOjI2MjAsIlVzZXJfRW1haWxBZGRyZXNzIjoic2VsdmVuZHJhbmtAbm91c2luZm8uY29tIiwiVXNlcl9GaXJzdE5hbWUiOiJTZWx2ZW5kcmFuIiwiVXNlcl9MYXN0TmFtZSI6IkthbmRhc2FteSIsIlVzZXJfSXNBY3RpdmUiOjEsIlVzZXJfSXNWZXJpZmllZCI6MSwiSXNBY2NvdW50T3duZXIiOjEsImlhdCI6MTUyNTc4NDczMywiZXhwIjoxNTI1ODcxMTMzfQ.GlqvRH-UlYkT8yDGLDdRI7YWSHUgbD2hknR5Ls19SeQ"><span className="additem"><span>{t[language].managereportgroups}</span></span></a>
         </div>
      </div>
   </div> 
   <div className="settings_list">
      <div className="storesTable ctable">
         <table>
            <tbody>
               <tr className="theader clear">
                  <th>&nbsp;</th>
                  <th id="brand_space" className="actcold"><a href="./?pg=SettingsStores&amp;sort=bbrand"><span>{t[language].StoreSettingsHeaderBrand}</span></a></th>
                  <th><a href="./?pg=SettingsStores&amp;sort=sstord"><span>{t[language].StoreSettingsHeaderStore}</span></a></th>
                  <th><a href="./?pg=SettingsStores&amp;sort=saddrd"><span>{t[language].StoreSettingsHeaderAddress}</span></a></th>
                  <th><a href="./?pg=SettingsStores&amp;sort=slocld"><span>{t[language].StoreSettingsHeaderCityState}</span></a></th>
                  <th><a href="./?pg=SettingsStores&amp;sort=sgroupd"><span>{t[language].StoreSettingsLeaderboardGroup}</span></a></th>
                  <th><a href="./?pg=SettingsStores&amp;sort=sgroupd"><span>{t[language].StoreSettingsReportGroup}</span></a></th>
                  <th><a href="./?pg=SettingsStores&amp;sort=ddevcd"><span>{t[language].StoreSettingsHeaderName}</span></a></th>
                  <th><a href="./?pg=SettingsStores&amp;sort=sfirmd"><span>{t[language].StoreSettingsHeaderVersion}</span></a></th>
                  <th><a href="./?pg=SettingsStores&amp;sort=cstatd"><span>{t[language].StoreSettingsHeaderStatus}</span></a></th>
               </tr>
               <tr className="tdata clear">
                  <td><a href="#" className="opener view_details" onclick="passViewDetails('F08E66EEBCAE429988C90D9167CFD716','22222', 'selvendrank@nousinfo.com', 'McDonald\'s', 'ZOOM');"><span translate="" key="viewedit">View/Edit</span> <br/><span translate="" key="settingsStoresDetails">{t[language].settingsStoresDetails}</span></a></td>
                  <td>McDonald's</td>
                  <td>22222</td>
                  <td></td>
                  <td>, </td>
                  <td>Drive-Thru</td>
                  <td></td>
                  <td colspan="6">
                     <table>
                        <tbody>
                           <tr>
                              <td width="90">ZOOM</td>
                              <td width="110">3.10.18</td>
                              <td width="100"><img src={Online} className="cstat" alt="Device Online"/><span className="cstat">
                                 <a href="http://uat.hmedtcloud.com/?pg=SettingsDevices&amp;st=connect&amp;duid=BCA09B13-D63D-4A3E-87F9-E4A53103259B&amp;Session_UID=TQFAOEWY4QR3AH7COYC1M0JTH9VE7QDO&amp;User_UID=L7KRDI112UNTP8P4PTA9XINT5PUY0R0U&amp;IsLoggedIn=1">{t[language].settingsStoresOnline}</a>
                                 </span>
                              </td>
                           </tr>
                        </tbody>
                     </table>
                  </td>
               </tr>
               <tr className="tdata clear">
                  <td ><a href="#" className="opener view_details" onclick="passViewDetails('C4B69E00D6E24FEFBA732054610EB191','00003006', 'selvendrank@nousinfo.com', 'Wendy\'s', 'ZOOM');"><span translate="" key="viewedit">View/Edit</span> <br/><span translate="" key="settingsStoresDetails">{t[language].settingsStoresDetails}</span></a></td>
                  <td>Wendy's</td>
                  <td>00003006</td>
                  <td>14110 Stowe Dr</td>
                  <td>Poway, CA</td>
                  <td>Drive-Thru</td>
                  <td></td>
                  <td colspan="6">
                     <table>
                        <tbody>
                           <tr>
                              <td width="90">ZOOM</td>
                              <td width="110">2.31.7.999</td>
                              <td width="100"><img src={Online} className="cstat" alt="Device Online"/><span className="cstat">
                                 <a href="http://uat.hmedtcloud.com/?pg=SettingsDevices&amp;st=connect&amp;duid=781F22B8-C843-4244-9824-04C4BC1C78D8&amp;Session_UID=TQFAOEWY4QR3AH7COYC1M0JTH9VE7QDO&amp;User_UID=L7KRDI112UNTP8P4PTA9XINT5PUY0R0U&amp;IsLoggedIn=1" translate="" key="settingsStoresOnline">{t[language].settingsStoresOnline}</a>
                                 </span>
                              </td>
                           </tr>
                        </tbody>
                     </table>
                  </td>
               </tr>
            </tbody>
         </table>
      </div>
   </div>
</div>


            </section>



        );
    }
}

export default StoreDetail;

















