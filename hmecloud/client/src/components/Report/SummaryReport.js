import React, { Component } from 'react'
// import fetch from 'isomorphic-fetch'
import HmeHeader from '../Header/HmeHeader'
import SummaryReportDataComponent from './SummaryReportDataComponent'
import GoalStatisticsDataComponent from './GoalStatisticsDataComponent'
import SystemStatistics from './SystemStatistics'
import PageHeader from '../Header/PageHeader'
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
        week: {
          all: [ {
            startTime: 'MAR 9',
            endTime: 'MAR 10',
            data: [{groupId: null, storeId: 12345, week: '04/04/2018', menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5},
              {groupId: 'G002', storeId: 12345, week: '04/04/2018', menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5},
              {groupId: 'G003', storeId: 12345, week: '04/04/2018', menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5},
              {groupId: 'G004', storeId: 12345, week: '04/04/2018', menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
          },
          {
            startTime: 'MAR 9',
            endTime: 'MAR 10',
            data: [{groupId: 'G001', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5},
              {groupId: 'G002', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5},
              {groupId: 'G003', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5},
              {groupId: 'G004', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
          },
          {
            startTime: 'MAR 9',
            endTime: 'MAR 10',
            data: [{groupId: 'G001', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5},
              {groupId: 'G002', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5},
              {groupId: 'G003', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5},
              {groupId: 'G004', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
          },
          {
            startTime: 'MAR 9',
            endTime: 'MAR 10',
            data: [{groupId: 'G001', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5},
              {groupId: 'G002', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5},
              {groupId: 'G003', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5},
              {groupId: 'G004', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
          }
          ],
          pages: [
            {
              startTime: 'MAR 9',
              endTime: 'MAR 10',
              data: [{groupId: 'G005', storeId: null, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
            },
            {
              startTime: 'MAR 9',
              endTime: 'MAR 10',
              data: [{groupId: 'G006', storeId: null, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
            }
          ]
        },
        day: {

          all: [ {
            TimeMeasure: 'mar 9 - mar 10th',
            data: [{groupId: 'G001', storeId: null, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
          },
          {
            TimeMeasure: 'mar 9 - mar 10th',
            data: [{groupId: 'G001', storeId: null, day: '04/04/2018', menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
          },
          {
            TimeMeasure: 'mar 9 - mar 10th',
            data: [{groupId: 'G001', storeId: null, day: '05/04/2018', menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
          },
          {
            TimeMeasure: 'mar 9 - mar 10th',
            data: [{groupId: 'G001', storeId: null, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
          }
          ],
          pages: [
            {
              TimeMeasure: 'mar 9 - mar 10th',
              data: [{groupId: 'G001', storeId: null, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
            },
            {
              TimeMeasure: 'mar 9 - mar 10th',
              data: [{groupId: 'G001', storeId: null, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
            }
          ]
        },
        dayPart: {
          storeName: '',
          storeDesc: '',
          startTime:'',
          stopTime: '',
          printDate: '',
          printTime:'',
          all: [ {
            startTime: 'MAR 9',
            endTime: 'MAR 10',
            data: [{groupId: 'G001', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
          },
          {
            startTime: 'MAR 9',
            endTime: 'MAR 10',
            data: [{groupId: 'G001', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
          }
            /* {
                      startTime:'MAR 9',
                      endTime:'MAR 10',
                      data:[{groupId: 'G001', storeId: '123456', daypart : "03-09 Daypart 1", menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5},
                            {groupId: 'G002', storeId: '1234567', daypart : "03-09 Daypart 2", menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
                    } */
          ],
          pages: [
            {
              TimeMeasure: 'mar 9 - mar 10th',
              data: [{groupId: 'G001', storeId: '12345', menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
            },
            {
              TimeMeasure: 'mar 9 - mar 10th',
              data: [{groupId: 'G001', storeId: '12345', menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
            }
          ]
        }
      },
      weeklyData: true,
      dailyData: false,
      dayPartData: false,
      rawCarData: false,
      allTab: false,
      currentPage: null,
      groupStoreColumns: false,
      dayColumn: false,
      dayPartColumn: false,
      weekColumn: false,
      goalData: {
         data:
        [
          {
              title: "<Goal A",
              menu: "1",
              greet: "2",
              service: "3",
              laneQueue: "4",
              laneTotal: "5"
            },{
              title: "Cars",
              menu: "1",
              greet: "2",
              service: "3",
              laneQueue: "4",
              laneTotal: "5"
            },{
              title: "%",
              menu: "1",
              greet: "2",
              service: "3",
              laneQueue: "4",
              laneTotal: "5"
            },
            {
                title: "<Goal B",
                menu: "1",
                greet: "2",
                service: "3",
                laneQueue: "4",
                laneTotal: "5"
              },{
                title: "Cars",
                menu: "1",
                greet: "2",
                service: "3",
                laneQueue: "4",
                laneTotal: "5"
              },{
                title: "%",
                menu: "1",
                greet: "2",
                service: "3",
                laneQueue: "4",
                laneTotal: "5"
              },
              {
                  title: "<Goal C",
                  menu: "1",
                  greet: "2",
                  service: "3",
                  laneQueue: "4",
                  laneTotal: "5"
                },{
                  title: "Cars",
                  menu: "1",
                  greet: "2",
                  service: "3",
                  laneQueue: "4",
                  laneTotal: "5"
                },{
                  title: "%",
                  menu: "1",
                  greet: "2",
                  service: "3",
                  laneQueue: "4",
                  laneTotal: "5"
                }
        ]
        /* data: [
          {
            "title": "Goal A",
            "color": "#545454",
            "data": {
              "Header": {
                "Menu": "1",
                "Greet": "2",
                "Service": "3",
                "LaneQueue": "4",
                "LaneTotal": "5"
              },
              "Cars": {
                "Menu": "1",
                "Greet": "2",
                "Service": "3",
                "LaneQueue": "4",
                "LaneTotal": "5"
              },
              "%": {
                "Menu": "1",
                "Greet": "2",
                "Service": "3",
                "LaneQueue": "4",
                "LaneTotal": "5"
              }
            }
          },
          {
            "title": "Goal B",
            "color": "#545454",
            "data": {
              "Header": {
                "Menu": "1",
                "Greet": "2",
                "Service": "3",
                "LaneQueue": "4",
                "LaneTotal": "5"
              },
              "Cars": {
                "Menu": "1",
                "Greet": "2",
                "Service": "3",
                "LaneQueue": "4",
                "LaneTotal": "5"
              },
              "%": {
                "Menu": "1",
                "Greet": "2",
                "Service": "3",
                "LaneQueue": "4",
                "LaneTotal": "5"
              }
            }
          }
        ] */
      },
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
    // this.getCurrentTimeMeasure()
    // this.populateSummaryReportDetails()
    this.handleDrillDown = this.handleDrillDown.bind(this)
  }

  componentWillMount () {
    this.setTimeMeasures(this.props.history.location.state)
  }

  setTimeMeasures (templateData) {
    /******
    checking for time measure selected after filling template and generating report.
    Mapping day, daypart week and raw car data as 1, 2,3 and 4 respectively
    */
    switch (templateData[0].timeMeasure) {
      case '1' : this.state.dailyData = true
        if (templateData[0].selectedList.length === 1) {
          this.state.reportData.dayColumn = true
          this.state.reportData.groupStoreColumns = false
        } else {
          this.state.reportData.dayColumn = false
          this.state.reportData.groupStoreColumns = true
        }
        this.setState(this.state)
        break

      case '2' : this.state.dayPartData = true
        if (templateData[0].selectedList.length === 1) {
          this.state.reportData.dayPartColumn = true
          this.state.reportData.groupStoreColumns = false
        } else {
          this.state.reportData.dayPartColumn = false
          this.state.reportData.groupStoreColumns = true
        }
        this.setState(this.state)
        break

      case '3' : this.state.weeklyData = true
        if (templateData[0].selectedList.length === 1) {
          this.state.reportData.weekColumn = true
          this.state.reportData.groupStoreColumns = false
        } else {
          this.state.reportData.weekColumn = false
          this.state.reportData.groupStoreColumns = true
        }
        this.setState(this.state)
        break

      case '4' : this.state.rawCarData = true
        if (templateData[0].selectedList.length === 1) {
          this.state.reportData.dayPartColumn = true
          this.state.reportData.groupStoreColumns = false
        } else {
          this.state.reportData.dayPartColumn = false
          this.state.reportData.groupStoreColumns = true
        }
        this.setState(this.state)
        break
    }
    this.constructReportRequest(templateData)
  }
  constructReportRequest(templateData){

    this.populateSummaryReportDetails()
  }

  getSummaryReportData(){

  }

  handleDrillDown () {
    // api call for getting the next drilldown
    if (this.props.weeklyData) {
      console.log('weekly data')
    } else if (this.props.dailyData) {
      console.log('daily data')
    } else if (this.props.dayPartData) {
      console.log('day data')
    } else if (this.props.rawCarData) {
      console.log('raw car data')
    }
  }

  populateSummaryReportDetails () {
    /* let url = config.url + 'api/report/generatereport'
    let data = {
      'stores': [
        3,
        5
      ],
      fromDate: '2017-03-03T00:00:00.000Z',
      toDate: '2018-03-26T00:00:00.000Z',
      openTime: '12:08 AM',
      closeTime: null,
      type: 1,
      advanceType: true,
      include: 1,
      format: 1,
      templateName: 'samples'
    }
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((data) => {
        this.state.reportData.data = JSON.stringify(data.data)
        this.setState(this.state)
      })
      .catch((error) => {

      }) */
  }
  displayGoalStatistics(){
    if(this.state.showGoalStats){
      return (<div className='row goalstatistics-table-section'>
        <GoalStatisticsDataComponent goalData = {this.state.goalData} />
      </div>)
    }else{
      return <div/>
    }
  }

  displaySystemStatistics(){
    if(this.state.showSystemStats){
      return (<div className='row systemstatistics-table-section'>
        <SystemStatistics displayData = {this.state.displayData} />
      </div>)
    }else{
      return <div/>
    }
  }

  render () {
    // let reportData = this.state.reportData.data
    return (<section className='report-summary-page'>
      <HmeHeader />
      <section className='reportsummary-container'>
        <div className='row download-btn-section'>
          <button className='btn btn-default download-summaryreport-btn'>Download</button>
        </div>
        <PageHeader pageHeading={this.state.pageHeading} />
        <div className='row'>

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
          <div className={'col-xs-2 left-padding-none ' + (this.state.allTab ? 'hide' : 'show')}>
            <div id='page-navigations'>
              <div className='page-navs'>
                Page <span className='pgStarts'>1</span> <span translate='' className='ReportsOf'>of </span> 1</div>
              <div className='previous-link' ><i className='fa fa-angle-left previous-page' /></div>
              <div className='next-link'><i className='fa fa-angle-right next-page' /></div>
            </div>
          </div>

        </div>

        <div className='row'>
          <div className='col-xs-12 show-all-pagination-toggle'>Show: <span className={(this.state.allTab) ? 'active-link' : 'inactive-link'} onClick={() => this.setState({allTab: true})}>All /</span><span className={(this.state.allTab) ? 'inactive-link' : 'active-link'} onClick={() => this.setState({allTab: false})}>Pages</span></div>
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
