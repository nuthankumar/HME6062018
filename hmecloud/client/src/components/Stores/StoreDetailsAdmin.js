import React, { Component } from 'react'
import './Stores.css'
import Pagination from '../Common/Pagination'
import t from '../Language/language'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import StoreMerge from './StoreMerge'
import { ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap'
import * as storesFunctions from '../../actions/stores'
import * as modalAction from '../../actions/modalAction'
import ModalContainer from '../../containers/ModalContainer'
const Online = require('../../images/connection_online.png')
const Offline = require('../../images/connection_offline.png')
const Search = require('../../images/search.jpg')

class StoreDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showStores: this.props.showStores,
      stores: {},
      Ascending: true,
      criteria: null,
      pageSize: 10,
      offset: 0,
      data: []
    }
    this.renderDevices = this.renderDevices.bind(this)
    this.PageSizeValueDropdown = this.PageSizeValueDropdown.bind(this)
    this.PageClicked = this.PageClicked.bind(this)
    this.onSelectAlert = this.onSelectAlert.bind(this)
    this.search = this.search.bind(this)
  }
  componentWillMount() {
    this.props.dispatch(storesFunctions.sortStores({ 'sortBy': 'Company_Name', 'sortType': 'DESC' }))
    this.props.dispatch(storesFunctions.setStoresSearchParams({ 'filter': null, 'criteria': null }))
    // this.props.setSearchParams({ 'filter': null, 'criteria': null })
  }
  PageSizeValueDropdown(pageSize) {
    this.setState({ pageSize })
    let paginationParams = { pageSize: pageSize, pageNumber: ((this.state.offset / 10) + 1) }
    this.props.dispatch(storesFunctions.paginationAdminStores(paginationParams))
    this.props.dispatch(storesFunctions.adminStoresDetails())
  }
  PageClicked(value) {
    let paginationParams = { pageSize: this.state.pageSize, pageNumber: ((value / 10) + 1) }
    this.props.dispatch(storesFunctions.paginationAdminStores(paginationParams))
    this.props.dispatch(storesFunctions.adminStoresDetails())
    if (value === null) {
      return this.state.offset
    } else {
      this.setState({ offset: value })
      return this.state.offset
    }
  }

  viewDetails(data) {
    this.props.dispatch(modalAction.initStoreDetail(data.Store_UID, true))
    // this.props.dispatch(modalAction.openPopup(true))
  }

  onSelectAlert(eventKey) {
    window.alert(`Alert from menu item.\neventKey: ${eventKey}`)
  }
  search(e) {
    // this.props.setStoresSearchParams({ 'filter': this.props.systems.searchParams.filter, 'criteria': this.state.criteria })
    this.props.dispatch(storesFunctions.setStoresSearchParams({ 'filter': this.props.storesDetails.searchParams.filter, 'criteria': this.state.criteria }))
    this.props.dispatch(storesFunctions.adminStoresDetails())
  }
  handleSearchChange(e) {
    this.props.dispatch(storesFunctions.setStoresSearchParams({ 'filter': e.target.value, 'criteria': null }))
    // this.props.setSearchParams({ 'filter': e.target.value, 'criteria': null })
  }
  handleCriteria(e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  render() {
    let sortParams = this.props.storesDetails.sortParams ? this.props.storesDetails.sortParams : { 'sortBy': 'Brand_Name', 'sortType': 'DESC' }
    let searchParams = this.props.storesDetails.searchParams
    let recordCount = (this.props.storesDetails.adminStoreDetails.pageDetails !== undefined) ? this.props.storesDetails.adminStoreDetails.pageDetails[0].RecordCount : 10
    let pageCount = (this.props.storesDetails.adminStoreDetails.pageDetails !== undefined) ? this.props.storesDetails.adminStoreDetails.pageDetails[0].TotalPages : 10
    return (
      <section className={'stores ' + (this.state.showStores ? 'show' : 'hidden')}>
        <div className='settings forms'>
          <div class='settings_search clear storeHeight'>
            <h3 class='clear fleft'>Stores</h3>
          </div>
          <div className='settings_plug clear storeHeight'>

            <div className='search_pos'>
              <div class='dropdown'>
                <ButtonToolbar>
                  <DropdownButton
                    bsStyle='default'
                    title=''
                    id='dropdown-no-caret'
                  // onSelect={this.onSelectAlert}
                  >
                    <MenuItem>
                      <input type='radio' name='search_all' value='' checked={!searchParams.filter} onClick={this.handleSearchChange.bind(this)} /> search all<br />
                    </MenuItem>
                    <MenuItem>
                      <input type='radio' name='Brand_Name' value='Brand_Name' checked={searchParams.filter === 'Brand_Name'} onClick={this.handleSearchChange.bind(this)} /> Search brand<br />
                    </MenuItem>
                    <MenuItem>
                      <input type='radio' name='Store_Number' value='Store_Number' checked={searchParams.filter === 'Store_Number'} onClick={this.handleSearchChange.bind(this)} /> Search store # <br />
                    </MenuItem>
                    <MenuItem>
                      <input type='radio' name='Store_Name' value='Store_Name' checked={searchParams.filter === 'Store_Name'} onClick={this.handleSearchChange.bind(this)} /> Search store name <br />
                    </MenuItem>
                    <MenuItem>
                      <input type='radio' name='Device_SerialNumber' value='Device_SerialNumber' checked={searchParams.filter === 'Device_SerialNumber'} onClick={this.handleSearchChange.bind(this)} /> Search serial #<br />
                    </MenuItem>
                    <MenuItem>
                      <input type='radio' name='Device_MainVersion' value='Device_MainVersion' checked={searchParams.filter === 'Device_MainVersion'} onClick={this.handleSearchChange.bind(this)} /> Search system version <br />
                    </MenuItem>

                  </DropdownButton>
                </ButtonToolbar>
              </div>
              <div class='search'>
                <input type='text' name='criteria' className='searchBox' value={this.state.criteria} onChange={this.handleCriteria.bind(this)} />
                <img src={Search} className='searchImage' alt='Device Online' onClick={this.search} />
              </div>
            </div>
          </div>
          <div class='settings_list'>
            <div class='storesTable ctable'>
              <table>
                <tbody><tr class='theader clear'>
                  <th />
                  <th className={(sortParams.sortBy === 'Company_Name' && sortParams.sortType === 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Company_Name' && sortParams.sortType === 'DESC') ? 'actcold' : '')}><a><span id='Company_Name' onClick={this.sortStores.bind(this)}>Company Name</span></a></th>
                  <th className={(sortParams.sortBy === 'Brand_Name' && sortParams.sortType === 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Brand_Name' && sortParams.sortType === 'DESC') ? 'actcold' : '')}><a><span id='Brand_Name' onClick={this.sortStores.bind(this)}>Brand</span></a></th>
                  <th className={(sortParams.sortBy === 'Store_Number' && sortParams.sortType === 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Store_Number' && sortParams.sortType === 'DESC') ? 'actcold' : '')}><a> <span id='Store_Number' onClick={this.sortStores.bind(this)}>Store #</span></a></th>
                  <th className={(sortParams.sortBy === 'Store_Name' && sortParams.sortType === 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Store_Name' && sortParams.sortType === 'DESC') ? 'actcold' : '')}><a><span id='Store_Name' onClick={this.sortStores.bind(this)}>Store Name</span></a></th>
                  <th className={(sortParams.sortBy === 'Store_AddressLine1' && sortParams.sortType === 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Store_AddressLine1' && sortParams.sortType === 'DESC') ? 'actcold' : '')}><a> <span id='Store_AddressLine1' onClick={this.sortStores.bind(this)}>Store Address</span></a></th>
                  {/* style="width:100px;" */}
                  <th className={(sortParams.sortBy === 'Device_SerialNumber' && sortParams.sortType === 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Device_SerialNumber' && sortParams.sortType === 'DESC') ? 'actcold' : '')}><a> <span id='Device_SerialNumber' onClick={this.sortStores.bind(this)}>Serial #</span></a></th>
                  <th className={(sortParams.sortBy === 'Device_MainVersion' && sortParams.sortType === 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Device_MainVersion' && sortParams.sortType === 'DESC') ? 'actcold' : '')}><a> <span id='Device_MainVersion' onClick={this.sortStores.bind(this)}>Version</span></a></th>
                  <th className={(sortParams.sortBy === 'Subscription_Name' && sortParams.sortType === 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Subscription_Name' && sortParams.sortType === 'DESC') ? 'actcold' : '')}><a> <span id='Subscription_Name' onClick={this.sortStores.bind(this)}>Subscription</span></a></th>
                  <th className={(sortParams.sortBy === 'Device_IsActive' && sortParams.sortType === 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Device_IsActive' && sortParams.sortType === 'DESC') ? 'actcold' : '')}><a> <span id='Device_IsActive' onClick={this.sortStores.bind(this)}>Status</span></a></th>
                </tr>{this.renderStores()}
                </tbody></table>
              <Pagination
                perPage={this.state.pageSize}
                PageSizeValueChange={this.PageSizeValueDropdown}
                offset={this.PageClicked}
                recordCount={recordCount}
                pageCount={pageCount} />
            </div>

          </div>
        </div>
        <ModalContainer onHide={this.smClose} />
        <StoreMerge onHide={this.smClose} />
      </section>
    )
  }
  renderDevices(devices) {
    let deviceRows = devices.map(function (device, index) {
      return (
        <tr key={index}>
          <td>{device.Device_SerialNumber}</td>
          <td>{device.Device_MainVersion}</td>
          <td>{device.Subscription_Name}</td>
          <td>
            <img src={Online} className={'cstat ' + (device.Device_IsActive ? '' : 'hidden')} alt='Device Online' />
            <img src={Offline} className={'cstat ' + (!device.Device_IsActive ? '' : 'hidden')} alt='Device Offline' />
            <span className='cstat'>
              <a href='http://uat.hmedtcloud.com/?pg=SettingsDevices&amp;st=connect&amp;duid=BCA09B13-D63D-4A3E-87F9-E4A53103259B&amp;Session_UID=TQFAOEWY4QR3AH7COYC1M0JTH9VE7QDO&amp;User_UID=L7KRDI112UNTP8P4PTA9XINT5PUY0R0U&amp;IsLoggedIn=1'>{device.Device_IsActive == 1 ? (device.Device_Name + ' ' + 'Online') : (device.Device_Name + ' ' + 'Offline')}</a>
            </span>
          </td>
        </tr>
      )
    })
    return deviceRows
  }

  renderStores() {
    let self = this
    console.log(this.props.stores.adminStoreDetails)
    let storeRows = this.props.stores.adminStoreDetails.storeList.map(function (store, index) {
      return (
        <tr class='tdata clear' key={index}>
          <td class='cdet store_checkbox'><input type='checkbox' name='edit_selected1' id='edit_selected1' onchange="addRemoveStores('F5EE2F75C7CE4725849E4B5626A888D9','1');" value='F5EE2F75C7CE4725849E4B5626A888D9' disabled='disabled' /></td>
          <td>{store.Company_Name} <br /><span class='edit_settings'><a href='#' class='opener view_details' onClick={self.viewDetails.bind(self, store)}>View Details</a></span></td>
          <td>{store.Brand_Name}</td>
          <td>{store.Store_Number}</td>
          <td>{store.Store_Name}</td>
          <td>{store.Store_AddressLine1} </td>
          <td colspan='4'>
            <table>
              <tbody>
                {self.renderDevices(store.Device_Details)}
              </tbody></table>
          </td>
        </tr>
      )
    })
    return storeRows
  }
  sortStores(e) {
    this.state.Ascending = !this.state.Ascending
    this.setState(this.state)
    let sortBy = e.target.id
    let sortType = this.state.Ascending ? 'DESC' : 'ASC'
    let sortParams = { 'sortBy': sortBy, 'sortType': sortType }
    this.props.dispatch(storesFunctions.sortStores(sortParams))
    this.props.dispatch(storesFunctions.adminStoresDetails())
  }
}
function mapStateToProps(state) {
  return {
    storesDetails: state.storeDetails,
    storeModelPopup: state.StorePopupDetails.storePopUpAdmin,
    storeModelPopupIsAdmin: state.StorePopupDetails.storePopUpDetailisAdmin
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ storesFunctions: storesFunctions, setStoresSearchParams: storesFunctions.setStoresSearchParams }, dispatch)
}

export default connect(mapStateToProps)(StoreDetail)
