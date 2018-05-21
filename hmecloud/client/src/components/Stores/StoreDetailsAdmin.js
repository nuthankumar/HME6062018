import React, { Component } from 'react';
import './Stores.css'

import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const Online = require("../../images/connection_online.png");
const Offline = require("../../images/connection_offline.png");


//export default class BookList extends Component {
class StoreDetail extends Component { //ensure you dont export component directly
    
    constructor (props) {
        super(props)
        this.state = {
          showStores: this.props.showStores,
          stores :{}
        }
        this.renderDevices = this.renderDevices.bind(this)
      }

    render() {
        return (
            <section className={"stores "+ (this.state.showStores? 'show':'hidden')}>
<div className="settings forms">
     <div class="settings_list">
				<div class="storesTable ctable">
					<table>
						<tbody><tr class="theader clear">
							<th></th>
							<th class="actcold"><a href="./?pg=SettingsStores&amp;sort=cnamed&amp;uuid=&amp;path=Main&amp;page=1&amp;search=00000159&amp;per=10&amp;filter=">Company Name</a></th>
							<th><a href="./?pg=SettingsStores&amp;sort=bbrand&amp;uuid=&amp;path=Main&amp;page=1&amp;search=00000159&amp;per=10&amp;filter=">Brand</a></th>
							<th><a href="./?pg=SettingsStores&amp;sort=sstord&amp;uuid=&amp;path=Main&amp;page=1&amp;search=00000159&amp;per=10&amp;filter=">Store #</a></th>
							<th><a href="./?pg=SettingsStores&amp;sort=sstord&amp;uuid=&amp;path=Main&amp;page=1&amp;search=00000159&amp;per=10&amp;filter=">Store Name</a></th>
							<th><a href="./?pg=SettingsStores&amp;sort=saddrd&amp;uuid=&amp;path=Main&amp;page=1&amp;search=00000159&amp;per=10&amp;filter=">Store Address</a></th>
							{/* style="width:100px;" */}
                            <th ><a href="./?pg=SettingsStores&amp;sort=dserd&amp;uuid=&amp;path=Main&amp;page=1&amp;search=00000159&amp;per=10&amp;filter=">Serial #</a></th>
							
							{/* style="width:80px;" */}
							<th ><a href="./?pg=SettingsStores&amp;sort=sfirmd&amp;uuid=&amp;path=Main&amp;page=1&amp;search=00000159&amp;per=10&amp;filter=">Version</a></th>
							<th><a href="./?pg=SettingsStores&amp;sort=subscd&amp;uuid=&amp;path=Main&amp;page=1&amp;search=00000159&amp;per=10&amp;filter=">Subscription</a></th>
							<th><a href="./?pg=SettingsStores&amp;sort=cstatd&amp;uuid=&amp;path=Main&amp;page=1&amp;search=00000159&amp;per=10&amp;filter=">Status</a></th>
						</tr> 
						{this.renderStores()}
					</tbody></table>
				</div>
					  	</div>
          </div>
            </section>
        );
    }


    renderDevices(devices){
        const {language} = this.state
        let deviceRows = devices.map(function (device, index) {
            return (  
                <tr key={index}>
                                <td>{device.Device_SerialNumber}</td>
                                <td>{device.Device_MainVersion}</td>
                                <td>{device.Subscription_Name}</td>
                                <td>
                                <img src={Online} className={"cstat "+(device.Device_IsActive?"":"hidden")} alt="Device Online"/>
                                <img src={Offline} className={"cstat "+(!device.Device_IsActive?"":"hidden")} alt="Device Offline"/>
                                <span className="cstat">
                                    <a href="http://uat.hmedtcloud.com/?pg=SettingsDevices&amp;st=connect&amp;duid=BCA09B13-D63D-4A3E-87F9-E4A53103259B&amp;Session_UID=TQFAOEWY4QR3AH7COYC1M0JTH9VE7QDO&amp;User_UID=L7KRDI112UNTP8P4PTA9XINT5PUY0R0U&amp;IsLoggedIn=1">{device.Device_IsActive  == 1 ?  (device.Device_Name +' '+ 'Online'): (device.Device_Name +' '+ 'Offline' )}</a>
                                    </span>
                                </td>
                </tr>
          )
        });
        return deviceRows;
    }

    renderStores(){
        const {stores, language} = this.state
        let self = this
        console.log(this.props.stores.adminStoreDetails);
        let storeRows = this.props.stores.adminStoreDetails.storeList.map(function (store, index) {
            return (  
            <tr class="tdata clear" key={index}>
                <td class="cdet store_checkbox"><input type="checkbox" name="edit_selected1" id="edit_selected1" onchange="addRemoveStores('F5EE2F75C7CE4725849E4B5626A888D9','1');" value="F5EE2F75C7CE4725849E4B5626A888D9" disabled="disabled"/></td>
                <td>{store.Company_Name} <br/><span class="edit_settings"><a href="#" class="opener view_details" onclick="passViewDetails('F5EE2F75C7CE4725849E4B5626A888D9','', '00000159', 'shomhme+serversplit19622@gmail.com', 'Wendy\'s', 'ZOOM');">View Details</a></span></td>
                <td>{store.Brand_Name}</td>
                <td>{store.Store_Number}</td>
                <td>{store.Store_Name}</td>
                <td>{store.Store_AddressLine1} </td>
                <td colspan="4">
                    <table>
                    <tbody>
                        {self.renderDevices(store.Device_Details)}
                    </tbody></table>
                </td>
            </tr>
       )
        });
        return storeRows;
    }


}

export default StoreDetail;

















