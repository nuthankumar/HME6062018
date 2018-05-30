import React, { Component } from 'react'
import './Systems.css'
import * as languageSettings from '../Language/languageSettings'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Pagination from '../Common/Pagination'
import t from '../Language/language'
import { getSystems, sortSystems, setSearchParams, paginationSystems } from '../../actions/systems'
import { ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap'
const Online = require('../../images/connection_online.png')
const Offline = require('../../images/connection_offline.png')
const Search = require('../../images/search.jpg')

class Systems extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showStores: this.props.showStores,
      language: languageSettings.getCurrentLanguage(),
      Ascending: true,
      criteria: null,
      pageSize: 10,
      offset: 0,
      data: [],
      recordCount: 5000
    }
    this.PageSizeValueDropdown = this.PageSizeValueDropdown.bind(this)
    this.PageClicked = this.PageClicked.bind(this)
    this.search = this.search.bind(this)
  }
  componentWillMount () {
    this.props.sortSystems({ 'sortBy': 'Brand_Name', 'sortType': 'DESC' })
    this.props.setSearchParams({ 'filter': null, 'criteria': null })
    // this.props.getSystems()
  }
  onSelectAlert (eventKey) {
    window.alert(`Alert from menu item.\neventKey: ${eventKey}`)
  }
  search (e) {
    // if (e.key === 'Enter') {
    //   console.log(e.target.value)
    // }
    this.props.setSearchParams({ 'filter': this.props.systems.searchParams.filter, 'criteria': this.state.criteria })
    this.props.getSystems()
  }

  PageSizeValueDropdown (pageSize) {
    this.setState({ pageSize })
    let paginationParams = { pageSize: pageSize, pageNumber: ((this.state.offset / 10) + 1) }
    this.props.paginationSystems(paginationParams)
    // this.props.getSystems()
  }
  PageClicked (value) {
    let paginationParams = { pageSize: this.state.pageSize, pageNumber: ((value / 10) + 1) }
    this.props.paginationSystems(paginationParams)
    // this.props.getSystems()
    if (value === null) {
      return this.state.offset
    } else {
      this.setState({ offset: value })
      return this.state.offset
    }
  }
  handleSearchChange (e) {
    this.props.setSearchParams({ 'filter': e.target.value, 'criteria': null })
  }
  handleCriteria (e) {
    this.setState({[ e.target.name ]: e.target.value })
  }
  render () {
    const { language } = this.state
    console.log(this.props.systems)

    let sortParams = (this.props.systems.sortParams) ? this.props.systems.sortParams : { 'sortBy': 'Brand_Name', 'sortType': 'DESC' }
    return (
      <section className='systems'>
        <div className='settings forms'>
          <div className='settings_plug clear'>
            <div className='settings_search clear'>
              <h3 className='clear'>Systems</h3>
              <div>
                <a href='./?pg=SettingsDevices&amp;st=odcsv'><span className='additem'>Unregistered Systems</span></a>
              </div>
            </div> <div className='settings_plug clear storeHeight'>

              <div className='search_pos'>
                <div class='dropdown'>
                  <ButtonToolbar>
                    <DropdownButton
                      bsStyle='default'
                      title=''
                      id='dropdown-no-caret'
                    // onSelect={this.onSelectAlert}
                    >
                      <MenuItem eventKey='Brand_Name'>
                        <input type='radio' name='search_all' value='' checked={!this.props.systems.searchParams.filter} onClick={this.handleSearchChange.bind(this)} /> search all<br />
                      </MenuItem>
                      <MenuItem eventKey='Brand_Name'>
                        <input type='radio' name='Brand_Name' value='Brand_Name' checked={this.props.systems.searchParams.filter === 'Brand_Name'} onClick={this.handleSearchChange.bind(this)} /> Search brand<br />
                      </MenuItem>
                      <MenuItem eventKey='Brand_Name'>
                        <input type='radio' name='Store_Number' value='Store_Number' checked={this.props.systems.searchParams.filter === 'Store_Number'} onClick={this.handleSearchChange.bind(this)} /> Search store # <br />
                      </MenuItem>
                      <MenuItem eventKey='Brand_Name'>
                        <input type='radio' name='Device_SerialNumber' value='Device_SerialNumber' checked={this.props.systems.searchParams.filter === 'Device_SerialNumber'} onClick={this.handleSearchChange.bind(this)} /> Search serial #<br />
                      </MenuItem>
                      <MenuItem eventKey='Brand_Name'>
                        <input type='radio' name='Device_MainVersion' value='Device_MainVersion' checked={this.props.systems.searchParams.filter === 'Device_MainVersion'} onClick={this.handleSearchChange.bind(this)} /> Search system version <br />
                      </MenuItem>
                   

                    </DropdownButton>
                  </ButtonToolbar>
                </div>
                <div class='search'>
                   <input type='text' name='criteria' className='searchBox' value={this.state.criteria} onChange={this.handleCriteria.bind(this)} /> 
                   <img src={Search} className="searchImage" alt='Device Online' onClick={this.search} />
                </div>
              </div>
            </div>
            <div className='settings_list'>
              <div className='ctable'>
                <table>
                  <tbody>
                    <tr className='theader clear'>
                      <th />
                      <th id='brand_space' className={(sortParams.sortBy === 'Brand_Name' && sortParams.sortType === 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Brand_Name' && sortParams.sortType === 'DESC') ? 'actcold' : '')}>
                        <a><span id='Brand_Name' onClick={this.sortStores.bind(this)}>Brand</span></a>
                      </th>
                      <th className={(sortParams.sortBy === 'Store_Number' && sortParams.sortType === 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Store_Number' && sortParams.sortType === 'DESC') ? 'actcold' : '')}>
                        <a><span id='Store_Number' onClick={this.sortStores.bind(this)}>Store #</span></a>
                      </th>
                      <th className={(sortParams.sortBy === 'Device_Name' && sortParams.sortType === 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Device_Name' && sortParams.sortType === 'DESC') ? 'actcold' : '')}>
                        <a><span id='Device_Name' onClick={this.sortStores.bind(this)}>System</span></a>
                      </th>
                      <th className={(sortParams.sortBy === 'Device_SerialNumber' && sortParams.sortType === 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Device_SerialNumber' && sortParams.sortType === 'DESC') ? 'actcold' : '')}>
                        <a><span id='Device_SerialNumber' onClick={this.sortStores.bind(this)}>Serial #</span></a>
                      </th>
                      <th className={(sortParams.sortBy === 'Device_MainVersion' && sortParams.sortType === 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Device_MainVersion' && sortParams.sortType === 'DESC') ? 'actcold' : '')}>
                        <a><span id='Device_MainVersion' onClick={this.sortStores.bind(this)}>Version</span></a>
                      </th>
                      <th className={(sortParams.sortBy === 'Device_SettingVersion' && sortParams.sortType === 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Device_SettingVersion' && sortParams.sortType === 'DESC') ? 'actcold' : '')}>
                        <a><span id='Device_SettingVersion' onClick={this.sortStores.bind(this)}>Settings Version</span></a>
                      </th>
                      <th className={(sortParams.sortBy === 'LaneConfig_Name' && sortParams.sortType === 'ASC') ? 'actcol' : ((sortParams.sortBy === 'LaneConfig_Name' && sortParams.sortType === 'DESC') ? 'actcold' : '')}>
                        <a><span id='LaneConfig_Name' onClick={this.sortStores.bind(this)}>Lane Config</span></a>
                      </th>
                      <th className={(sortParams.sortBy === 'Device_IsActive' && sortParams.sortType === 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Device_IsActive' && sortParams.sortType === 'DESC') ? 'actcold' : '')}>
                        <a><span id='Device_IsActive' onClick={this.sortStores.bind(this)}>System Status</span></a>
                      </th>
                    </tr>  {this.renderSystems()}
                  </tbody></table>
                <Pagination
                  perPage={this.state.pageSize}
                  PageSizeValueChange={this.PageSizeValueDropdown}
                  offset={this.PageClicked}
                  recordCount={this.state.recordCount} />
              </div>
            </div>
          </div>
        </div>

      </section>
    )
  }
  sortStores (e) {
    this.state.Ascending = !this.state.Ascending
    this.setState(this.state)
    let sortBy = e.target.id
    let sortType = this.state.Ascending ? 'DESC' : 'ASC'
    let sortParams = { 'sortBy': sortBy, 'sortType': sortType }
    this.props.sortSystems(sortParams)
    this.props.getSystems()
  }

  renderSystems () {
    const { language } = this.state
    let self = this
    if (this.props.systems) {
      let storeRows = this.props.systems.systemDetails.deviceList.map(function (store, index) {
        return (<tr className='tdata clear'>
          <td><a href='#' className='opener view_details' onclick="passViewDetails('F08E66EEBCAE429988C90D9167CFD716','22222', 'selvendrank@nousinfo.com', 'McDonald\'s', 'ZOOM');"><span translate='' key='viewedit'>View/Edit</span> <br /><span translate='' key='settingsStoresDetails'>{t[language].settingsStoresDetails}</span></a></td>
          <td>{store.Brand_Name}</td>
          <td>{store.Store_Number}</td>
          <td>{store.Device_Name}</td>
          <td>{store.Device_SerialNumber}</td>
          <td>{store.Device_MainVersion}</td>
          <td>{store.Device_SettingVersion}</td>
          <td>{store.LaneConfig_Name}</td>
          <td width='100'>
            <img src={Online} className={'cstat ' + (store.Device_IsActive == '1' ? '' : 'hidden')} alt='Device Online' />
            <img src={Offline} className={'cstat ' + (!store.Device_IsActive == '0' ? '' : 'hidden')} alt='Device Offline' />
            <span className='cstat'>
              <a href='http://uat.hmedtcloud.com/?pg=SettingsDevices&amp;st=connect&amp;duid=BCA09B13-D63D-4A3E-87F9-E4A53103259B&amp;Session_UID=TQFAOEWY4QR3AH7COYC1M0JTH9VE7QDO&amp;User_UID=L7KRDI112UNTP8P4PTA9XINT5PUY0R0U&amp;IsLoggedIn=1'>{store.System_Status ? t[language].settingsStoresOnline : t[language].settingsStoresOffline}</a>
            </span>
          </td>
        </tr>
        )
      })
      return storeRows
    } else {
      return ''
    }
  }
}

function mapStateToProps (state) {
  return {
    systems: state.systems
  }
}
function matchDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      getSystems: getSystems,
      sortSystems: sortSystems,
      setSearchParams: setSearchParams,
      paginationSystems: paginationSystems
    }, dispatch
  )
}
export default connect(mapStateToProps, matchDispatchToProps)(Systems)
