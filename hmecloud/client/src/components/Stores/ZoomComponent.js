import React, { Component } from 'react'
import './Stores.css'
import { connect } from 'react-redux'
const offlineImage = require('../../images/connection_offline.png')
const OnlineImage = require('../../images/connection_online.png')

class ZoomComponent extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.renderRows = this.renderRows.bind(this)
  }

  handleClick(id) {
    this.props.viewDevice(id)
  }

  renderRows() {
    let row = this.props.stores.Device_Details
    row = row.filter(function (el) {
      return el.Device_Name !== 'CIB' && el.Device_Name !== 'ION' && el.Device_Name !== 'EOS'
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
        <h4 className='header'>Registered ZOOM</h4>
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
        <div className='remove-sys'>
          <a class='remove-system-device' href=''>
            <span className='remove-device-item disable-remove-device'>Remove System</span>
          </a>
        </div>
      </div>
    )
  }
}

// export default ZoomComponent
function mapStateToProps(state) {
  return {
    stores: state.StorePopupDetails.storePopupDetails
  }
}

export default connect(mapStateToProps)(ZoomComponent)
