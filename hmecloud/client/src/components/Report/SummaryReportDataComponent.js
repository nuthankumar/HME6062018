import React, { Component } from 'react'
// import fetch from 'isomorphic-fetch'
// import { BrowserRouter } from 'react-router-dom'
import LongestTime from './LongestTime'
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './SummaryReport.css'
import '../../../node_modules/font-awesome/css/font-awesome.min.css'
export default class SummaryReportDataComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
        currentLanguage: languageSettings.getCurrentLanguage()
    }
    this.dynamicColumnData = {
      showFromToTime: (this.props.reportData.dayColumn || this.props.reportData.dayPartColumn || this.props.reportData.weekColumn ? 'hide' : 'show'),
      showGroupsStores: (this.props.reportData.groupStoreColumns ? 'show-table-cell' : 'hide-table-cell'),
      showWeekColumn: (this.props.reportData.weekColumn ? 'show-table-cell' : 'hide-table-cell'),
      showDayColumn: (this.props.reportData.dayColumn ? 'show-table-cell' : 'hide-table-cell'),
      showDayPartColumn: (this.props.reportData.dayPartColumn ? 'show-table-cell' : 'hide-table-cell')
    }
    this.displaySummarizedData = this.displaySummarizedData.bind(this)
    this.displaySummarizedRowData = this.displaySummarizedRowData.bind(this)
    this.displayLongestTimes = this.displayLongestTimes.bind(this)
  }

  displaySummarizedData(reportData) {
     let language = this.state.currentLanguage
    if (reportData.response.timeMeasureType.length > 0) {
      return reportData.response.timeMeasureType.map((reportItem) => {
        return (
            <div className='col-xs-12 report-data-unit'>
                <div className={'col-xs-12 from-to-detail ' + this.dynamicColumnData.showFromToTime}><span>{reportItem.startTime}</span> <span>{t[language].OPEN} - </span> <span>{reportItem.endTime}</span> <span>{t[language].ReportsClose}</span></div>
            <table className='summaryreport-table'>
              <tbody>
                <tr>
                  <th className='blankHeader' />
                  <th className='tableHeading' colSpan='4'>
                     <span>{t[language].ReportsAverageTime}</span><span>(min:sec)</span>
                  </th>
                </tr>
                <tr>
                    <th className={'groupsColHeader ' + this.dynamicColumnData.showGroupsStores}><span>{t[language].Groups}</span></th>
                    <th className={'storesColHeader ' + this.dynamicColumnData.showGroupsStores}><span>{t[language].stores}</span></th>
                    <th className={'reporttable-attributes-heading-dynamic ' + this.dynamicColumnData.showDayColumn}><span>{t[language].Day}</span></th>
                    <th className={'reporttable-attributes-heading-dynamic ' + this.dynamicColumnData.showDayPartColumn}><span>{t[language].daypart}</span></th>
                    <th className={'reporttable-attributes-heading-dynamic ' + this.dynamicColumnData.showWeekColumn}><span>{t[language].Week}</span></th>
                    <th className='reportTableAttributesHeading'><span>{t[language].MenuBoard}</span></th>
                    <th className='reportTableAttributesHeading'><span>{t[language].Greet}</span></th>
                    <th className='reportTableAttributesHeading'><span>{t[language].Service}</span></th>
                    <th className='reportTableAttributesHeading'><span>{t[language].LaneQueue}</span></th>
                    <th className='reportTableAttributesHeading'><span>{t[language].LaneTotal}</span></th>
                    <th className='reportTableAttributesHeading'><span>{t[language].ReportsTotalCars}</span></th>
                </tr>
                {this.displaySummarizedRowData(reportItem.data)}
              </tbody>
            </table>
            {this.displayLongestTimes()}
          </div>
        )
      })
    } else {
      return <div>No records found</div>
    }
  }

  displaySummarizedRowData (reportRowData) {
      this.props.reportData.generate = false
      console.log(reportRowData);

    if (reportRowData.length > 0) {
        return reportRowData.map((reportItem) => {
            let menuColor = reportItem.menu.color
            let menuStyle = { backgroundColor: menuColor };
            let greetColor = reportItem.greet.color
            let greetStyle = { backgroundColor: greetColor };
            let serviceColor = reportItem.service.color
            let serviceStyle = { backgroundColor: serviceColor };
            let laneQueueColor = reportItem.laneQueue.color
            let laneQueueStyle = { backgroundColor: laneQueueColor };
            let laneTotalColor = reportItem.laneTotal.color
            let laneTotalStyle = { backgroundColor: laneTotalColor };

        return (
          <tr>
            <td className={this.dynamicColumnData.showGroupsStores}> {reportItem.groupId ? reportItem.groupId.value : '' }</td>
            <td className={this.dynamicColumnData.showGroupsStores}> <a href='#' className='' onClick={() => this.props.handleDrillDown(reportItem.storeId)}>{reportItem.storeId ? reportItem.storeId.value : ''} </a></td>
            <td className={'timeMeasureColumn ' + this.dynamicColumnData.showDayColumn} onClick={() => this.props.handleDrillDown(reportItem.storeId)}><span className='timeSpan'>{reportItem.day? reportItem.day.timeSpan : '' }</span><br/><span className='currentMeasure'>{reportItem.day  ? reportItem.day.currentDaypart :''}</span></td>
            <td className={'timeMeasureColumn ' + this.dynamicColumnData.showDayPartColumn} onClick={() => this.props.handleDrillDown(reportItem.storeId)}><span className='timeSpan'>{reportItem.daypart? reportItem.daypart.timeSpan : ''}</span><br/><span className='currentMeasure'>{reportItem.daypart ? reportItem.daypart.currentDaypart : ''}</span></td>
            <td className={'timeMeasureColumn ' + this.dynamicColumnData.showWeekColumn} onClick={() => this.props.handleDrillDown(reportItem.storeId)}><span>{reportItem.week? reportItem.week.timeSpan : ''}</span> <span className='currentMeasure'>{reportItem.week ? reportItem.week.currentDaypart : ''}</span></td>
            <td style={menuStyle}>{reportItem.menu.value}</td>
            <td style={greetStyle}>{reportItem.greet.value}</td>
            <td style={serviceStyle}>{reportItem.service.value}</td>
            <td style={laneQueueStyle}>{reportItem.laneQueue.value}</td>
            <td style={laneTotalStyle}>{reportItem.laneTotal.value}</td>
            <td>{reportItem.totalCars.value}</td>
          </tr>
        )
      })
    }else {
      return <div>No records found</div>
    }
  }

  displayLongestTimes() {
    if(this.props.reportData.longestTime){
      return(
        <LongestTime LongestTimes = {this.props.reportData.response.LongestTimes} className = {(this.props.reportData.singleStore) ? 'show' : 'hide'}/>
      )
    }else{
      return(
        <div/>
      )
    }
  }
  render() {
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

