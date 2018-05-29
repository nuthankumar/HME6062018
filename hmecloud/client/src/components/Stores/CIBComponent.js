import React, { Component } from 'react'
import './Stores.css'
const offlineImage = require('../../images/connection_offline.png')
// import t from '../Language/language'
// import * as languageSettings from '../Language/languageSettings'

// export default class BookList extends Component {
class CIBComponent extends Component { // ensure you dont export component directly
  constructor (props) {
    super(props)
    this.state = {
      showStores: this.props.showStores
    }
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
                <td><input type='text' maxLength='100' name='Store_Name' id='Store_Name' value='' disabled='disabled' />
                  <input type='hidden' name='Store_ID' id='Store_ID' value='112480' />
                </td>
              </tr>
              <tr>
                <th><label for='Store_Name'> Email:</label></th>
                <td><input type='text' maxLength='100' name='Store_Name' id='Store_Name' value='' disabled='disabled' />
                  <input type='hidden' name='Store_ID' id='Store_ID' value='112480' />
                </td>
              </tr>
              <tr>
                <th><label for='Store_Name'> Brand:</label></th>
                <td> <select name='Store_Brand_ID' id='Store_Brand_ID' disabled='disabled'>
                  <option value="Checker's" selected='selected'>Checker's</option>
                  <option value='Dairy Queen' selected='selected'>Dairy Queen</option>
                </select>
                </td>
              </tr>
              <tr>
                <th><label for='Store_Name'> Time Zone:</label></th>
                <td> <select name='Store_Brand_ID' id='Store_Brand_ID' disabled='disabled'>
                  <option value="Checker's" selected='selected'>Checker's</option>
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
                <input type='checkbox' name='checkbox' id='idname' className='sys-ion-check' onchange="enableRemove('ion');" />
              </td>
              <td >1.22 C-</td>
              <td >00-1D-06-00-10-1E</td>
              <td>
                <img src={offlineImage} /><span>Offline</span></td>
              <td><a>View <span>Details</span></a></td>
            </tr>
            <tr className='tdata'>
              <td className='sys-ctr'>
                <input type='checkbox' name='checkbox' id='idname' className='sys-ion-check' onchange="enableRemove('ion');" />
              </td>
              <td >1.22 C-</td>
              <td >00-1D-06-00-10-1E</td>
              <td>
                <img src={offlineImage} /><span>Offline</span></td>
              <td><a>View <span>Details</span></a></td>
            </tr>
          </tbody>
        </table>
        <div className='remove-sys'>
          <input className='remove-button' value='Remove System' />
        </div>
      </div>
    )
  }
}

export default CIBComponent
