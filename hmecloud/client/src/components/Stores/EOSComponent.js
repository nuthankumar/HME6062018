import React, { Component } from 'react'
import './Stores.css'
const offlineImage = require('../../images/connection_offline.png')
// import t from '../Language/language'
// import * as languageSettings from '../Language/languageSettings'

// export default class BookList extends Component {
class EOSComponent extends Component {
  // constructor (props) {
  //   super(props)
  // }

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

export default EOSComponent
