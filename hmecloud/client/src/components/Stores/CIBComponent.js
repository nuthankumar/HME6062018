import React, { Component } from 'react'
import './Stores.css'
import * as modalAction from '../../actions/modalAction'
import * as viewDetail from '../../actions/viewDetails'
const offlineImage = require('../../images/connection_offline.png')

class CIBComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showStores: this.props.showStores,
      disableRemove: false
    }
    this.enableRemoveBtn = this.enableRemoveBtn.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  enableRemoveBtn (e) {
    return e.currentTarget.checked ? this.setState({ disableRemove: true }) : this.setState({ disableRemove: false })
  }

  handleClick () {
    this.props.dispatch(viewDetail.initViewStore(this.props.data.Device_UID))
    this.props.dispatch(modalAction.closePopup())
    this.props.history.push({
      pathname: '/settings/ViewDetails'
    })
  }

  render () {
    return (
      <div>
        <div>
          <h4 className='cib_header'>CIB Settings</h4>
          <table className='user_form'>
            <tbody>
              <tr>
                <th><label for='Store_Name'> Store Number:</label></th>
                <td><input type='text' maxLength='100' name='Store_Name' id='Store_Name' value={this.props.data.Store_Number} disabled='disabled' />
                  <input type='hidden' name='Store_ID' id='Store_ID' value='112480' />
                </td>
              </tr>
              <tr>
                <th><label for='Store_Name'> Email:</label></th>
                <td><input type='text' maxLength='100' name='Store_Name' id='Store_Name' value={this.props.email} disabled='disabled' />
                  <input type='hidden' name='Store_ID' id='Store_ID' value='112480' />
                </td>
              </tr>
              <tr>
                <th><label for='Store_Name'> Brand:</label></th>
                <td> <select name='Store_Brand_ID' id='Store_Brand_ID' disabled='disabled'>
                  <option value="Checker's" selected='selected'>{this.props.data.Brand_Name}</option>
                  <option value='Dairy Queen' selected='selected'>Dairy Queen</option>
                </select>
                </td>
              </tr>
              <tr>
                <th><label for='Store_Name'> Time Zone:</label></th>
                <td> <select name='Store_Brand_ID' id='Store_Brand_ID' disabled='disabled'>
                  <option value="Checker's" selected='selected'>TimeZone</option>
                  <option value='Dairy Queen' selected='selected'>Dairy Queen</option>
                </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <h4 className='cib_header'>Registered CIB</h4>
        <table className='sys_table_widget sys_table'>
          <tbody>
            <tr className='theader'>
              <th />
              <th>System Version</th>
              <th>Serial Number</th>
              <th>System Status</th>
              <th />
            </tr>
            <tr className='tdata'>
              <td className='sys-ctr'>
                <input type='checkbox' name='checkbox' id='idname' className='sys-ion-check' onChange={this.enableRemoveBtn} />
              </td>
              <td >{this.props.data.Device_SettingVersion}</td>
              <td >{this.props.data.Device_SettingVersion}</td>
              <td>
                <img src={offlineImage} /><span> {this.props.data.Device_IsActive === 0 ? 'Offline' : 'Online'}</span></td>
              <td onClick={this.handleClick.bind(this)}><a>View <span>Details</span></a></td>
            </tr>
          </tbody>
        </table>
        {/* <div className='remove-sys'>
          <input className='remove-button' value='Remove System' />
        </div> */}
        {/* <div className={'remove-sys ' + (this.state.disableRemove ? 'show' : 'hide')}> */}
        <div className={'remove-sys ' + (this.props.storeModelPopupIsAdmin ? 'show' : 'hide')}>
          <a class='remove-system-device' href=''>
            <span className={'remove-device-item ' + (this.state.disableRemove ? 'disable-remove-device' : '')}>Remove System</span>
          </a>
        </div>
      </div>
    )
  }
}

export default CIBComponent
