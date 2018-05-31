import React, { Component } from 'react'
import './Stores.css'
import * as modalAction from '../../actions/modalAction'
import * as viewDetail from '../../actions/viewDetails'
const offlineImage = require('../../images/connection_offline.png')

class EOSComponent extends Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
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
            <tr className='tdata'>
              <td className='sys-ctr'>
                <input type='checkbox' name='checkbox' id='idname' className='sys-ion-check' onchange="enableRemove('ion');" />
              </td>
              <td >{this.props.data.Device_SettingVersion}</td>
              <td >{this.props.data.Device_SerialNumber}</td>
              <td>
                <img src={offlineImage} /><span> {this.props.data.Device_IsActive === 0 ? 'Offline' : 'Online'}</span></td>
              <td onClick={this.handleClick.bind(this)}><a>View <span>Details</span></a></td>
            </tr>
            {/* <tr className='tdata'>
              <td className='sys-ctr'>
                <input type='checkbox' name='checkbox' id='idname' className='sys-ion-check' onchange="enableRemove('ion');" />
              </td>
              <td >1.22 C-</td>
              <td >00-1D-06-00-10-1E</td>
              <td>
                <img src={offlineImage} /><span>Offline</span></td>
              <td><a>View <span>Details</span></a></td>
            </tr> */}
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
