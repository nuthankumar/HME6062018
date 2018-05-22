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
  constructor(props) {
    super(props)
    this.state = {
      currentLanguage: languageSettings.getCurrentLanguage(),
      eventList : [],

    }
    this.displaySummarizedData = this.displaySummarizedData.bind(this)
    this.displaySummarizedRowData = this.displaySummarizedRowData.bind(this)
    this.displayLongestTimes = this.displayLongestTimes.bind(this)
    this.summaryDataTableCell = this.summaryDataTableCell.bind(this)
  }

  displaySummarizedData(reportData) {
    console.log("drilldown report data",reportData)
    let language = this.state.currentLanguage
    // let headers = this.state.timeMeasureTypeWrap.eventList
    if (reportData.response.status === true) {
      // if (this.state.timeMeasureTypeWrap.timeMeasureType.length > 0) {
        // return reportData.response.timeMeasureType.map((reportItem) => {
        if (reportData.response.timeMeasureType.length > 0) {
          return reportData.response.timeMeasureType.map((reportItem) => {
          return (
            <div className='report-data-unit'>
              <div className={'col-xs-12 from-to-detail ' + this.dynamicColumnData.showFromToTime}><span>{reportItem.title}</span></div>
              <table className='summaryreport-table'>
                <tbody>
                  {this.getSummarytableHeader(reportData.response.eventList)}
                  <tr>
                  {this.getSummaryTableSubHeader(reportItem,reportData.response.eventList)}
                  </tr>
                  {this.displaySummarizedRowData(reportItem.data,reportData.response.eventList)}
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

  getSummarytableHeader(headerList){
    let language = this.state.currentLanguage
    return(<tr>
      <th className='blankHeader' />
      <th className='tableHeading' colSpan={(this.props.reportData.singleStore ? headerList.length - 3 : headerList.length - 4)}>
        <span className='average-time-label'>{t[language].ReportsAverageTime}</span><span>(min:sec)</span>
      </th>
    </tr>)
  }

  getSummaryTableSubHeader(reportItem,headerList){
    let eventLength =headerList.length
    let colWidth = this.props.reportData.groupStoreColumns ? eventLength-3 : eventLength - 2 
    return headerList.map((headerItem) => {
     return( 
      // <th className={(headerItem === 'Groups' ? 'groupsColHeader' : '') + (headerItem == 'Store_Name' ? 'storesColHeader' : '') + (headerItem === 'Store_Name' || headerItem === 'Groups' || headerItem === 'week' || headerItem === 'day' || headerItem === 'daypart' ? 'reporttable-attributes-heading-dynamic'+colWidth : 'reportTableAttributesHeading')}><span>{headerItem}</span></th>
      <th className={(headerItem === 'Groups' ? 'groupsColHeader ' : '') + (headerItem == 'Stores' ? 'storesColHeader ' : '') + (headerItem === 'Stores' || headerItem === 'Groups' || headerItem === 'Week' || headerItem === 'Day' || headerItem === 'Daypart' ? 'reporttable-attributes-heading-dynamic ' : 'reportTableAttributesHeading'+colWidth) + (headerItem === 'Total Cars' ? ' total-cars' : '')}>
        <span>{headerItem}</span>
      </th>
      )
      
    })
    
  }

  displaySummarizedRowData(reportRowData,headers) {
    this.props.reportData.generate = false
    if (reportRowData.length > 0) {
      let dataColour = '#ffffff'
      return reportRowData.map((reportItem,index) => {
        // let menuColor = reportItem.menu.color
        // let menuStyle = { backgroundColor: menuColor, color: dataColour };
        // let greetColor = reportItem.greet.color
        // let greetStyle = { backgroundColor: greetColor, color: dataColour };
        // let serviceColor = reportItem.service.color
        // let serviceStyle = { backgroundColor: serviceColor, color: dataColour };
        // let laneQueueColor = reportItem.laneQueue.color
        // let laneQueueStyle = { backgroundColor: laneQueueColor, color: dataColour };
        // let laneTotalColor = reportItem.laneTotal.color
        // let laneTotalStyle = { backgroundColor: laneTotalColor, color: dataColour };

        return (
          <tr className = 'summary-row-data'>
              {this.summaryDataTableCell(reportItem,headers)}
          </tr>
            /* <td className={this.dynamicColumnData.showGroupsStores}> <span className='timeSpan'>{reportItem.groupId ? reportItem.groupId.value : ''}</span><br /><span className='currentMeasure'>{reportItem.groupId ? reportItem.groupId.timeSpan : ''}</span></td>
            <td className={this.dynamicColumnData.showGroupsStores}> <a href='#' className='store-name-number' onClick={(e) => { e.preventDefault(); this.props.handleDrillDown(reportItem) }}>{reportItem.store ? reportItem.store.name : ''} </a></td>
            <td className={'timeMeasureColumn ' + this.dynamicColumnData.showDayColumn} onClick={() => this.props.handleDrillDown(reportItem)}><span className='timeSpan'>{reportItem.day ? reportItem.day.timeSpan : ''}</span><br /><span className='currentMeasure'>{reportItem.day ? reportItem.day.currentDaypart : ''}</span></td>
            <td className={'timeMeasureColumn ' + this.dynamicColumnData.showDayPartColumn} onClick={() => this.props.handleDrillDown(reportItem)}><span className='timeSpan'>{reportItem.daypart ? reportItem.daypart.timeSpan : ''}</span><br /><span className='currentMeasure'>{reportItem.daypart ? reportItem.daypart.currentDaypart : ''}</span></td>
            <td className={'timeMeasureColumn ' + this.dynamicColumnData.showWeekColumn} onClick={() => this.props.handleDrillDown(reportItem)}><span className='timeSpan'>{reportItem.week ? reportItem.week.timeSpan : ''}</span> <br /> <span className='currentMeasure'>{reportItem.week ? reportItem.week.currentWeekpart : ''}</span></td>
            <td style={menuStyle} className={(reportItem.menu.value === "N/A" ? "background-NA" : "")}>{reportItem.menu.value}</td>
            <td style={greetStyle} className={(reportItem.greet.value === "N/A" ? "background-NA" : "")}>{reportItem.greet.value}</td>
            <td style={serviceStyle} className={(reportItem.service.value === "N/A" ? "background-NA" : "")}>{reportItem.service.value}</td>
            <td style={laneQueueStyle} className={(reportItem.laneQueue.value === "N/A" ? "background-NA" : laneQueueStyle.backgroundColor)}>{reportItem.laneQueue.value}</td>
            <td style={laneTotalStyle} className={(reportItem.laneTotal.value === "N/A" ? "background-NA" : "")}>{reportItem.laneTotal.value}</td>
            <td>{reportItem.totalCars.value === 0 ? '' : reportItem.totalCars.value }</td> */
          
        )
      })
    } else {
      this.props.reportData.pagination = false
      return <div>No records found</div>
    }
  }

  summaryDataTableCell(reportItem,headers){
    let self = this
    let dataColour = '#ffffff'
    return headers.map((headerItem,index) =>{
      let bgColor = { backgroundColor: reportItem[headerItem] ? reportItem[headerItem].color : '', color: dataColour }
      if( headerItem !== 'Daypart' && headerItem !== 'Week' && headerItem !== 'Day' && headerItem !== 'Groups' && headerItem !== 'Stores'){
        return(
          <td style={bgColor} className={(headerItem !== 'Daypart' && headerItem !== 'Week' && headerItem !== 'Day' && headerItem !== 'Groups' && headerItem !== 'Stores' ? 'show-table-cell ' : 'hide-table-cell ') + (reportItem[headerItem].value === 'N/A' ? 'greyBox ' : '') + (headerItem === 'Total Cars' ? 'font-black' : '')}> 
            <span className={(headerItem === undefined || reportItem[headerItem] === undefined || headerItem === 'daypart'? ' hide ' : reportItem[headerItem].value ? 'show ' : ' hide ')}>{(reportItem[headerItem] === undefined ? '' : reportItem[headerItem].value)} </span>
          </td>
        )
      }else if(headerItem === 'Daypart'){
        return(
        <td className={'timeMeasureColumn ' + (headerItem === 'Daypart' ? 'show-table-cell' : 'hide-table-cell')} onClick={(e) => {e.preventDefault(); this.props.handleDrillDown(reportItem)}}> 
        <span className={'timeSpan ' + (self.props.reportData.dayPartColumn &&  reportItem[headerItem] !== undefined && reportItem[headerItem] !== undefined ? 'show' : 'hide')}>{ headerItem === 'Daypart' ? reportItem[headerItem].timeSpan : ''}</span>  <span className={'currentMeasure ' + (self.props.reportData.dayPartColumn && reportItem[headerItem] !== undefined && reportItem[headerItem].currentWeekpart !== undefined ? 'show' : 'hide')}>{(headerItem !== undefined && headerItem === 'Daypart' ? reportItem[headerItem].currentWeekpart : '')}</span> 
        </td>
        )
      } else if(headerItem === 'Day'){
        return(
          <td className={'timeMeasureColumn ' + (headerItem === 'Day' ? 'show-table-cell' : 'hide-table-cell')} onClick={() => this.props.handleDrillDown(reportItem)}> 
            <span className={'timeSpan ' + (self.props.reportData.dayColumn &&  reportItem[headerItem] !== undefined && reportItem[headerItem] !== undefined ? 'show' : 'hide')}>{ headerItem === 'Day' ? reportItem[headerItem].timeSpan : ''}</span> 
            <span className={'currentMeasure ' + (self.props.reportData.dayColumn && reportItem[headerItem] !== undefined && reportItem[headerItem].currentWeekpart !== undefined ? 'show' : 'hide')}>{(headerItem !== undefined && headerItem === 'Day' ? reportItem[headerItem].currentWeekpart : '')}</span> 
          </td>
          )
      }else if(headerItem === 'Week'){ 
        return(
          <td className={'timeMeasureColumn ' + (headerItem === 'Week' ? 'show-table-cell' : 'hide-table-cell')} onClick={() => this.props.handleDrillDown(reportItem)}> 
            <span className={'timeSpan ' + (self.props.reportData.weekColumn &&  reportItem[headerItem] !== undefined && reportItem[headerItem] !== undefined ? 'show' : 'hide')}>{ headerItem === 'Week' ? reportItem[headerItem].timeSpan : ''}</span> 
            <span className={'currentMeasure ' + (self.props.reportData.weekColumn && reportItem[headerItem] !== undefined && reportItem[headerItem].currentWeekpart !== undefined ? 'show' : 'hide')}>{(headerItem !== undefined && headerItem === 'Week' ? reportItem[headerItem].currentWeekpart : '')}</span> 
          </td>
          )
      }else if(headerItem === 'Groups'){
        return(
          <td className = {(this.props.reportData.groupStoreColumns ? 'show-table-cell' : 'hide-table-cell')}>
            <span className='timeSpan'>{reportItem[headerItem] ? reportItem[headerItem].value : ''}</span>
            {/* <br />
            <span className='currentMeasure'>{reportItem[headerItem] ? reportItem[headerItem].timeSpan : ''}</span> */}
          </td>
        )
      }else if(headerItem === 'Stores'){
        return(
          <td calssName=''>
          {/* <a href='#' className={(headerItem === 'Stores' ? 'store-name-number' : '')} onClick={(e) => { e.preventDefault(); this.props.handleDrillDown(reportItem) }}>{reportItem[headerItem] ? reportItem[headerItem].value : ''} </a> */}
          <a href='#' className={(headerItem === 'Stores' ? 'store-name-number' : '')} onClick={(e) => { e.preventDefault(); this.props.handleDrillDown(reportItem) }}>{(headerItem === 'Stores' && reportItem[headerItem].value !== null ? reportItem[headerItem].value + '-' + reportItem.StoreNo.value  :  reportItem.StoreNo.value !== undefined ? reportItem.StoreNo.value : '')} </a>
          </td>
        )
      }
    })
  }

  displayLongestTimes() {
    if (this.props.reportData.response.LongestTimes) {
      return (
        <LongestTime LongestTimes={this.props.reportData.response.LongestTimes} reportData={this.props.reportData.response}  className={(this.props.reportData.singleStore) ? 'show' : 'hide'} />
      )
    } else {
      return (
        <div />
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
