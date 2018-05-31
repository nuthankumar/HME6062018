import React, { Component } from 'react'
import './Stores.css'
import * as modalAction from '../../actions/modalAction'
import * as viewDetail from '../../actions/viewDetails'
const offlineImage = require('../../images/connection_offline.png')

class EOSComponent extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.renderRows = this.renderRows.bind(this)
  }
  handleClick() {
    this.props.dispatch(viewDetail.initViewStore(this.props.data.Device_UID))
    this.props.dispatch(modalAction.closePopup())
    this.props.history.push({
      pathname: '/settings/ViewDetails'
    })
  }

  renderRows() {
    let row = this.props.data
    row = row.filter(function (el) {
      return el.Device_Name !== 'CIB' && el.Device_Name !== 'ION' && el.Device_Name !== 'ZOOM'
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
            <img src={offlineImage} /><span> {data.Device_IsActive === 0 ? 'Offline' : 'Online'}</span></td>
          <td onClick={this.handleClick}><a>View <span>Details</span></a></td>
        </tr>
      )
    })
    return rows
  }

  render() {
    return (
      <div>
        <h4 className='header'>Registered EOS</h4>
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

export default EOSComponent
