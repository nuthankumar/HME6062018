import React, { Component } from 'react'
// import fetch from 'isomorphic-fetch'
import SummaryReportDataComponent from './SummaryReportDataComponent'
import GoalStatisticsDataComponent from './GoalStatisticsDataComponent'
import SystemStatistics from './SystemStatistics'
import PaginationComponent from '../Common/PaginationComponent'
import PageHeader from '../Header/PageHeader'
import moment from 'moment'
import { Config } from '../../Config'
import { CommonConstants } from '../../Constants'
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
import Api from '../../Api'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './SummaryReport.css'
import '../../../node_modules/font-awesome/css/font-awesome.min.css'
// import {config} from '../../config'
import Loader from '../Alerts/Loader'



export default class SummaryReport extends Component {
    constructor (props) {
        super (props)
        this.state = {
            currentLanguage: languageSettings.getCurrentLanguage(),
            showLoader: false,
            showGoalStats: true,
            showSystemStats: true,
            pageHeading: 'Summarized Report',
            showDownloadOptions:false,
            reportData: {
                currentPageNo: "",
                TotalPageCount: "",
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
             //  totalPages: 4,
                NoOfPages: 0,
                recordPerPage: 0,
                disablePrevButton: false,
                disableNextButton: false,
                longestTime: false,
                systemStatistics: false,
                generate: false,
                response: {},
                reportType:'',
                drillDownRequestData: {}
            }
        }
        // this.getCurrentTimeMeasure()
        // this.populateSummaryReportDetails()
        this.api = new Api()
        this.handleDrillDown = this.handleDrillDown.bind(this)
        this.headerDetails = this.headerDetails.bind(this)
    }

    componentWillMount () {
        //this.setTimeMeasures(this.props.history.location.state)
        this.populateSummaryReportDetails()
        this.state.templateData = this.props.history.location.state;
        this.setState(this.state)
    }

    headerDetails () {
        let language = this.state.currentLanguage
        if (this.state.reportData.singleStore) {
            return (<table className='rawcar-header-labels clear'>
                <tbody>
                    <tr>
                        <th className='thin-header'>
                          <span>{t[language].store}</span>:
                        </th>
                        <td className='thin-header'>{this.state.reportData.response.storeName ? this.state.reportData.response.storeName : this.state.reportData.response.storeNumber}</td>
                        <th>
                          <span>{t[language].ReportsStart}</span>
                        </th>
                        <td>
                          {this.state.reportData.response.startTime ? this.state.reportData.response.startTime +' '+ t[language].OPEN : 'N/A'}&nbsp;
                        </td>
                        <th>
                          <span>{t[language].ReportsPrintDate}</span>
                        </th>
                        <td> {this.state.reportData.response.printDate ? this.state.reportData.response.printDate : 'N/A'} </td>
                    </tr>
                    <tr>
                        <th>
                          <span>{t[language].Description}</span>
                        </th>
                        <td>{this.state.reportData.response.storeDesc ? this.state.reportData.response.storeDesc : 'N/A'}</td>
                        <th>
                            <span>{t[language].ReportsStop}</span>
                        </th>
                        <td>
                            {this.state.reportData.response.stopTime ? this.state.reportData.response.stopTime +' '+ t[language].CLOSE : 'N/A'}&nbsp;
                        </td>
                        <th>
                          <span>{t[language].ReportsPrintTime}</span>
                        </th>
                        <td>{moment(new Date()).format("hh:mm A")}</td>
                    </tr>
                </tbody>
            </table>)
        } else {
            return (<div>
                <div className='col-xs-3 left-padding-none'>
                    <h2 className='report-start-time-header'>
                        <span className='report-start-time'>{t[language].ReportsStart}</span>
                        <span className='report-start-time-value'>{moment(this.state.reportData.drillDownRequestData.fromDate).format("MMM D YYYY")} {t[language].OPEN}</span>
                    </h2>
                </div>
                <div className='col-xs-3 left-padding-none'>
                    <h2 className='report-end-time-header'>
                        <span className='report-end-time'>{t[language].ReportsEnd}</span>
                        <span className='report-end-time-value'>{moment(this.state.reportData.drillDownRequestData.toDate).format("MMM D YYYY")} {t[language].CLOSE}</span>
                    </h2>
                </div>

                <div className='col-xs-4 left-padding-none'>
                    <h2 className='report-print-time-header'>
                        <span className='report-print-time'> {t[language].ReportsPrintTime}</span>
                        <span className='report-print-time-value'> {moment(new Date()).format("MMM D YYYY hh:mm")}</span>
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
        switch (templateData.timeMeasure.toString()) {

            case '1': this.state.reportData.dailyData = true
                if (templateData.deviceIds.length === 1) {
                    this.state.reportData.dayColumn = true
                    this.state.reportData.dayPartColumn = false
                    this.state.reportData.weekColumn = false
                    this.state.reportData.groupStoreColumns = false
                    this.state.reportData.singleStore = true
                    this.state.reportData.reportType = 'd'
                } else {
                    this.state.reportData.dayColumn = false
                    this.state.reportData.groupStoreColumns = true
                    this.state.reportData.singleStore = false
                    this.state.reportData.dayPartColumn = false
                    this.state.reportData.weekColumn = false
                    this.state.reportData.reportType = 'md'
                }
                this.setState(this.state)
                break

            case '2': this.state.reportData.dayPartData = true
                if (templateData.deviceIds.length === 1) {
                    this.state.reportData.dayPartColumn = true
                    this.state.reportData.weekColumn = false
                    this.state.reportData.dayColumn = false
                    this.state.reportData.groupStoreColumns = false
                    this.state.reportData.singleStore = true
                    this.state.reportData.reportType = 'dp'
                } else {
                    this.state.reportData.dayColumn = false
                    this.state.reportData.dayPartColumn = false
                    this.state.reportData.weekColumn = false
                    this.state.reportData.groupStoreColumns = true
                    this.state.reportData.singleStore = false
                    this.state.reportData.reportType = 'mdp'

                }
                this.setState(this.state)
                break

            case '3': this.state.reportData.weeklyData = true
                if (templateData.deviceIds.length === 1) {
                    this.state.reportData.weekColumn = true
                    this.state.reportData.dayPartColumn = false
                    this.state.reportData.dayColumn = false
                    this.state.reportData.groupStoreColumns = false
                    this.state.reportData.singleStore = true
                    this.state.reportData.reportType = 'w'
                } else {
                    this.state.reportData.dayColumn = false
                    this.state.reportData.dayPartColumn = false
                    this.state.reportData.weekColumn = false
                    this.state.reportData.groupStoreColumns = true
                    this.state.reportData.singleStore = false
                    this.state.reportData.reportType = 'mw'
                }
                this.setState(this.state)
                break

            case '4': let url = Config.apiBaseUrl + 'api/report/getRawCarDataReport?reportType=rr1'
                this.api.postData(url, templateData, data => {
                    this.props.history.push({
                        pathname: '/rawcardatareport',
                        state: { rawCarRequest: templateData, rawCarData: data }
                    })
                }, error => {
                })
                break
        }
        // this.constructReportRequest(templateData)
    }   

    handleDrillDown (storeId) {
        // api call for getting the next drilldown
        this.state.showLoader = true
        this.setState(this.state)

        if (!this.state.reportData.generate) {
            this.state.reportData.generate = false
            // this.state.reportData.response = {}
            this.state.reportData.drillDownRequestData.pageNumber = 1
          //  this.reportData.drillDownRequestData.recordPerPage = this.state.reportData.recordPerPage
            this.state.reportData.curPage = 1
            this.state.reportData.pagination = true
            let request = this.state.reportData.drillDownRequestData
            // during drill down updating the store id in template request

            let currentStoreIds = request.deviceIds
            if (request.deviceIds.length > 1) {
                let array = []
                array.push(storeId.deviceId.value)
                request.deviceIds = array;
            }
             this.setState(this.state)
             this.setTimeMeasures(request)

            if (request.timeMeasure < 4) {
                if (currentStoreIds.length == 1) {
                    let timeMeasure = CommonConstants.Drilldown[parseInt(request.timeMeasure) - 1]
                    request.timeMeasure = timeMeasure;
                }
            }

            if (request.timeMeasure < 4) {
                 if(storeId.day){
                    request.fromDate = storeId.day.timeSpan
                    request.toDate = storeId.day.timeSpan
                 }else if(storeId.week){
                    request.fromDate = storeId.week.timeSpan.split("-")[0]
                    request.toDate = storeId.week.timeSpan.split("-")[1]
                 }
                 request.fromDate = moment(request.fromDate).format('YYYY-MM-DD')
                 request.toDate =  moment(request.toDate).format('YYYY-MM-DD')
                let url = Config.apiBaseUrl + CommonConstants.apiUrls.generateReport + '?reportType=reports'
                this.api.postData(url, request, data => {
                    request.deviceIds = data.deviceIds
                    this.setTimeMeasures(request)
                    this.state.showLoader = false
                    this.state.reportData.response = data
                    this.state.reportData.NoOfPages = data.totalRecordCount.NoOfPages
                    this.state.showLoader = false
                    this.setState(this.state)
                    this.props.history.push({
                        state: { reportData: this.state.reportData, reportDataResponse: data, reportRequest: request }
                    })
                }, error => {
                    this.state.successMessage = ''
                    this.state.errorMessage = error.message
                    this.state.showLoader = false
                    this.setState(this.state)
                })
            }else if(request.timeMeasure === 4){
                if(storeId.daypart){
                    // let year = request.fromDate.split("-")[0]
                    // let monthDay = storeId.daypart.timeSpan.split("-")[0]
                    // request.fromDate = year.concat('/'+monthDay)
                    // request.toDate = year.concat('/'+monthDay)
                    request.fromDate = moment(request.fromDate).format('YYYY-MM-DD')
                    request.toDate =  moment(request.toDate).format('YYYY-MM-DD')
                    request.openTime = storeId.daypart.currentDaypart.split("-")[0]
                    request.closeTime = storeId.daypart.currentDaypart.split("-")[1]
                }
                let url = Config.apiBaseUrl + 'api/report/getRawCarDataReport?reportType=rr1'
                this.api.postData(url, request, data => {
                    this.state.showLoader = false
                    this.setState(this.state)
                    this.props.history.push({
                        pathname: '/rawcardatareport',
                        state: { rawCarRequest:request, rawCarData: data }
                    })
                }, error => {
                    this.state.successMessage = ''
                    this.state.errorMessage = error.message
                    this.setState(this.state)
                })
            }
        }
    }

    populateSummaryReportDetails () {

        if (this.props.history.location.state) {
            this.state.reportData.generate = true
            let reportData = this.props.history.location.state.reportData
            this.state.reportData.weeklyData = reportData.weeklyData
            this.state.reportData.dailyData = reportData.dailyData
            this.state.reportData.dayPartData = reportData.dayPartData
            this.state.reportData.rawCarData = reportData.rawCarData
            this.state.reportData.groupStoreColumns = reportData.groupStoreColumns
            this.state.reportData.dayColumn = reportData.dayColumn
            this.state.reportData.dayPartColumn = reportData.dayPartColumn
            this.state.reportData.weekColumn = reportData.weekColumn
            this.state.reportData.singleStore = reportData.singleStore
            this.state.reportData.longestTime = reportData.longestTime
            this.state.reportData.systemStatistics = reportData.systemStatistics
            //  this.state.reportData = this.props.history.location.state.reportDataResponse
            this.state.reportData.response = this.props.history.location.state.reportDataResponse
            if(this.props.history.location.state.reportDataResponse.status){
              if (this.props.history.location.state.reportDataResponse.goalData && this.state.reportData.singleStore) {
                  this.state.goalData = this.props.history.location.state.reportDataResponse.goalData
              }
              this.state.reportData.NoOfPages = this.props.history.location.state.reportDataResponse.totalRecordCount.NoOfPages
              this.state.reportData.pagination = true
            } else{
              this.state.reportData.errorMsg = this.props.history.location.state.reportDataResponse.error
            }

            this.state.reportData.drillDownRequestData = this.props.history.location.state.reportRequest

      //      let totalRecords = this.props.history.location.state.reportDataResponse.totalRecordCount.TotalRecCount
            this.setState(this.state)
    //        this.calculateRecordsPerPage(this.state.reportData.NoOfPages,totalRecords)
        } else {
            this.state.reportData.generate = false
            this.setState(this.state)
        }
    }
    // calculateRecordsPerPage(totalPages,totalRecords){
    //   this.state.reportData.recordPerPage = totalRecords/totalPages
    //   this.setState(this.state)
    // }
    displayGoalStatistics() {
        if (this.props.history.location.state) {
            if (this.props.history.location.state.reportDataResponse && this.props.history.location.state.reportDataResponse.goalData && this.state.reportData.singleStore) {
                return (<div className='row goalstatistics-table-section'>
                    <GoalStatisticsDataComponent reportData = {this.state.reportData} goalData={this.state.goalData} />
                </div>)
            } else {
                return <div />
            }
        }
    }

    displaySystemStatistics() {
        if (this.state.reportData.systemStatistics && this.state.reportData.singleStore && this.props.history.location.state.reportDataResponse.systemStatistics) {
            return (<div className='row systemstatistics-table-section'>
                <SystemStatistics systemStats={this.props.history.location.state.reportDataResponse.systemStatistics} />
            </div>)
        } else {
            return <div />
        }
    }

    handlePreviousPage(curPage, totalPages) {
        if (curPage > 1) {
            this.state.reportData.disablePrevButton = false
            --curPage
            this.state.reportData.curPage = curPage
            this.state.reportData.drillDownRequestData.pageNumber = curPage
            this.getPageDetails(curPage)
        } else {
            this.state.reportData.disablePrevButton = true

            this.state.reportData.disableNextButton = false
        }
        this.setState(this.state)
        this.getPageDetails(curPage)
    }

    handleNextPage(curPage, totalPages) {
        if (curPage < totalPages) {
            this.state.reportData.disableNextButton = false
            ++curPage
            this.state.reportData.curPage = curPage
            this.state.reportData.drillDownRequestData.pageNumber = curPage
            this.getPageDetails(curPage)
        } else {
            this.state.reportData.disableNextButton = true
            this.state.reportData.disablePrevButton = false
        }
        this.setState(this.state)
    }

    getPageDetails (curPage) {
        this.state.showLoader = true
        this.setState(this.state)
        let url = Config.apiBaseUrl + CommonConstants.apiUrls.generateReport + '?reportType=reports'
        this.api.postData(url, this.state.reportData.drillDownRequestData, data => {
          /*  this.props.history.push({
                pathname: '/summaryreport',
                state: { reportData: this.state.reportData, reportDataResponse: data }
            })  */
            this.state.reportData = this.state.reportData
            this.state.reportData.response = data
            this.setState(this.state)
            this.state.showLoader = false
            this.setState(this.state)
        }, error => {
            this.state.successMessage = ''
            this.state.errorMessage = error.message
            this.setState(this.state)
        })
    }

    downloadPdf (type,e) {
       let request = this.state.reportData.drillDownRequestData
        let url;
        if (type == 'CSV')
        {
            url = Config.apiBaseUrl + CommonConstants.apiUrls.generateReport + '?reportType=csv';
        }
        if (type == 'PDF') {
           url = Config.apiBaseUrl + CommonConstants.apiUrls.generateReport + '?reportType=pdf';
        }
        this.setState({ showLoader: true });
        this.api.postData(url, request, data => {
            if (data.status) {
                this.state.errorMessage = ''
                // this.state.pdfEmailMessage = data.data
                this.setState(this.state)
                this.setState({ showLoader: false })
                this.props.history.push("/emailSent", data.data);
            }
        }, error => {
            this.state.successMessage = ''
            this.state.errorMessage = 'Failed sending Email'
            this.setState(this.state)
        })
    }

    switchAllPage(toggleType){
        if(toggleType === 'all'){
          this.state.reportData.pagination = false
          this.state.reportData.curPage = 0
          this.state.reportData.drillDownRequestData.pageNumber = 0
        }else{
          this.state.reportData.pagination = true
          this.state.reportData.curPage = 1
          this.state.reportData.drillDownRequestData.pageNumber = 1
        }
        this.setState(this.state)
        this.getPageDetails(this.state.reportData.curPage)
    }

  render() {
   // let { showLoader } = this.state;
    let language = this.state.currentLanguage
    // let reportData = this.state.reportData.data
    return (<section className="summaryReportsSection">
            <Loader showLoader={this.state.showLoader} />
            <div className={this.state.showLoader ? 'hide' : 'show'}>
              <section className='report-summary-page'>
                <section className='reportsummary-container'>
                    <div className='row download-btn-section downloadOptionsSection'>
                        <div className='btn btn-default download-summaryreport-btn' onClick={this.toggleDownload.bind(this)}>
                            <div>{t[language].download}</div>
                       </div>
                        <div className={(this.state.showDownloadOptions) ? 'downloadOptions show' : 'downloadOptions hidden'}>
                            <div onClick={this.downloadPdf.bind(this, 'PDF')}>PDF</div>
                            <div onClick={this.downloadPdf.bind(this, 'CSV')}>CSV</div>
                        </div>
                    </div>
                    <div className='pdfError'>{this.state.errorMessage}</div>
                    <PageHeader pageHeading={t[language].ReportsSummarizedReport} />

                    <div className='row'>
                        {this.headerDetails()}
                        <div className={'col-xs-2 show-all-pagination-toggle show-page-toggle pull-right show-all-single ' + (this.state.reportData.singleStore ? 'show' : 'hide')}>{t[language].ReportsShow}: <span className={(this.state.reportData.pagination) ? 'inactive-link' : 'active-link'} onClick={() => this.switchAllPage("all")}>{t[language].ReportsAll} /</span><span className={(this.state.reportData.pagination) ? 'active-link' : 'inactive-link'} onClick={() => this.switchAllPage("pages")}>{t[language].ReportsPages}</span></div>
                        <div className={'col-xs-2  pagination-single pull-right ' + (this.state.reportData.pagination &&  this.state.reportData.singleStore ? 'show' : 'hide')}>
                          <PaginationComponent pagination= {this.state.reportData.pagination} totalPages={this.state.reportData.NoOfPages}  curPage={this.state.reportData.curPage} handlePreviousPage={(curPage, totalPages) => this.handlePreviousPage(curPage, totalPages)} handleNextPage={(curPage, totalPages) => this.handleNextPage(curPage, totalPages)} disablePrevButton={this.state.reportData.disablePrevButton} disableNextButton={this.state.reportData.disableNextButton} />
                        </div>
                        <div className={'col-xs-2 pagination-multi pull-right ' + (this.state.reportData.pagination && !this.state.reportData.singleStore ? 'show' : 'hide')}>
                          <PaginationComponent pagination= {this.state.reportData.pagination} totalPages={this.state.reportData.NoOfPages}  curPage={this.state.reportData.curPage} handlePreviousPage={(curPage, totalPages) => this.handlePreviousPage(curPage, totalPages)} handleNextPage={(curPage, totalPages) => this.handleNextPage(curPage, totalPages)} disablePrevButton={this.state.reportData.disablePrevButton} disableNextButton={this.state.reportData.disableNextButton} />
                        </div>
                    </div>

                    <div className={'row show-all-multi ' + (this.state.reportData.singleStore ? 'hide' : 'show')}>
                        <div className='col-xs-12 show-all-pagination-toggle'>{t[language].ReportsShow}: <span className={(this.state.reportData.pagination) ? 'inactive-link' : 'active-link'} onClick={() => this.switchAllPage("all")}>{t[language].ReportsAll} /</span><span className={(this.state.reportData.pagination) ? 'active-link' : 'inactive-link'} onClick={() => this.switchAllPage("pages")}>{t[language].ReportsPages}</span></div>
                    </div>

                    <div className='row summaryreport-table-section'>
                        <SummaryReportDataComponent handleDrillDown={(storeId) => this.handleDrillDown(storeId)} reportData={this.state.reportData} drillDownRequestData={this.state.reportData.drillDownRequestData} />
                    </div>

                    <div className='row'>
                      <div className={'col-xs-4 pull-left show-page-toggle ' + (this.state.reportData.singleStore ? 'hide' : 'show' )}> <span className='show-label'>Show:</span> <span className={(this.state.reportData.pagination) ? 'inactive-link' : 'active-link'} onClick={() => this.switchAllPage("all")}>All /</span><span className={(this.state.reportData.pagination) ? 'active-link' : 'inactive-link'} onClick={() => this.switchAllPage("pages")}>Pages</span></div>
                      <div className={'col-xs-6 reports-terms ' + (this.state.reportData.singleStore ? 'hide' : 'show')}> <span className= 'asterics'>*</span>Derived performance to goal (Lane Queue goal = Lane Total goal - Menu goal - Service goal)</div>
                      <div className={'col-xs-2 left-padding-none pull-right ' + (this.state.reportData.pagination &&  this.state.reportData.singleStore ? 'show' : 'hide')}>
                          <PaginationComponent pagination={this.state.reportData.pagination} totalPages={this.state.reportData.NoOfPages}  curPage={this.state.reportData.curPage} handlePreviousPage={(curPage, totalPages) => this.handlePreviousPage(curPage, totalPages)} handleNextPage={(curPage, totalPages) => this.handleNextPage(curPage, totalPages)} disablePrevButton={this.state.reportData.disablePrevButton} disableNextButton={this.state.reportData.disableNextButton} />
                      </div>
                      <div className={'col-xs-2 left-padding-none ' + (this.state.reportData.pagination && !this.state.reportData.singleStore ? 'show' : 'hide')}>
                          <PaginationComponent pagination={this.state.reportData.pagination} totalPages={this.state.reportData.NoOfPages}  curPage={this.state.reportData.curPage} handlePreviousPage={(curPage, totalPages) => this.handlePreviousPage(curPage, totalPages)} handleNextPage={(curPage, totalPages) => this.handleNextPage(curPage, totalPages)} disablePrevButton={this.state.reportData.disablePrevButton} disableNextButton={this.state.reportData.disableNextButton} />
                      </div>
                    </div>
                    {this.displayGoalStatistics()}
                    {this.displaySystemStatistics()}
                </section>
              </section>
            </div>
        </section>)
  }

    toggleDownload (e) {
        let showDownLoad = this.state.showDownloadOptions
        this.setState({
            showDownloadOptions: !showDownLoad
        })
    }
}
