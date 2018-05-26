import React, { Component } from 'react'
import './Stores.css'
// import t from '../Language/language'
// import * as languageSettings from '../Language/languageSettings'
// export default class BookList extends Component {
class RegisteredDeviceComponent extends Component {
  constructor (props) {
    super(props)
  }

  renderTableContent () {
    return (
      this.props.deviceDetails.CIB.map((device) => {
        return (<tr>
          <td>{device.Device_MainVersion}</td>
          <td>{device.Device_SerialNumber}</td>
          <td>{device.Device_SerialNumber}</td>
          <td>{device.Device_SerialNumber}</td>
        </tr>)
      })
    )
  }
  render () {
    return (
      <div>
        <h4>Registered CIB</h4>
        <table className='ctable sys-table sys-cib'>
          <tbody>
            <tr className='theader clear'>
              {/* <th></th> */}
              <th>System Version</th>
              <th>Serial Number</th>
              <th>System Status</th>
              <th />
            </tr>
            {this.renderTableContent()}
          </tbody>
        </table>
      </div>
    )
  }
}

export default RegisteredDeviceComponent
