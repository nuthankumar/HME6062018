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
    if (reportData.length > 0) {
      return reportData.map((reportItem) => {
        return (
          <div className='col-xs-12'>
          <div className='col-xs-12 fromToDetail'><span>{reportItem.startTime}</span> <span>OPEN - </span> <span>{reportItem.endTime}</span> <span>CLOSE</span></div>
            <table className='summaryReportTable'>
              <tbody>
                <tr>
                  <th className='blankHeader'></th>
                  <th className='tableHeading' colSpan='4'>
                    <span>AVERAGE TIME</span><span>(min:sec)</span>
                  </th>
                </tr>
                <tr>
                  <th className='groupsColHeader'><span>Groups</span></th>
                  <th className='storesColHeader'><span>Stores</span></th>
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
          <tr key={reportItem.groupId}>
          <td>{reportItem.groupId != null ? 'check' : 'NA'}</td>
          <td>{reportItem.storeId}</td>
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
