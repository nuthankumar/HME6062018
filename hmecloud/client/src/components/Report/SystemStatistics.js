import React, { Component } from 'react'
import './SummaryReport.css'

import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
// setTranslations({pt})
// setDefaultLanguage('pt')

class SystemStatistics extends Component {
  constructor (props) {
    super(props)
    // languageSettings.setCurrentLanguage ('fr');
    this.state = {
      currentLanguage: languageSettings.getCurrentLanguage(),
      displayData: {
        Lane: '1',
        AverageCarsInLane: '3',
        TotalPullouts: '0',
        TotalPullins: '0',
        DeleteOverMaximum: '0',
        PowerFails: '0',
        SystemResets: '0',
        VBDResets: '0'
      }
    }
    // this.displayRecords = this.displayRecords.bind(this)

    // console.log(languageSettings.getCurrentLanguage ());
  }

  render () {
    const language = this.state.currentLanguage
    let displayData = this.props.displayData
    console.log(this.props.displayData)
    return (
      <div>
        <div className='systemSec' id='page-container'>
          <h2 className='rep-head'><span>{t[language].systemstats}</span></h2>
          <table cellSpacing='0' className='table-layout-System ssBord col-width-ss5'>
            <tbody>
              <tr>
                <th className='lane1' colSpan='2'><span>{t[language].ReportsLane}</span> {displayData.Lane}</th>
              </tr>
              <tr>
                <td id='ss-col-width' className='rnshade'><span>{t[language].ReportsAverageCarsInLane}</span></td>
                <td id='ss-col-width-sm' className='rnshade'><strong>{displayData.AverageCarsInLane}</strong></td>
              </tr>
              <tr>
                <td id='ss-col-width' className='rshade'><span>{t[language].ReportsTotalPullouts}</span></td>
                <td className='rshade'>{displayData.TotalPullouts}</td>
              </tr>
              <tr>
                <td id='ss-col-width' className='rnshade'><span>{t[language].ReportsTotalPullins}</span></td>
                <td className='rnshade'>{displayData.TotalPullins}</td>
              </tr>
              <tr>
                <td id='ss-col-width' className='rshade'><span>{t[language].ReportsDeleteOverMax}</span></td>
                <td className='rshade'>{displayData.DeleteOverMaximum}</td>
              </tr>
              <tr>
                <td id='ss-col-width' className='rnshade'><span>{t[language].ReportsPowerFails}</span></td>
                <td className='rnshade'>{displayData.PowerFails}</td>
              </tr>
              <tr>
                <td id='ss-col-width' className='rshade'><span> {t[language].ReportsSystemResets}</span></td>
                <td className='rshade'>{displayData.SystemResets}</td>
              </tr>
              <tr>
                <td id='ss-col-width' className='rnshade'><span>{t[language].ReportsVBDResets}</span></td>
                <td className='rnshade'>{displayData.VBDResets}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          {t[language].username}
        </div>
      </div>
    )
  }
}

export default SystemStatistics
