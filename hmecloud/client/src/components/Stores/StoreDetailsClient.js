import React, { Component } from 'react';
import './Stores.css'
import Pagination from '../Common/PaginationComponent'
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
import * as storesFunctions from "../../actions/stores";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const Online = require("../../images/connection_online.png");
const Offline = require("../../images/connection_offline.png");
//export default class BookList extends Component {
class StoreDetail extends Component { //ensure you dont export component directly

    constructor(props) {
        super(props)
        this.state = {
            showStores: this.props.showStores,
            language: languageSettings.getCurrentLanguage(),
            stores: {},
            Ascending: true,
            pageSize: 10,
            offset: 0,
            data: [],
            recordCount: 5000
        }
        this.renderDevices = this.renderDevices.bind(this)
        this.PageSizeValueDropdown = this.PageSizeValueDropdown.bind(this)
        this.PageClicked = this.PageClicked.bind(this)
    }
    PageSizeValueDropdown(pageSize) {
        this.setState({ pageSize })
    }
    PageClicked(value) {
        if (value === null) {
            return this.state.offset
        }
        else {
            this.setState({ offset: value })
            return this.state.offset;
        }
    }

    componentWillMount() {
        //  this.state.stores = this.props.stores;
        this.setState({
            stores: this.props.stores
        })
       this.props.dispatch(storesFunctions.sortStores({ 'sortBy': 'Brand_Name', 'sortType': 'DESC' }))
    }


    render() {
        const { language } = this.state
         let sortParams = this.props.storesDetails.sortParams ? this.props.storesDetails.sortParams :  { 'sortBy': 'Brand_Name', 'sortType': 'DESC' }
        
        return (
            <section className={"stores " + (this.state.showStores ? 'show' : 'hidden')}>
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
                                        <th id="brand_space" className={(sortParams.sortBy == 'Brand_Name' && sortParams.sortType == 'ASC')?'actcol':((sortParams.sortBy == 'Brand_Name' && sortParams.sortType == 'DESC')?'actcold':'')}><a><span id='Brand_Name' onClick={this.sortStores.bind(this)}>{t[language].StoreSettingsHeaderBrand}</span></a></th>
                                        <th className={(sortParams.sortBy == 'Store_Number' && sortParams.sortType == 'ASC')?'actcol':((sortParams.sortBy == 'Store_Number' && sortParams.sortType == 'DESC')?'actcold':'')}><a><span id='Store_Number' onClick={this.sortStores.bind(this)}>{t[language].StoreSettingsHeaderStore}</span></a></th>
                                        <th className={(sortParams.sortBy == 'Store_AddressLine1' && sortParams.sortType == 'ASC')?'actcol':((sortParams.sortBy == 'Store_AddressLine1' && sortParams.sortType == 'DESC')?'actcold':'')}><a><span id='Store_AddressLine1' onClick={this.sortStores.bind(this)}>{t[language].StoreSettingsHeaderAddress}</span></a></th>
                                        <th className={(sortParams.sortBy == 'Store_Locality' && sortParams.sortType == 'ASC')?'actcol':((sortParams.sortBy == 'Store_Locality' && sortParams.sortType == 'DESC')?'actcold':'')}><a><span id='Store_Locality' onClick={this.sortStores.bind(this)}>{t[language].StoreSettingsHeaderCityState}</span></a></th>
                                        <th className={(sortParams.sortBy == 'Group_Name' && sortParams.sortType == 'ASC')?'actcol':((sortParams.sortBy == 'Group_Name' && sortParams.sortType == 'DESC')?'actcold':'')}><a><span id='Group_Name' onClick={this.sortStores.bind(this)}>{t[language].StoreSettingsLeaderboardGroup}</span></a></th>
                                        <th className={(sortParams.sortBy == 'Group_Name' && sortParams.sortType == 'ASC')?'actcol':((sortParams.sortBy == 'Group_Name' && sortParams.sortType == 'DESC')?'actcold':'')}><a><span id='Group_Name' onClick={this.sortStores.bind(this)}>{t[language].StoreSettingsReportGroup}</span></a></th>
                                        <th className={(sortParams.sortBy == 'Device_Name' && sortParams.sortType == 'ASC')?'actcol':((sortParams.sortBy == 'Device_Name' && sortParams.sortType == 'DESC')?'actcold':'')}><a><span id='Device_Name' onClick={this.sortStores.bind(this)}>{t[language].StoreSettingsHeaderName}</span></a></th>
                                        <th className={(sortParams.sortBy == 'Device_MainVersion' && sortParams.sortType == 'ASC')?'actcol':((sortParams.sortBy == 'Device_MainVersion' && sortParams.sortType == 'DESC')?'actcold':'')}><a><span id='Device_MainVersion' onClick={this.sortStores.bind(this)}>{t[language].StoreSettingsHeaderVersion}</span></a></th>
                                        <th className={(sortParams.sortBy == 'Device_IsActive' && sortParams.sortType == 'ASC')?'actcol':((sortParams.sortBy == 'Device_IsActive' && sortParams.sortType == 'DESC')?'actcold':'')}><a><span id='Device_IsActive' onClick={this.sortStores.bind(this)}>{t[language].StoreSettingsHeaderStatus}</span></a></th>
                                    </tr>
                                    {this.renderStores()}
                                </tbody>
                            </table>
                            <Pagination
                                perPage={this.state.pageSize}
                                PageSizeValueChange={this.PageSizeValueDropdown}
                                offset={this.PageClicked}
                                recordCount={this.state.recordCount} />
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
                <tr>
                    <td width="90">{device.Device_Name}</td>
                    <td width="110">{device.Device_MainVersion}</td>
                    <td width="100">
                        <img src={Online} className={"cstat " + (device.Device_IsActive ? "" : "hidden")} alt="Device Online" />
                        <img src={Offline} className={"cstat " + (!device.Device_IsActive ? "" : "hidden")} alt="Device Offline" />
                        <span className="cstat">
                            <a href="http://uat.hmedtcloud.com/?pg=SettingsDevices&amp;st=connect&amp;duid=BCA09B13-D63D-4A3E-87F9-E4A53103259B&amp;Session_UID=TQFAOEWY4QR3AH7COYC1M0JTH9VE7QDO&amp;User_UID=L7KRDI112UNTP8P4PTA9XINT5PUY0R0U&amp;IsLoggedIn=1">{device.Device_IsActive ? t[language].settingsStoresOnline : t[language].settingsStoresOffline}</a>
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
        if (this.props.stores.storeDetails.storeList) {
            let storeRows = this.props.stores.storeDetails.storeList.map(function (store, index) {
                return (<tr className="tdata clear">
                    <td><a href="#" className="opener view_details" onclick="passViewDetails('F08E66EEBCAE429988C90D9167CFD716','22222', 'selvendrank@nousinfo.com', 'McDonald\'s', 'ZOOM');"><span translate="" key="viewedit">View/Edit</span> <br /><span translate="" key="settingsStoresDetails">{t[language].settingsStoresDetails}</span></a></td>
                    <td>{store.Brand_Name}</td>
                    <td>{store.Store_Number}</td>
                    <td>{store.Store_AddressLine1}</td>
                    <td>{store.Store_Locality},{store.Store_Region}</td>
                    <td>{store.Group_Name}</td>
                    <td>{store.Group_Name}</td>
                    <td colspan="6">
                        <table>
                            <tbody>
                                {self.renderDevices(store.Device_Details)}
                            </tbody>
                        </table>
                    </td>
                </tr>)
            });
            return storeRows;

        }
        else {
            return ''
        }

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















