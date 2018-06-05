import React, { Component } from 'react'
import './Stores.css'
import { connect } from 'react-redux'
const offlineImage = require('../../images/connection_offline.png')
const OnlineImage = require('../../images/connection_online.png')

class CIBComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showStores: this.props.showStores,
      disableRemove: false
    }
    this.enableRemoveBtn = this.enableRemoveBtn.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.renderRows = this.renderRows.bind(this)
  }

  enableRemoveBtn(e) {
    return e.currentTarget.checked ? this.setState({ disableRemove: true }) : this.setState({ disableRemove: false })
  }

  handleClick(id) {
    this.props.viewDevice(id)
  }

  renderRows() {
    let row = this.props.stores.Device_Details
    row = row.filter(function (el) {
      return el.Device_Name !== 'EOS' && el.Device_Name !== 'ION' && el.Device_Name !== 'ZOOM'
    })
    let rows = row.map((data, index) => {
      return (
        <tr className='tdata'>
          <td className='sys-ctr'>
            <input type='checkbox' name='checkbox' id='idname' className='sys-ion-check' onChange={this.enableRemoveBtn} />
          </td>
          <td >{data.Device_SettingVersion}</td>
          <td >{data.Device_SerialNumber}</td>
          <td>
            <img src={OnlineImage} className={'cstat ' + (data.Device_IsActive ? '' : 'hidden')} alt='Device Online' />
            <img src={offlineImage} className={'cstat ' + (!data.Device_IsActive ? '' : 'hidden')} alt='Device Offline' />
            <span> {data.Device_IsActive === 0 ? 'Offline' : 'Online'}</span></td>
          <td onClick={() => this.handleClick(data.Device_UID)}><a>View <span>Details</span></a></td>
        </tr>
      )
    })
    return rows
  }

  render() {
    return (
      <div>
        <div>
          <h4 className='cib_header'>CIB Settings</h4>
          <table className='user_form'>
            <tbody>
              <tr>
                <th><label for='Store_Name'> Store Number:</label></th>
                <td><input type='text' maxLength='100' name='Store_Name' id='Store_Name' value={this.props.stores.storeDetails.Store_Number} disabled='disabled' />
                  <input type='hidden' name='Store_ID' id='Store_ID' value='112480' />
                </td>
              </tr>
              <tr>
                <th><label for='Store_Name'> Email:</label></th>
                <td><input type='text' maxLength='100' name='Store_Name' id='Store_Name' value={this.props.stores.storeDetails.User_EmailAddress} disabled='disabled' />
                  <input type='hidden' name='Store_ID' id='Store_ID' value='112480' />
                </td>
              </tr>
              <tr>
                <th><label for='Store_Name'> Brand:</label></th>
                <td> <select name='Store_Brand_ID' id='Store_Brand_ID' disabled='disabled'>
                  <option value="Checker's" selected='selected'>{this.props.stores.storeDetails.Brand_Name}</option>
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
            {this.renderRows()}
          </tbody>
        </table>
        <div className={'remove-sys ' + (this.props.storeModelPopupIsAdmin ? 'show' : 'hide')} >
          <a class='remove-system-device' href=''>
            <span className={'remove-device-item ' + (this.state.disableRemove ? 'disable-remove-device' : '')}>Remove System</span>
          </a>
        </div >
      </div >
    )
  }
}

function mapStateToProps(state) {
  return {
    stores: state.StorePopupDetails.storePopupDetails
  }
}

export default connect(mapStateToProps)(CIBComponent)
