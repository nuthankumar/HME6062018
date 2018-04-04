import React, { Component } from 'react'
import App from '../../App'
import SuccessAlert from '../Alerts/SuccessAlert'
import ErrorAlert from '../Alerts/ErrorAlert'
import fetch from 'isomorphic-fetch'
import HmeHeader from '../Header/HmeHeader'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './SummaryReport.css'
import '../../../node_modules/font-awesome/css/font-awesome.min.css';

const hmeLogo = require('../../images/HMELogo.png')
const zoomLogo = require('../../images/ZoomLogo.PNG')
var body = require('body-parser')
var _ = require('underscore')

export default class SummaryReportDataComponent extends Component {
  constructor (props) {
    super()
    this.state = {
    }
    this.displaySummarizedData = this.displaySummarizedData.bind(this);
    this.displaySummarizedRowData = this.displaySummarizedRowData.bind(this);
  }

  displaySummarizedData (reportData) {
    if (reportData.dayPart.all.length > 0) {
      return reportData.dayPart.all.map((reportItem) => {
        return (
          <div className='col-xs-12 reportDataUnit'>
          <div className={'col-xs-12 fromToDetail '+(this.props.reportData.dayPartColumn ? 'hide' : 'show')}><span>{reportItem.startTime}</span> <span>OPEN - </span> <span>{reportItem.endTime}</span> <span>CLOSE</span></div>
            <table className='summaryReportTable'>
              <tbody>
                <tr>
                  <th className='blankHeader'></th>
                  <th className='tableHeading' colSpan='4'>
                    <span>AVERAGE TIME</span><span>(min:sec)</span>
                  </th>
                </tr>
                <tr>
                  <th className={'groupsColHeader '+(this.props.reportData.groupStoreColumns ? 'showTableCell' : 'hideTableCell')}><span>Groups</span></th>
                  <th className={'storesColHeader '+(this.props.reportData.groupStoreColumns ? 'showTableCell' : 'hideTableCell')}><span>Stores</span></th>
                  <th className={'reportTableAttributesHeading '+(this.props.reportData.dayPartColumn ? 'showTableCell' : 'hideTableCell')}><span>DayPart</span></th>
                  <th className='reportTableAttributesHeading'><span>Menu</span></th>
                  <th className='reportTableAttributesHeading'><span>Greet</span></th>
                  <th className='reportTableAttributesHeading'><span>Service</span></th>
                  <th className='reportTableAttributesHeading'><span>Lane Queue</span></th>
                  <th className='reportTableAttributesHeading'><span>Lane Total</span></th>
                  <th className='reportTableAttributesHeading'><span>Total Cars</span></th>
                </tr>
                {this.displaySummarizedRowData(reportItem.data)}
              </tbody>
            </table>
            </div>
      )
      })
    } else {
      return <div>No records found</div>
    }
  }

  displaySummarizedRowData (reportRowData) {
    if (reportRowData.length > 0) {
      return reportRowData.map((reportItem) => {
        return (
          <tr>
          <td className={(this.props.reportData.groupStoreColumns ? 'showTableCell' : 'hideTableCell')}>{reportItem.groupId != null ? reportItem.groupId : 'NA'}</td>
          <td className={(this.props.reportData.groupStoreColumns ? 'showTableCell' : 'hideTableCell')} onClick={this.props.reportData.handleDrillDown}>{reportItem.storeId}</td>
          <td className={(this.props.reportData.dayPartColumn ? 'showTableCell' : 'hideTableCell')}><span>{reportItem.daypart}</span></td>
          <td>{reportItem.menu}</td>
          <td>{reportItem.greet}</td>
          <td>{reportItem.service}</td>
          <td>{reportItem.laneQueue}</td>
          <td>{reportItem.laneTotal}</td>
          <td>{reportItem.totalCars}</td>
        </tr>
      )
      })
    } else {
      return <div>No records found</div>
    }
  }


  render () {
    let reportData = this.props.reportData;

    return (<div>{this.displaySummarizedData(reportData)}</div>);
  }
}
