import React, { Component } from 'react'
// import fetch from 'isomorphic-fetch'
// import { BrowserRouter } from 'react-router-dom'
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
  }

  displaySummarizedData (reportData) {
    if (reportData.singleDayPart.length > 0) {
      return reportData.singleDayPart.map((reportItem) => {
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
                  <th className={'reportTableAttributesHeading ' + this.dynamicColumnData.showDayColumn}><span>Day</span></th>
                  <th className={'reportTableAttributesHeading ' + this.dynamicColumnData.showDayPartColumn}><span>DayPart</span></th>
                  <th className={'reportTableAttributesHeading ' + this.dynamicColumnData.showWeekColumn}><span>Weekly</span></th>
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
            <td className={this.dynamicColumnData.showGroupsStores}>{reportItem.groupId != null ? reportItem.groupId : 'NA'}</td>
            <td className={this.dynamicColumnData.showGroupsStores} onClick={this.props.reportData.handleDrillDown}>{reportItem.storeId}</td>
            <td className={'timeMeasureColumn ' + this.dynamicColumnData.showDayColumn}><span className='timeSpan'>{reportItem.day? reportItem.day.timeSpan : '' }</span><br/><span className='currentMeasure'>{reportItem.day  ? reportItem.day.currentDaypart :''}</span></td>
            <td className={'timeMeasureColumn ' + this.dynamicColumnData.showDayPartColumn}><span className='timeSpan'>{reportItem.daypart.timeSpan}</span><br/><span className='currentMeasure'>{reportItem.daypart.currentDaypart}</span></td>
            <td className={'timeMeasureColumn '+ this.dynamicColumnData.showWeekColumn}><span>{reportItem.week}</span> </td>
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
    let reportData = this.props.reportData

    return (<div>{this.displaySummarizedData(reportData)}</div>)
  }
}
