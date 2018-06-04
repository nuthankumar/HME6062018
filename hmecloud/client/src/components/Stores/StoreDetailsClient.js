import React, { Component } from 'react'
import './Stores.css'
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
import * as storesFunctions from '../../actions/stores'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import { BrowserRouter as Router, Route, Link, hashHistory, IndexRoute, Switch } from 'react-router-dom'
import * as modalAction from '../../actions/modalAction'
import ModalContainer from '../../containers/ModalContainer'
import AuthenticationService from '../Security/AuthenticationService'
import { Config } from '../../Config'
const Online = require('../../images/connection_online.png')
const Offline = require('../../images/connection_offline.png')
class StoreDetail extends Component { // ensure you dont export component directly
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
      recordCount: 5000,
      userContext: {},
      url: null,
      token: null
    }
    this.authService = new AuthenticationService(Config.authBaseUrl)
    this.renderDevices = this.renderDevices.bind(this)
    this.viewDetails = this.viewDetails.bind(this)
    this.state.url = this.authService.getColdFusionAppUrl(this.authService.isAdmin())
    this.state.token = this.authService.getToken()
    this.routeToViewDetail = this.routeToViewDetail.bind(this)
  }

  viewDetails(data) {
    this.props.dispatch(modalAction.initStoreDetail(data.Store_UID, false))
  }

  componentWillMount() {
    //  this.state.stores = this.props.stores;
    this.setState({
      stores: this.props.stores
    })

    this.props.dispatch(storesFunctions.sortStores({ 'sortBy': 'Brand_Name', 'sortType': 'DESC' }))
    this.state.userContext = this.authService.getProfile()
  }
  routeToViewDetail(id) {
    // this.props.history.push({ pathname: '/settings/ViewDetails?uuid=' + id })
  }
  renderPopUp() {
    if (this.props.storeModelPopup !== undefined) {
      return (
        <ModalContainer history={this.props.history} routeToViewDetail={this.routeToViewDetail()} />
      )
    }
  }

  render() {
    const { language, token, url } = this.state
    let sortParams = this.props.storesDetails.sortParams ? this.props.storesDetails.sortParams : { 'sortBy': 'Brand_Name', 'sortType': 'DESC' }
    this.state.recordCount = this.props.storesDetails.adminStoreDetails.storeList.length
    return (
      <section className={'stores ' + (this.state.showStores ? 'show' : 'hidden')}>
        <div className='settings forms'>
          <div className='settings_plug clear'>
            <div className='settings_search clear'>
              <h3 className='clear'>{t[language].storeListStores}</h3>
              <div>
                <a className={this.state.userContext.IsAccountOwner === 1 ? '' : 'hidden'} href={url + '?pg=SettingsGroups&token=' + token}><span className='additem'><span>{t[language].manageleaderboardgroups}</span></span></a>
                <a className={this.state.userContext.IsAccountOwner === 1 ? '' : 'hidden'} href='./stores/grouphierarchy'><span className='additem'><span>{t[language].managereportgroups}</span></span></a>
              </div>
            </div>
          </div>
          <div className='settings_list'>
            <div className='storesTable ctable'>
              <table>
                <tbody>
                  <tr className='theader clear storesTable'>
                    <th>&nbsp;</th>
                    <th id='brand_space' className={(sortParams.sortBy == 'Brand_Name' && sortParams.sortType == 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Brand_Name' && sortParams.sortType === 'DESC') ? 'actcold' : '')}><a><span id='Brand_Name' onClick={this.sortStores.bind(this)}>{t[language].StoreSettingsHeaderBrand}</span></a></th>
                    <th className={(sortParams.sortBy === 'Store_Number' && sortParams.sortType == 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Store_Number' && sortParams.sortType === 'DESC') ? 'actcold' : '')}><a><span id='Store_Number' onClick={this.sortStores.bind(this)}>{t[language].StoreSettingsHeaderStore}</span></a></th>
                    <th className={(sortParams.sortBy === 'Store_AddressLine1' && sortParams.sortType == 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Store_AddressLine1' && sortParams.sortType === 'DESC') ? 'actcold' : '')}><a><span id='Store_AddressLine1' onClick={this.sortStores.bind(this)}>{t[language].StoreSettingsHeaderAddress}</span></a></th>
                    <th className={(sortParams.sortBy === 'Store_Locality' && sortParams.sortType == 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Store_Locality' && sortParams.sortType === 'DESC') ? 'actcold' : '')}><a><span id='Store_Locality' onClick={this.sortStores.bind(this)}>{t[language].StoreSettingsHeaderCityState}</span></a></th>
                    <th className={(sortParams.sortBy === 'Group_Name' && sortParams.sortType == 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Group_Name' && sortParams.sortType === 'DESC') ? 'actcold' : '')}><a><span id='Group_Name' onClick={this.sortStores.bind(this)}>{t[language].StoreSettingsLeaderboardGroup}</span></a></th>
                    <th className={(sortParams.sortBy === 'Group_Name' && sortParams.sortType == 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Group_Name' && sortParams.sortType === 'DESC') ? 'actcold' : '')}><a><span id='Group_Name' onClick={this.sortStores.bind(this)}>{t[language].StoreSettingsReportGroup}</span></a></th>
                    <th className={(sortParams.sortBy === 'Device_Name' && sortParams.sortType == 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Device_Name' && sortParams.sortType === 'DESC') ? 'actcold' : '')}><a><span id='Device_Name' onClick={this.sortStores.bind(this)}>{t[language].StoreSettingsHeaderName}</span></a></th>
                    <th className={(sortParams.sortBy === 'Device_MainVersion' && sortParams.sortType == 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Device_MainVersion' && sortParams.sortType === 'DESC') ? 'actcold' : '')}><a><span id='Device_MainVersion' onClick={this.sortStores.bind(this)}>{t[language].StoreSettingsHeaderVersion}</span></a></th>
                    <th className={(sortParams.sortBy === 'Device_IsActive' && sortParams.sortType == 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Device_IsActive' && sortParams.sortType === 'DESC') ? 'actcold' : '')}><a><span id='Device_IsActive' onClick={this.sortStores.bind(this)}>{t[language].StoreSettingsHeaderStatus}</span></a></th>
                  </tr>
                  {this.renderStores()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {this.renderPopUp.bind(this)}
      </section>
    )
  }

  renderDevices(devices) {
    const { language } = this.state
    let deviceRows = devices.map(function (device, index) {
      return (
        <tr>
          <td width='90'>{device.Device_Name}</td>
          <td width='110'>{device.Device_MainVersion}</td>
          <td width='100'>
            <img src={Online} className={'cstat ' + (device.Device_IsActive ? '' : 'hidden')} alt='Device Online' />
            <img src={Offline} className={'cstat ' + (!device.Device_IsActive ? '' : 'hidden')} alt='Device Offline' />
            <span className='cstat'>
              <a href='http://uat.hmedtcloud.com/?pg=SettingsDevices&amp;st=connect&amp;duid=BCA09B13-D63D-4A3E-87F9-E4A53103259B&amp;Session_UID=TQFAOEWY4QR3AH7COYC1M0JTH9VE7QDO&amp;User_UID=L7KRDI112UNTP8P4PTA9XINT5PUY0R0U&amp;IsLoggedIn=1'>{device.Device_IsActive ? t[language].settingsStoresOnline : t[language].settingsStoresOffline}</a>
            </span>
          </td>
        </tr>
      )
    })
    return deviceRows
  }

  renderStores() {
    const { language } = this.state
    let self = this
    if (this.props.stores.storeDetails.storeList) {
      let storeRows = this.props.stores.storeDetails.storeList.map(function (store, index) {
        return (<tr className='tdata clear'>
          <td><a href='#' className='opener view_details' onClick={self.viewDetails.bind(this, store)}><span translate='' key='viewedit'>View/Edit</span> <br /><span translate='' key='settingsStoresDetails'>{t[language].settingsStoresDetails}</span></a></td>
          <td>{store.Brand_Name}</td>
          <td>{store.Store_Number}</td>
          <td>{store.Store_AddressLine1}</td>
          <td>{store.Store_Locality},{store.Store_Region}</td>
          <td>{store.Group_Name}</td>
          <td>{store.Group_Name}</td>
          <td colspan='6'>
            <table>
              <tbody>
                {self.renderDevices(store.Device_Details)}
              </tbody>
            </table>
          </td>
        </tr>)
      })
      return storeRows
    } else {
      return ''
    }
  }

  sortStores(e) {
    this.state.Ascending = !this.state.Ascending
    this.setState(this.state)
    let sortBy = e.target.id
    let sortType = this.state.Ascending ? 'DESC' : 'ASC'
    let sortParams = { 'sortBy': sortBy, 'sortType': sortType }
    this.props.dispatch(storesFunctions.sortStores(sortParams))
    this.props.dispatch(storesFunctions.initStoresDetails())
  }
}

function mapStateToProps(state) {
  return {
    storesDetails: state.storeDetails,
    storeModelPopup: state.StorePopupDetails.storePopUpClient,
    storeModelPopupIsAdmin: state.StorePopupDetails.storePopUpDetailisAdmin
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ storesFunctions: storesFunctions }, dispatch)
}

export default connect(mapStateToProps)(StoreDetail)
