import React, { Component } from 'react'
// import fetch from 'isomorphic-fetch'
// import { BrowserRouter } from 'react-router-dom'
import LongestTime from './LongestTime'
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './SummaryReport.css'
import '../../../node_modules/font-awesome/css/font-awesome.min.css'
import moment from 'moment'
const _ = require('underscore')
export default class SummaryReportDataComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentLanguage: languageSettings.getCurrentLanguage(),
      eventList: []
    }
    this.displaySummarizedData = this.displaySummarizedData.bind(this)
    this.displaySummarizedRowData = this.displaySummarizedRowData.bind(this)
    this.displayLongestTimes = this.displayLongestTimes.bind(this)
    this.summaryDataTableCell = this.summaryDataTableCell.bind(this)
  }

  translateFromTo (fromTo) {
    // to-do split od text to be removed
    if (fromTo) {
      let language = this.state.currentLanguage
      let string = fromTo.split(' ')
      string = _.filter(string, function (value) {
        return value
      })
      let fromToModified = null
      if (this.props.reportData.response.timeMeasure  == 1) {
        fromToModified = (t[language][string[0]] ? t[language][string[0]] : string[0]) + ' ' + string[1] + ' ' + (t[language][string[2]] ? t[language][string[2]] : string[2]) + ' ' + string[3] + ' ' + (t[language][string[4]] ? t[language][string[4]] : string[4]) + ' ' + string[5] + ' ' + (t[language][string[6]] ? t[language][string[6]] : string[6])
      } else if (this.props.reportData.response.timeMeasure  == 2) {
        fromToModified = (t[language][string[0]] ? t[language][string[0]] : string[0]) + ' ' + string[1] + ' ' + string[2] + ' ' + (t[language][string[3]] ? t[language][string[3]] : string[3]) + ' ' + string[4]
      } else if (this.props.reportData.response.timeMeasure  == 3) {
        fromToModified = (t[language][string[0]] ? t[language][string[0]] : string[0]) + ' ' + string[1] + ' ' + (t[language][string[2]] ? t[language][string[2]] : string[2]) + ' ' + string[3] + ' ' + (t[language][string[4]] ? t[language][string[4]] : string[4]) + ' ' + string[5] + ' ' + (t[language][string[6]] ? t[language][string[6]] : string[6])
      }
      return fromToModified
    }
  }

  displaySummarizedData (reportData) {
    if (reportData.response.status === true) {
      if (reportData.response.timeMeasureType.length > 0) {
        return reportData.response.timeMeasureType.map((reportItem) => {
          return (
            <div className='report-data-unit'>
              <div className={'col-xs-12 from-to-detail ' + this.dynamicColumnData.showFromToTime}><span>{this.translateFromTo(reportItem.title)}</span></div>
              <table className='summaryreport-table'>
                <tbody>
                  {this.getSummarytableHeader(reportData.response.eventList)}
                  <tr>
                    {this.getSummaryTableSubHeader(reportItem, reportData.response.eventList)}
                  </tr>
                  {this.displaySummarizedRowData(reportItem.data, reportData.response.eventList)}
                  {/* </tr> */}
                </tbody>
              </table>
              {this.displayLongestTimes()}
            </div>
          )
        })
      } else {
        return <div>No records found</div>
      }
    } else {
      return <div>{reportData.response.error}</div>
    }
  }

  getSummarytableHeader (headerList) {
    let language = this.state.currentLanguage
    return (<tr>
      <th className='blankHeader' />
      <th className='tableHeading' colSpan={(this.props.reportData.singleStore ? headerList.length - 3 : headerList.length - 4)}>
        <span className='average-time-label'>{t[language].ReportsAverageTime}</span><span>(min:sec)</span>
      </th>
    </tr>)
  }

  getSummaryTableSubHeader (reportItem, headerList) {
    let language = this.state.currentLanguage
    let eventLength = headerList.length
    let colWidth = this.props.reportData.groupStoreColumns ? eventLength - 3 : eventLength - 2
    return headerList.map((headerItem) => {
      return (
      // <th className={(headerItem === 'Groups' ? 'groupsColHeader' : '') + (headerItem == 'Store_Name' ? 'storesColHeader' : '') + (headerItem === 'Store_Name' || headerItem === 'Groups' || headerItem === 'week' || headerItem === 'day' || headerItem === 'daypart' ? 'reporttable-attributes-heading-dynamic'+colWidth : 'reportTableAttributesHeading')}><span>{headerItem}</span></th>
        <th className={(headerItem === 'Groups' ? 'groupsColHeader ' : '') + (headerItem === 'Stores' ? 'storesColHeader ' : '') + (headerItem === 'Stores' || headerItem === 'Groups' || headerItem === 'Week' || headerItem === 'Day' || headerItem === 'Daypart' ? 'reporttable-attributes-heading-dynamic ' : 'reportTableAttributesHeading' + colWidth) + (headerItem === 'Total Cars' ? ' total-cars' : '')}>
          <span>{t[language][headerItem] ? t[language][headerItem] : headerItem}</span>
        </th>
      )
    })
  }

  displaySummarizedRowData (reportRowData, headers) {
    this.props.reportData.generate = false
    if (reportRowData.length > 0) {
      return reportRowData.map((reportItem, index) => {
        return (
          <tr className='summary-row-data'>
            {this.summaryDataTableCell(reportItem, headers)}
          </tr>
        )
      })
    } else {
      this.props.reportData.pagination = false
      return <div>No records found</div>
    }
  }

  summaryDataTableCell (reportItem, headers) {
    let language = this.state.currentLanguage
    let self = this
    let dataColour = '#ffffff'
    return headers.map((headerItem, index) => {
      let bgColor = { backgroundColor: reportItem[headerItem] ? reportItem[headerItem].color : '', color: dataColour }
      if (headerItem !== 'Daypart' && headerItem !== 'Week' && headerItem !== 'Day' && headerItem !== 'Groups' && headerItem !== 'Stores') {
        return (
          <td style={bgColor} className={(headerItem !== 'Daypart' && headerItem !== 'Week' && headerItem !== 'Day' && headerItem !== 'Groups' && headerItem !== 'Stores' ? 'show-table-cell ' : 'hide-table-cell ') + (reportItem[headerItem].value === 'N/A' ? 'greyBox ' : '') + (headerItem === 'Total Cars' ? 'font-black' : '')}>
            <span className={(headerItem === undefined || reportItem[headerItem] === undefined || headerItem === 'daypart' ? ' hide ' : reportItem[headerItem].value ? 'show ' : ' hide ')}>{(reportItem[headerItem] === undefined ? '' : reportItem[headerItem].value)} </span>
          </td>
        )
      } else if (headerItem === 'Daypart') {
        // date value change date
        let date, number, value
        if (reportItem[headerItem] && reportItem[headerItem].timeSpan !== 'Total Daypart') {
          date = reportItem[headerItem].timeSpan.split('D')[0]
          number = reportItem[headerItem].timeSpan.slice(13, 14)
          value = reportItem[headerItem].timeSpan.slice(6, 13)
        } else {
          value = reportItem[headerItem].timeSpan
          date = ''
          number = ''
        }
        return (
          <td className={'timeMeasureColumn ' + (headerItem === 'Daypart' ? 'show-table-cell' : 'hide-table-cell')} onClick={(e) => { e.preventDefault(); this.props.handleDrillDown(reportItem) }}>
            {/* <span className={'timeSpan ' + (self.props.reportData.dayPartColumn &&  reportItem[headerItem] !== undefined && reportItem[headerItem] !== undefined ? 'show' : 'hide')}>{ headerItem === 'Daypart' ? (t[language][reportItem[headerItem].timeSpan] ? t[language][reportItem[headerItem].timeSpan]: reportItem[headerItem].timeSpan )  : ''}</span>  <span className={'currentMeasure ' + (self.props.reportData.dayPartColumn && reportItem[headerItem] !== undefined && reportItem[headerItem].currentWeekpart !== undefined ? 'show' : 'hide')}>{(headerItem !== undefined && headerItem === 'Daypart' ? (t[language][reportItem[headerItem].currentWeekpart]? t[language][reportItem[headerItem].currentWeekpart] : reportItem[headerItem].currentWeekpart) : '')}</span>  */}
            <span className={'timeSpan ' + (self.props.reportData.dayPartColumn && reportItem[headerItem] !== undefined && reportItem[headerItem] !== undefined ? 'show' : 'hide')}>{ headerItem === 'Daypart' ? date + t[language][value] + number : ''}</span>  <span className={'currentMeasure ' + (self.props.reportData.dayPartColumn && reportItem[headerItem] !== undefined && reportItem[headerItem].currentWeekpart !== undefined ? 'show' : 'hide')}>{(headerItem !== undefined && headerItem === 'Daypart' ? (t[language][reportItem[headerItem].currentWeekpart] ? t[language][reportItem[headerItem].currentWeekpart] : reportItem[headerItem].currentWeekpart) : '')}</span>
          </td>
        )
      } else if (headerItem === 'Day') {
        let value = reportItem[headerItem].timeSpan
        if (value === 'Total Day' || value === '' || value === null) {
          value = t[language][reportItem[headerItem].timeSpan] ? t[language][reportItem[headerItem].timeSpan] : reportItem[headerItem].timeSpan
        } else {
          value = moment(value).format('MM/DD/YYYY')
        }
        return (
          <td className={'timeMeasureColumn ' + (headerItem === 'Day' ? 'show-table-cell' : 'hide-table-cell')} onClick={() => this.props.handleDrillDown(reportItem)}>
            <span className={'timeSpan ' + (self.props.reportData.dayColumn && reportItem[headerItem] !== undefined && reportItem[headerItem] !== undefined ? 'show' : 'hide')}>{ headerItem === 'Day' ? value : ''}</span>
            <span className={'currentMeasure ' + (self.props.reportData.dayColumn && reportItem[headerItem] !== undefined && reportItem[headerItem].currentWeekpart !== undefined ? 'show' : 'hide')}>{(headerItem !== undefined && headerItem === 'Day' ? (t[language][reportItem[headerItem].currentWeekpart] ? t[language][reportItem[headerItem].currentWeekpart] : reportItem[headerItem].currentWeekpart) : '')}</span>
          </td>
        )
      } else if (headerItem === 'Week') {
        let value = reportItem[headerItem].timeSpan
        if (value === 'Total Week' || value === '' || value === null) {
          value = t[language][reportItem[headerItem].timeSpan] ? t[language][reportItem[headerItem].timeSpan] : reportItem[headerItem].timeSpan
        } else {
          let val1 = moment(value.split(' ')[0]).format('MM/DD')
          let val2 = moment(value.split(' ')[2]).format('MM/DD')
          value = val1 + '-' + val2
        }
        return (
          <td className={'timeMeasureColumn ' + (headerItem === 'Week' ? 'show-table-cell' : 'hide-table-cell')} onClick={() => this.props.handleDrillDown(reportItem)}>
            <span className={'timeSpan ' + (self.props.reportData.weekColumn && reportItem[headerItem] !== undefined && reportItem[headerItem] !== undefined ? 'show' : 'hide')}>
              {
                headerItem === 'Week'
                  ? value
                  : ''
              }
            </span>
            <span className={'currentMeasure ' + (self.props.reportData.weekColumn && reportItem[headerItem] !== undefined && reportItem[headerItem].currentWeekpart !== undefined ? 'show' : 'hide')}>{(headerItem !== undefined && headerItem === 'Week' ? (t[language][reportItem[headerItem].currentWeekpart] ? t[language][reportItem[headerItem].currentWeekpart] : reportItem[headerItem].currentWeekpart) : '')}</span>
          </td>
        )
      } else if (headerItem === 'Groups') {
        let value = reportItem[headerItem] ? reportItem[headerItem].value : ''
        if (value != null) { value = value.trim() }
        return (
          <td className={(this.props.reportData.groupStoreColumns ? 'show-table-cell' : 'hide-table-cell')}>
            <span className='timeSpan'> <span className='timeSpan'>{(value === 'Total Day' || value === 'Total Daypart' || value === 'Total Week') ? t[language][value] : value}</span></span>
            {/* <br />
            <span className='currentMeasure'>{reportItem[headerItem] ? reportItem[headerItem].timeSpan : ''}</span> */}
          </td>
        )
      } else if (headerItem === 'Stores') {
        // let value=(headerItem === 'Stores' && reportItem[headerItem].value !== null ? reportItem[headerItem].value + '-' + reportItem.StoreNo.value  :  reportItem.StoreNo.value !== undefined || reportItem.StoreNo.value==='Total Week'|| reportItem.StoreNo.value==='Total Day'|| reportItem.StoreNo.value=='Total Daypart' ? reportItem.StoreNo.value : '');
        // if(value reportItem.StoreNo.value==='Total Week'|| reportItem.StoreNo.value==='Total Day'|| reportItem.StoreNo.value=='Total Daypart' ) { value=value.trim()}
        return (
          <td calssName=''>
            {/* <a href='#' className={(headerItem === 'Stores' ? 'store-name-number' : '')} onClick={(e) => { e.preventDefault(); this.props.handleDrillDown(reportItem) }}>{reportItem[headerItem] ? reportItem[headerItem].value : ''} </a> */}
            <a href='#' className={(headerItem === 'Stores' ? 'store-name-number' : '')} onClick={(e) => { e.preventDefault(); this.props.handleDrillDown(reportItem) }}>{(headerItem === 'Stores' && reportItem[headerItem].value !== null && reportItem.StoreNo.value !== 'Total Week' && reportItem.StoreNo.value !== 'Total Day' && reportItem.StoreNo.value !== 'Total Daypart' ? reportItem[headerItem].value + '-' + reportItem.StoreNo.value : reportItem.StoreNo.value !== undefined && reportItem.StoreNo.value !== 'Total Week' && reportItem.StoreNo.value !== 'Total Day' && reportItem.StoreNo.value !== 'Total Daypart' ? reportItem.StoreNo.value : '')} </a>
          </td>
        )
      }
    })
  }

  displayLongestTimes () {
    if (this.props.reportData.response.LongestTimes) {
      return (
        <LongestTime LongestTimes={this.props.reportData.response.LongestTimes} reportData={this.props.reportData.response} className={(this.props.reportData.singleStore) ? 'show' : 'hide'} />
      )
    } else {
      return (
        <div />
      )
    }
  }
  render () {
    let reportData = this.props.reportData
    this.dynamicColumnData = {
      showFromToTime: (this.props.reportData.dayColumn || this.props.reportData.dayPartColumn || this.props.reportData.weekColumn ? 'hide' : 'show'),
      showGroupsStores: (this.props.reportData.groupStoreColumns ? 'show-table-cell' : 'hide-table-cell'),
      showWeekColumn: (this.props.reportData.weekColumn ? 'show-table-cell' : 'hide-table-cell'),
      showDayColumn: (this.props.reportData.dayColumn ? 'show-table-cell' : 'hide-table-cell'),
      showDayPartColumn: (this.props.reportData.dayPartColumn ? 'show-table-cell' : 'hide-table-cell')
    }
    return (<div>{this.displaySummarizedData(reportData)}</div>)
  }
}
