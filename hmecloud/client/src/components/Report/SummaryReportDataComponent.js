import React, { Component } from 'react'
// import fetch from 'isomorphic-fetch'
// import { BrowserRouter } from 'react-router-dom'
import LongestTime from './LongestTime'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './SummaryReport.css'
import '../../../node_modules/font-awesome/css/font-awesome.min.css'
export default class SummaryReportDataComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {

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

  displaySummarizedData (reportData) {
    if (reportData.response.timeMeasureType.length > 0) {
      return reportData.response.timeMeasureType.map((reportItem) => {
        return (
          <div className='col-xs-12 report-data-unit'>
            <div className={'col-xs-12 from-to-detail ' + this.dynamicColumnData.showFromToTime}><span>{reportItem.startTime}</span> <span>OPEN - </span> <span>{reportItem.endTime}</span> <span>CLOSE</span></div>
            <table className='summaryreport-table'>
              <tbody>
                <tr>
                  <th className='blankHeader' />
                  <th className='tableHeading' colSpan='4'>
                    <span>AVERAGE TIME</span><span>(min:sec)</span>
                  </th>
                </tr>
                <tr>
                  <th className={'groupsColHeader ' + this.dynamicColumnData.showGroupsStores}><span>Groups</span></th>
                  <th className={'storesColHeader ' + this.dynamicColumnData.showGroupsStores}><span>Stores</span></th>
                  <th className={'reporttable-attributes-heading-dynamic ' + this.dynamicColumnData.showDayColumn}><span>Day</span></th>
                  <th className={'reporttable-attributes-heading-dynamic ' + this.dynamicColumnData.showDayPartColumn}><span>DayPart</span></th>
                  <th className={'reporttable-attributes-heading-dynamic ' + this.dynamicColumnData.showWeekColumn}><span>Weekly</span></th>
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
            {this.displayLongestTimes()}
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
            <td className={this.dynamicColumnData.showGroupsStores}>{reportItem.groupId ? reportItem.groupId.value : '' }</td>
            <td className={this.dynamicColumnData.showGroupsStores} onClick={this.props.reportData.handleDrillDown}>{reportItem.storeId ? reportItem.storeId.value : ''}</td>
            <td className={'timeMeasureColumn ' + this.dynamicColumnData.showDayColumn}><span className='timeSpan'>{reportItem.day? reportItem.day.timeSpan : '' }</span><br/><span className='currentMeasure'>{reportItem.day  ? reportItem.day.currentDaypart :''}</span></td>
            <td className={'timeMeasureColumn ' + this.dynamicColumnData.showDayPartColumn}><span className='timeSpan'>{reportItem.daypart? reportItem.daypart.timeSpan : ''}</span><br/><span className='currentMeasure'>{reportItem.daypart ? reportItem.daypart.currentDaypart : ''}</span></td>
            <td className={'timeMeasureColumn '+ this.dynamicColumnData.showWeekColumn}><span>{reportItem.week? reportItem.week.timeSpan : ''}</span> <span className='currentMeasure'>{reportItem.week ? reportItem.week.currentDaypart : ''}</span></td>
            <td>{reportItem.menu.value}</td>
            <td>{reportItem.greet.value}</td>
            <td>{reportItem.service.value}</td>
            <td>{reportItem.laneQueue.value}</td>
            <td>{reportItem.laneTotal.value}</td>
            <td>{reportItem.totalCars.value}</td>
          </tr>
        )
      })
    } else {
      return <div>No records found</div>
    }
  }

  displayLongestTimes() {

      console.log(this.props.reportData);
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
  render () {
    let reportData = this.props.reportData
    return (<div>{this.displaySummarizedData(reportData)}</div>)
  }
}
