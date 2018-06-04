import React, { Component } from 'react'
import * as languageSettings from '../components/Language/languageSettings'
import StoreDetailsComponent from '../components/Stores/StoreDetailsComponent'
import { connect } from 'react-redux'
import AuthenticationService from '../components/Security/AuthenticationService'
import { Config } from '../Config'
import * as modalAction from '../actions/modalAction'
import 'url-search-params-polyfill'
const offlineImage = require('../images/connection_offline.png')
class StoreSystemContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentLanguage: languageSettings.getCurrentLanguage()
    }
    this.authService = new AuthenticationService(Config.authBaseUrl)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (id) {
    console.log(id)
  }
  componentWillMount () {
    const params = new URLSearchParams(this.props.history.location.search)
    const contextToken = params.get('uuid') ? params.get('uuid') : null
    this.props.dispatch(modalAction.initStoreDetail(contextToken, false))
  }
  renderRows () {
    let row = this.props.stores.Device_Details
    let rows = row.map((data, index) => {
      return (
        <tr className='tdata'>
          <td className='sys-ctr'>
            <input type='checkbox' name='checkbox' id='idname' className='sys-ion-check' onChange={this.enableRemoveBtn} />
          </td>
          <td >{data.Device_SettingVersion}</td>
          <td >{data.Device_SerialNumber}</td>
          <td>
            <img src={offlineImage} /><span> {data.Device_IsActive === 0 ? 'Offline' : 'Online'}</span></td>
          <td onClick={() => this.handleClick(data.Device_UID)}><a>View <span>Details</span></a></td>
        </tr>
      )
    })
    return rows
  }

  render () {
    return (
      <div>
        <StoreDetailsComponent history={this.props.history} />
        <h4 className='cib_header'>Registered Devices</h4>
        <table className='sys_table_widget sys_table'>
          <tbody>
            <tr className='theader'>
              <th />
              <th>System Name</th>
              <th>System Version</th>
              <th>Serial Number</th>
              <th>System Status</th>
              <th />
            </tr>
            {this.renderRows()}
          </tbody>
        </table>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    stores: state.StorePopupDetails.storePopupDetails
  }
}

export default connect(mapStateToProps)(StoreSystemContainer)
