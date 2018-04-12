import React, { Component } from 'react'
// import fetch from 'isomorphic-fetch'
import SummaryReportDataComponent from './SummaryReportDataComponent'
import GoalStatisticsDataComponent from './GoalStatisticsDataComponent'
import SystemStatistics from './SystemStatistics'
import PaginationComponent from '../Common/PaginationComponent'
import PageHeader from '../Header/PageHeader'
import moment from 'moment'
import {Config} from '../../Config'
import {CommonConstants} from '../../Constants'
import Api from '../../Api'
// import { BrowserRouter } from 'react-router-dom'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './SummaryReport.css'
import '../../../node_modules/font-awesome/css/font-awesome.min.css'
// import {config} from '../../config'


export default class SummaryReport extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showGoalStats: true,
      showSystemStats: true,
      pageHeading : 'Summarized Report',
      reportData: {
        currentPageNo:"",
        TotalPageCount:"",
        weeklyData: false,
        dailyData: false,
        dayPartData: false,
        rawCarData: false,
        pagination: true,
        groupStoreColumns: false,
        dayColumn: false,
        dayPartColumn: false,
        weekColumn: false,
        singleStore: false,
        curPage: 1,
        totalPages:4,
        disablePrevButton: false,
        disableNextButton: false,
        longestTime: false,
        systemStatistics: false,
        response:{}
        }
    }
    // this.getCurrentTimeMeasure()
    // this.populateSummaryReportDetails()
    this.api = new Api()
  //  this.setTimeMeasures(this.props.history.location.state)
    this.handleDrillDown = this.handleDrillDown.bind(this)
    this.headerDetails = this.headerDetails.bind(this)
  }

  componentWillMount () {
    //this.setTimeMeasures(this.props.history.location.state)
    this.populateSummaryReportDetails()
    this.state.templateData = this.props.history.location.state;
    this.setState(this.state)
  }

  headerDetails(){
    if(this.state.reportData.singleStore){
      return(<table className='rawcar-header-labels clear'>
          <tbody>
            <tr>
              <th className='thin-header'>
                <span>Store</span>:
              </th>
              <td className='thin-header'>{this.state.reportData.storeName ? this.state.reportData.storeName : 'N/A' }</td>
              <th>
                <span>Start Time:</span>
              </th>
              <td>
                {this.state.reportData.startTime ? this.state.reportData.startTime : 'N/A'}&nbsp;
              </td>
              <th>
                <span>Print Date:</span>
              </th>
              <td> {this.state.reportData.printDate ? this.state.reportData.printDate : 'N/A'} </td>
            </tr>
            <tr>
              <th>
                <span>Description:</span>
              </th>
              <td>{this.state.reportData.storeDesc ? this.state.reportData.storeDesc : 'N/A'}</td>
              <th>
                <span>Stop Time:</span>
              </th>
              <td>
                {this.state.reportData.stopTime ? this.state.reportData.stopTime : 'N/A' }&nbsp;
              </td>
              <th>
                <span>Print Time: </span>
              </th>
              <td>{this.state.reportData.printTime ? this.state.reportData.printTime : 'N/A' }</td>
            </tr>
          </tbody>
        </table>)
    }else{
        return(<div>
          <div className='col-xs-3 left-padding-none'>
            <h2 className='report-start-time-header'>
              <span className='report-start-time'>Start Time:</span>
              <span className='report-start-time-value'>MAR 31,2018 OPEN</span>
            </h2>
          </div>
          <div className='col-xs-3 left-padding-none'>
            <h2 className='report-end-time-header'>
              <span className='report-end-time'>End Time:</span>
              <span className='report-end-time-value'>MAR 31,2018 OPEN</span>
            </h2>
          </div>

          <div className='col-xs-4 left-padding-none'>
            <h2 className='report-print-time-header'>
              <span className='report-print-time'> Report Print Time</span>
              <span className='report-print-time-value'> APR2, 2019 4:08 AM</span>
            </h2>
          </div>
        </div>)
    }
  }

  setTimeMeasures (templateData) {
    /******
    checking for time measure selected after filling template and generating report.
    Mapping day, daypart week and raw car data as 1, 2,3 and 4 respectively
    */
    switch (templateData[0].timeMeasure) {
      case '1' : this.state.dailyData = true
        if (templateData[0].selectedStoreIds.length === 1) {
          this.state.reportData.dayColumn = true
          this.state.reportData.groupStoreColumns = false
          this.state.singleStore = true
        } else {
          this.state.reportData.dayColumn = false
          this.state.reportData.groupStoreColumns = true
          this.state.singleStore = false
        }
        this.setState(this.state)
        break

      case '2' : this.state.dayPartData = true
        if (templateData[0].selectedStoreIds.length === 1) {
          this.state.reportData.dayPartColumn = true
          this.state.reportData.groupStoreColumns = false
          this.state.singleStore = true
        } else {
          this.state.reportData.dayPartColumn = false
          this.state.reportData.groupStoreColumns = true
          this.state.singleStore = false
        }
        this.setState(this.state)
        break

      case '3' : this.state.weeklyData = true
        if (templateData[0].selectedStoreIds.length === 1) {
          this.state.reportData.weekColumn = true
          this.state.reportData.groupStoreColumns = false
          this.state.singleStore = true
        } else {
          this.state.reportData.weekColumn = false
          this.state.reportData.groupStoreColumns = true
          this.state.singleStore = false
        }
        this.setState(this.state)
        break

      case '4' : this.state.rawCarData = true
        if (templateData[0].selectedStoreIds.length === 1) {
          this.state.reportData.dayPartColumn = true
          this.state.reportData.groupStoreColumns = false
          this.state.singleStore = true
        } else {
          this.state.reportData.dayPartColumn = false
          this.state.reportData.groupStoreColumns = true
          this.state.singleStore = false
        }
        this.setState(this.state)
        this.props.history.push("/rawcardatareport",this.state.templateData);
        break
    }
    // this.constructReportRequest(templateData)
  }

  constructReportRequest(templateData){
    let template = templateData[0]
    let request = {
     reportTemplateStoreIds: template.selectedStoreIds,
     reportTemplateAdvancedOp: template.advancedOptions,
     reportTemplateTimeMeasure: template.timeMeasure,
     reportTemplateFromDate: template.fromDate,
     reportTemplateToDate: template.toDate,
     reportTemplateOpen: template.open,
     reportTemplateClose: template.close,
     reportTemplateType: template.type,
     reportTemplateIncludeLongs: template.longestTime,
     ReportTemplate_Include_Stats: template.longestTime,
     reportTemplateFormat: template.format
    }
    return request
  //  this.populateSummaryReportDetails(request)
  }

  handleDrillDown () {
    // api call for getting the next drilldown
    if (this.state.weeklyData) {
      console.log('weekly data')

    } else if (this.state.dailyData) {
      console.log('daily data')
    } else if (this.state.dayPartData) {
      console.log('day data')
    } else if (this.state.rawCarData) {
      console.log('raw car data')
    }
  }

  populateSummaryReportDetails (request) {
    this.state.reportData.weeklyData = this.props.history.location.state.reportData.weeklyData
    this.state.reportData.dailyData = this.props.history.location.state.reportData.dailyData
    this.state.reportData.dayPartData = this.props.history.location.state.reportData.dayPartData
    this.state.reportData.rawCarData = this.props.history.location.state.reportData.rawCarData
    this.state.reportData.groupStoreColumns = this.props.history.location.state.reportData.groupStoreColumns
    this.state.reportData.dayColumn = this.props.history.location.state.reportData.dayColumn
    this.state.reportData.dayPartColumn = this.props.history.location.state.reportData.dayPartColumn
    this.state.reportData.weekColumn = this.props.history.location.state.reportData.weekColumn
    this.state.reportData.singleStore = this.props.history.location.state.reportData.singleStore
    this.state.reportData.longestTime = this.props.history.location.state.reportData.longestTime
    this.state.reportData.systemStatistics = this.props.history.location.state.reportData.systemStatistics
  //  this.state.reportData = this.props.history.location.state.reportDataResponse
    this.state.reportData.response = this.props.history.location.state.reportDataResponse
    console.log("**************",this.state.reportData.response)
    if(this.props.history.location.state.reportDataResponse.goalData && this.state.reportData.singleStore){
      this.state.goalData = this.props.history.location.state.reportDataResponse.goalData
    }
    this.setState(this.state)
  }
  displayGoalStatistics(){
    if(this.state.goalData && this.state.reportData.singleStore){
      return (<div className='row goalstatistics-table-section'>
        <GoalStatisticsDataComponent goalData = {this.state.goalData} />
      </div>)
    }else{
      return <div/>
    }
  }

  displaySystemStatistics(){
    if(this.state.displayData && this.state.reportData.singleStore){
      return (<div className='row systemstatistics-table-section'>
        <SystemStatistics displayData = {this.state.displayData} />
      </div>)
    }else{
      return <div/>
    }
  }

  handlePreviousPage(curPage,totalPages){
    if(curPage > 1){
      this.state.reportData.disablePrevButton = false
      --curPage
      this.state.reportData.curPage = curPage
    }else{
      this.state.reportData.disablePrevButton = true
      this.state.reportData.disableNextButton = false
    }
    this.setState(this.state)
    this.getPageDetails(curPage)
  }

  handleNextPage(curPage,totalPages){
    if(curPage < totalPages){
      this.state.reportData.disableNextButton = false
      ++curPage
      this.state.reportData.curPage = curPage
    }else{
      this.state.reportData.disableNextButton = true
        this.state.reportData.disablePrevButton = false
    }
    this.setState(this.state)
    this.getPageDetails(curPage)
  }

  getPageDetails(curPage){

    let request = {
      "timeMeasure": parseInt(this.state.reportData.timeMeasure),
      "fromDate": moment(this.state.reportData.fromDate).format('YYYY-MM-DD'),
      "toDate": moment(this.state.reportData.toDate).format('YYYY-MM-DD'),
      "openTime": this.state.reportData.openTime,
      "closeTime": this.state.reportData.closeTime,
      "open": this.state.reportData.open,
      "close": this.state.reportData.close,
      "type": this.state.reportData.type,
      "include": this.state.reportData.include,
      "format": this.state.reportData.format,
      "pagination": this.state.reportData.pagination,
      "currentPageNo": this.state.curPage,
      "offset": "2",
    //  "selectedStoreIds": template.selectedStoreIds,
      "selectedStoreIds": [ "4" ],
      "advancedOptions": this.state.reportData.advancedOptions,
      "longestTime": this.state.reportData.longestTime,
      "systemStatistics":this.state.reportData.systemStatistics
    }
    let url = Config.apiBaseUrl + CommonConstants.apiUrls.generateReport
    this.api.postData(url, request, data => {
        this.props.history.push({
            pathname: '/summaryreport',
            state: { reportData: this.state.reportData , reportDataResponse : data }
        })
    }, error => {
        this.state.successMessage = ''
        this.state.errorMessage = error.message
        this.setState(this.state)
    })
  }

  downloadPdf(templateData){
    let request = this.constructReportRequest(templateData[0])
    let url = Config.baseUrl + CommonConstants.apiUrls.generateReport
    this.api.postData(url, request, data => {
      if (data.status) {
          this.state.errorMessage = ''
          this.state.pdfEmailMessage = data.data
          this.setState(this.state)
          this.props.history.push("/emailSent", this.state.pdfEmailMessage);
       }
       }, error => {
      this.state.successMessage = ''
      this.state.errorMessage = 'Failed sending Email'
      this.setState(this.state)
    })
  }

  render () {
    // let reportData = this.state.reportData.data
    return (<section className='report-summary-page'>
      <section className='reportsummary-container'>
        <div className='row download-btn-section'>
          <button className='btn btn-default download-summaryreport-btn' onClick={() => this.downloadPdf(this.state.templateData[0])}>Download</button>
        </div>
        <div className='pdfError'>{this.state.errorMessage}</div>
        <PageHeader pageHeading={this.state.pageHeading} />

        <div className='row'>
          {this.headerDetails()}
          <div className={'col-xs-2 left-padding-none ' + (this.state.reportData.pagination ? 'show' : 'hide')}>
            <PaginationComponent pagination = {this.state.reportData.pagination} totalPages= {this.state.reportData.totalPages} curPage= {this.state.reportData.curPage} handlePreviousPage = {(curPage,totalPages) => this.handlePreviousPage(curPage,totalPages)} handleNextPage = {(curPage,totalPages) => this.handleNextPage(curPage,totalPages)} disablePrevButton= {this.state.reportData.disablePrevButton} disableNextButton= {this.state.reportData.disableNextButton}  />
          </div>
        </div>

        <div className='row'>
          <div className='col-xs-12 show-all-pagination-toggle'>Show: <span className={(this.state.pagination) ? 'inactive-link' : 'active-link'} onClick={() => this.setState({pagination: false})}>All /</span><span className={(this.state.pagination) ? 'active-link' : 'inactive-link' } onClick={() => this.setState({pagination: true})}>Pages</span></div>
        </div>

        <div className='row summaryreport-table-section'>
          <SummaryReportDataComponent handleDrillDown={this.handleDrillDown} reportData={this.state.reportData} />
        </div>
        {this.displayGoalStatistics()}
        {this.displaySystemStatistics()}
      </section>
    </section>)
  }
}
