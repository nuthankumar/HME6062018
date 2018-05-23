import React, { Component } from 'react';
import './Stores.css'

import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as storesFunctions from "../../actions/stores";
const Online = require("../../images/connection_online.png");
const Offline = require("../../images/connection_offline.png");


//export default class BookList extends Component {
class StoreDetail extends Component { //ensure you dont export component directly

    constructor(props) {
        super(props)
        this.state = {
            showStores: this.props.showStores,
            stores: {},
            Ascending:true
        }
        this.renderDevices = this.renderDevices.bind(this)
    }

    componentWillMount() {
       this.props.dispatch(storesFunctions.sortStores({ 'sortBy': 'Company_Name', 'sortType': 'DESC' }))
    }


    render() {
        let sortParams = this.props.storesDetails.sortParams ? this.props.storesDetails.sortParams :  { 'sortBy': 'Brand_Name', 'sortType': 'DESC' }
     
        return (
            <section className={"stores " + (this.state.showStores ? 'show' : 'hidden')}>
                <div className="settings forms">
                    <div class="settings_list">
                        <div class="storesTable ctable">
                            <table>
                                <tbody><tr class="theader clear">
                                    <th></th>
                                    <th className={(sortParams.sortBy == 'Company_Name' && sortParams.sortType == 'ASC')?'actcol':((sortParams.sortBy == 'Company_Name' && sortParams.sortType == 'DESC')?'actcold':'')}><a><span id="Company_Name" onClick={this.sortStores.bind(this)}>Company Name</span></a></th>
                                    <th className={(sortParams.sortBy == 'Brand_Name' && sortParams.sortType == 'ASC')?'actcol':((sortParams.sortBy == 'Brand_Name' && sortParams.sortType == 'DESC')?'actcold':'')}><a><span id="Brand_Name" onClick={this.sortStores.bind(this)}>Brand</span></a></th>
                                    <th className={(sortParams.sortBy == 'Store_Number' && sortParams.sortType == 'ASC')?'actcol':((sortParams.sortBy == 'Store_Number' && sortParams.sortType == 'DESC')?'actcold':'')}><a> <span id="Store_Number" onClick={this.sortStores.bind(this)}>Store #</span></a></th>
                                    <th className={(sortParams.sortBy == 'Store_Name' && sortParams.sortType == 'ASC')?'actcol':((sortParams.sortBy == 'Store_Name' && sortParams.sortType == 'DESC')?'actcold':'')}><a><span id="Store_Name" onClick={this.sortStores.bind(this)}>Store Name</span></a></th>
                                    <th className={(sortParams.sortBy == 'Store_AddressLine1' && sortParams.sortType == 'ASC')?'actcol':((sortParams.sortBy == 'Store_AddressLine1' && sortParams.sortType == 'DESC')?'actcold':'')}><a> <span id="Store_AddressLine1" onClick={this.sortStores.bind(this)}>Store Address</span></a></th>
                                    {/* style="width:100px;" */}
                                    <th className={(sortParams.sortBy == 'Device_SerialNumber' && sortParams.sortType == 'ASC')?'actcol':((sortParams.sortBy == 'Device_SerialNumber' && sortParams.sortType == 'DESC')?'actcold':'')}><a> <span id="Device_SerialNumber" onClick={this.sortStores.bind(this)}>Serial #</span></a></th>
                                    <th className={(sortParams.sortBy == 'Device_MainVersion' && sortParams.sortType == 'ASC')?'actcol':((sortParams.sortBy == 'Device_MainVersion' && sortParams.sortType == 'DESC')?'actcold':'')}><a> <span id="Device_MainVersion" onClick={this.sortStores.bind(this)}>Version</span></a></th>
                                    <th className={(sortParams.sortBy == 'Subscription_Name' && sortParams.sortType == 'ASC')?'actcol':((sortParams.sortBy == 'Subscription_Name' && sortParams.sortType == 'DESC')?'actcold':'')}><a> <span id="Subscription_Name" onClick={this.sortStores.bind(this)}>Subscription</span></a></th>
                                    <th className={(sortParams.sortBy == 'Device_IsActive' && sortParams.sortType == 'ASC')?'actcol':((sortParams.sortBy == 'Device_IsActive' && sortParams.sortType == 'DESC')?'actcold':'')}><a> <span id="Device_IsActive" onClick={this.sortStores.bind(this)}>Status</span></a></th>
                                </tr>
                                    {this.renderStores()}
                                </tbody></table>
                        </div>
                        
                    </div>
                </div>
            </section>
        );
    }


    renderDevices(devices) {
        const { language } = this.state
        let deviceRows = devices.map(function (device, index) {
            return (
                <tr key={index}>
                    <td>{device.Device_SerialNumber}</td>
                    <td>{device.Device_MainVersion}</td>
                    <td>{device.Subscription_Name}</td>
                    <td>
                        <img src={Online} className={"cstat " + (device.Device_IsActive ? "" : "hidden")} alt="Device Online" />
                        <img src={Offline} className={"cstat " + (!device.Device_IsActive ? "" : "hidden")} alt="Device Offline" />
                        <span className="cstat">
                            <a href="http://uat.hmedtcloud.com/?pg=SettingsDevices&amp;st=connect&amp;duid=BCA09B13-D63D-4A3E-87F9-E4A53103259B&amp;Session_UID=TQFAOEWY4QR3AH7COYC1M0JTH9VE7QDO&amp;User_UID=L7KRDI112UNTP8P4PTA9XINT5PUY0R0U&amp;IsLoggedIn=1">{device.Device_IsActive == 1 ? (device.Device_Name + ' ' + 'Online') : (device.Device_Name + ' ' + 'Offline')}</a>
                        </span>
                    </td>
                </tr>
            )
        });
        return deviceRows;
    }

    renderStores() {
        const { stores, language } = this.state
        let self = this
        console.log(this.props.stores.adminStoreDetails);
        let storeRows = this.props.stores.adminStoreDetails.storeList.map(function (store, index) {
            return (
                <tr class="tdata clear" key={index}>
                    <td class="cdet store_checkbox"><input type="checkbox" name="edit_selected1" id="edit_selected1" onchange="addRemoveStores('F5EE2F75C7CE4725849E4B5626A888D9','1');" value="F5EE2F75C7CE4725849E4B5626A888D9" disabled="disabled" /></td>
                    <td>{store.Company_Name} <br /><span class="edit_settings"><a href="#" class="opener view_details" onclick="passViewDetails('F5EE2F75C7CE4725849E4B5626A888D9','', '00000159', 'shomhme+serversplit19622@gmail.com', 'Wendy\'s', 'ZOOM');">View Details</a></span></td>
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


    sortStores(e) {
        this.state.Ascending = this.state.Ascending ? false : true;
        this.setState(this.state);
        let sortBy = e.target.id;
        let sortType = this.state.Ascending ? 'DESC' : 'ASC'
        let sortParams = { 'sortBy': sortBy, 'sortType': sortType }
        this.props.dispatch(storesFunctions.sortStores(sortParams))
    }


}



function mapStateToProps(state) {
    return {
        storesDetails: state.storeDetails,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ storesFunctions: storesFunctions }, dispatch);
}

export default connect(mapStateToProps)(StoreDetail)


















