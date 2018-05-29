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

class Systems extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showStores: this.props.showStores,
      language: languageSettings.getCurrentLanguage(),
      Ascending: true,
      pageSize: 10,
      offset: 0,
      data: [],
      recordCount: 5000
    }
    this.PageSizeValueDropdown = this.PageSizeValueDropdown.bind(this)
    this.PageClicked = this.PageClicked.bind(this)
  }
  componentWillMount() {
    this.props.sortSystems({ 'sortBy': 'Brand_Name', 'sortType': 'DESC' })
    this.props.setSearchParams({ 'filter': null, 'criteria': null })
    // this.props.getSystems()
  }
  onSelectAlert(eventKey) {
    window.alert(`Alert from menu item.\neventKey: ${eventKey}`)
  }
  Search(e) {
    if (e.key === 'Enter') {
      console.log(e.target.value)
    }
  }

  PageSizeValueDropdown(pageSize) {
    this.setState({ pageSize })
    let paginationParams = { pageSize: pageSize, pageNumber: ((this.state.offset / 10) + 1) }
    this.props.paginationSystems(paginationParams)
    // this.props.getSystems()
  }
  PageClicked(value) {
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
  render() {
    const { language } = this.state
    console.log(this.props.systems)
    // this.state.recordCount = this.props.storesDetails.adminStoreDetails.storeList.length
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
                        <input type='radio' name='searchItems' value='' checked={!this.props.systems.searchParams.filter} /> search all<br />
                        <input type='radio' name='searchItems' value='female' /> Search brand<br />
                        <input type='radio' name='searchItems' value='other' /> Search store # <br />
                        <input type='radio' name='searchItems' value='male' /> Search serial #<br />
                        <input type='radio' name='searchItems' value='asd' /> Search<br />
                      </MenuItem>
                    </DropdownButton>
                  </ButtonToolbar>
                </div>
                <div class='search'>
                  <input type='text' className='searchBox' onKeyPress={this.Search} />
                  <span class='fa fa-search' />
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
                      <th className={(sortParams.sortBy === 'Store' && sortParams.sortType === 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Store' && sortParams.sortType === 'DESC') ? 'actcold' : '')}>
                        <a><span id='Store' onClick={this.sortStores.bind(this)}>Store #</span></a>
                      </th>
                      <th className={(sortParams.sortBy === 'System' && sortParams.sortType === 'ASC') ? 'actcol' : ((sortParams.sortBy === 'System' && sortParams.sortType === 'DESC') ? 'actcold' : '')}>
                        <a><span id='System' onClick={this.sortStores.bind(this)}>System</span></a>
                      </th>
                      <th className={(sortParams.sortBy === 'Serial' && sortParams.sortType === 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Serial' && sortParams.sortType === 'DESC') ? 'actcold' : '')}>
                        <a><span id='Serial' onClick={this.sortStores.bind(this)}>Serial #</span></a>
                      </th>
                      <th className={(sortParams.sortBy === 'Version' && sortParams.sortType === 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Version' && sortParams.sortType === 'DESC') ? 'actcold' : '')}>
                        <a><span id='Version' onClick={this.sortStores.bind(this)}>Version</span></a>
                      </th>
                      <th className={(sortParams.sortBy === 'Settings_Version' && sortParams.sortType === 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Settings_Version' && sortParams.sortType === 'DESC') ? 'actcold' : '')}>
                        <a><span id='Settings_Version' onClick={this.sortStores.bind(this)}>Settings Version</span></a>
                      </th>
                      <th className={(sortParams.sortBy === 'Lane_Config' && sortParams.sortType === 'ASC') ? 'actcol' : ((sortParams.sortBy === 'Lane_Config' && sortParams.sortType === 'DESC') ? 'actcold' : '')}>
                        <a><span id='Lane_Config' onClick={this.sortStores.bind(this)}>Lane Config</span></a>
                      </th>
                      <th className={(sortParams.sortBy === 'System_Status' && sortParams.sortType === 'ASC') ? 'actcol' : ((sortParams.sortBy === 'System_Status' && sortParams.sortType === 'DESC') ? 'actcold' : '')}>
                        <a><span id='System_Status' onClick={this.sortStores.bind(this)}>System Status</span></a>
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
  sortStores(e) {
    this.state.Ascending = !this.state.Ascending
    this.setState(this.state)
    let sortBy = e.target.id
    let sortType = this.state.Ascending ? 'DESC' : 'ASC'
    let sortParams = { 'sortBy': sortBy, 'sortType': sortType }
    this.props.sortSystems(sortParams)
    this.props.getSystems()
  }

  renderSystems() {
    const { language } = this.state
    let self = this
    if (this.props.systems) {
      let storeRows = this.props.systems.systemDetails.deviceList.map(function (store, index) {
        return (<tr className='tdata clear'>
          <td><a href='#' className='opener view_details' onclick="passViewDetails('F08E66EEBCAE429988C90D9167CFD716','22222', 'selvendrank@nousinfo.com', 'McDonald\'s', 'ZOOM');"><span translate='' key='viewedit'>View/Edit</span> <br /><span translate='' key='settingsStoresDetails'>{t[language].settingsStoresDetails}</span></a></td>
          <td>{store.Brand_Name}</td>
          <td>{store.Store}</td>
          <td>{store.System}</td>
          <td>{store.Serial}</td>
          <td>{store.Version}</td>
          <td>{store.Settings_Version}</td>
          <td>{store.Lane_Config}</td>
          <td width='100'>
            <img src={Online} className={'cstat ' + (store.System_Status ? '' : 'hidden')} alt='Device Online' />
            <img src={Offline} className={'cstat ' + (!store.System_Status ? '' : 'hidden')} alt='Device Offline' />
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

function mapStateToProps(state) {
  return {
    systems: state.systems
  }
}
function matchDispatchToProps(dispatch) {
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
