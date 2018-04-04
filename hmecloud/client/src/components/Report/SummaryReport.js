import React, { Component } from 'react'
import App from '../../App'
import SuccessAlert from '../Alerts/SuccessAlert'
import ErrorAlert from '../Alerts/ErrorAlert'
import fetch from 'isomorphic-fetch'
import HmeHeader from '../Header/HmeHeader'
import SummaryReportDataComponent from './SummaryReportDataComponent'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './SummaryReport.css'
import '../../../node_modules/font-awesome/css/font-awesome.min.css';

const hmeLogo = require('../../images/HMELogo.png')
const zoomLogo = require('../../images/ZoomLogo.PNG')
var body = require('body-parser')
var _ = require('underscore')

export default class SummaryReport extends Component {
  constructor (props) {
    super()
    this.state = {
      reportData: {
        week: {
          all: [ {
                  startTime:'MAR 9',
                  endTime:'MAR 10',
                  data:[{groupId: null, storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5},
                        {groupId: 'G002', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5},
                        {groupId: 'G003', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5},
                        {groupId: 'G004', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
                },
                {
                  startTime:'MAR 9',
                  endTime:'MAR 10',
                  data:[{groupId: 'G001', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5},
                        {groupId: 'G002', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5},
                        {groupId: 'G003', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5},
                        {groupId: 'G004', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
                },
                {
                  startTime:'MAR 9',
                  endTime:'MAR 10',
                  data:[{groupId: 'G001', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5},
                        {groupId: 'G002', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5},
                        {groupId: 'G003', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5},
                        {groupId: 'G004', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
                },
                {
                  startTime:'MAR 9',
                  endTime:'MAR 10',
                  data:[{groupId: 'G001', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5},
                        {groupId: 'G002', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5},
                        {groupId: 'G003', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5},
                        {groupId: 'G004', storeId: 12345, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
                }
              ],
            pages : [
              {
                  startTime:'MAR 9',
                  endTime:'MAR 10',
                  data:[{groupId: 'G005', storeId: null, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
              },
              {
                  startTime:'MAR 9',
                  endTime:'MAR 10',
                  data:[{groupId: 'G006', storeId: null, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
              }
            ]
          },
          day: {
            all: [ {
                    TimeMeasure:'mar 9 - mar 10th',
                    data:[{groupId: 'G001', storeId: null, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
                  },
                  {
                    TimeMeasure:'mar 9 - mar 10th',
                    data:[{groupId: 'G001', storeId: null, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
                  },
                  {
                    TimeMeasure:'mar 9 - mar 10th',
                    data:[{groupId: 'G001', storeId: null, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
                  },
                  {
                    TimeMeasure:'mar 9 - mar 10th',
                    data:[{groupId: 'G001', storeId: null, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
                  }
                ],
              pages : [
                {
                    TimeMeasure:'mar 9 - mar 10th',
                    data:[{groupId: 'G001', storeId: null, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
                },
                {
                    TimeMeasure:'mar 9 - mar 10th',
                    data:[{groupId: 'G001', storeId: null, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
                }
            ]
            },
            dayPart: {
              all: [ {
                      TimeMeasure:'mar 9 - mar 10th',
                      data:[{groupId: 'G001', storeId: null, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
                    },
                    {
                      TimeMeasure:'mar 9 - mar 10th',
                      data:[{groupId: 'G001', storeId: null, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
                    },
                    {
                      TimeMeasure:'mar 9 - mar 10th',
                      data:[{groupId: 'G001', storeId: null, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
                    },
                    {
                      TimeMeasure:'mar 9 - mar 10th',
                      data:[{groupId: 'G001', storeId: null, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
                    }
                  ],
                pages : [
                  {
                      TimeMeasure:'mar 9 - mar 10th',
                      data:[{groupId: 'G001', storeId: null, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
                  },
                  {
                      TimeMeasure:'mar 9 - mar 10th',
                      data:[{groupId: 'G001', storeId: null, menu: 0.30, greet: 1.00, service: 1.30, laneQueue: 2.00, laneTotal: 5.00, totalCars: 5}]
                  }
              ]
            },
        weeklyData: true,
        dailyData: false,
        dayPartData: false,
        rawCarData : false,
        allTab:false,
        currentPage : null
      }
    }
    //this.getCurrentTimeMeasure()
    this.populateSummaryReportDetails()
    this.handleDrillDown = this.handleDrillDown.bind(this)
    this.toggleAllPagination = this.toggleAllPagination.bind(this);
  }

  componentDidMount(){
    console.log(this.props.history.location.state);
  }

  handleDrillDown(){
    //appi call for getting the next drilldown
      console.log("Coming");
    if(this.props.weeklyData){
      console.log("Coming");
    }else if(this.props.dailyData){

    }else if(this.props.dayPartData){

    }else if(this.props.rawCarData){

    }
  }

  populateSummaryReportDetails () {
    let url = 'http://localhost:7071/api/report/generatereport'
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
      })
  }

  toggleAllPagination(pageAll){
    if(pageAll == 'all'){
      this.setState({
        allTab : true
      });
    }else{
      this.setState({
        allTab : false
      });
    }
  }

  render () {
    let reportData = this.state.reportData.data
    return (<section className='reportSummaryPage'>
      <HmeHeader />
      <section className='reportSummaryContainer'>
        <div className='row downloadBtnSection'>
          <button className='btn btn-default downloadSummaryReportBtn'>Download</button>
        </div>
        <div className='row'>
          <div className='col-xs-9 summaryHeader'>
            <div className='summaryHeaderText'>Summarized Report</div>
          </div>
          <div className='col-xs-3'>
            <img src={hmeLogo} />
            <img src={zoomLogo} />
          </div>
        </div>

        <div className='row'>

            <div className='col-xs-3 leftpadding'>
              <h2 className='reportStartTimeHeader'>
                <span className='reportStartTime'>Start Time:</span>
                <span className='reportStartTimeValue'>MAR 31,2018 OPEN</span>
              </h2>
            </div>
            <div className='col-xs-3 leftpadding'>
              <h2 className='reportEndTimeHeader'>
                <span className='reportEndTime'>End Time:</span>
                <span className='reportEndTimeValue'>MAR 31,2018 OPEN</span>
              </h2>
            </div>


            <div className='col-xs-4 leftpadding'>
              <h2 className='reportPrintTimeHeader'>
                <span className='reportPrintTime'> Report Print Time</span>
                <span className='reportPrintTimeValue'> APR2, 2019 4:08 AM</span>
              </h2>
            </div>
            <div className='col-xs-2 leftpadding '>
            <div id='pageNavigations'>
              <div className='pageNavs'>
                Page <span className="pgStarts">1</span> <span translate='' className='ReportsOf'>of </span> 1</div>
                <div className="previousLinks" ><i className='fa fa-angle-left previousPage'></i></div>
                <div className="nextLinks"><i className='fa fa-angle-right nextPage'></i></div>
              </div>
            </div>

        </div>

        <div className='row'>
          <div className='col-xs-12 showAllPaginationToggle'>Show: <span className={(this.state.allTab) ? 'linkActive' : 'linkInactive'} onClick={() => this.setState({allTab : true})}>All /</span><span className = {(this.state.allTab) ? 'linkInactive' : 'linkActive'} onClick={() => this.setState({allTab : false})}>Pages</span></div>
        </div>

        <div className='row summaryReportTableSection'>
            <SummaryReportDataComponent handleDrillDown = {this.handleDrillDown} reportData = {this.state.reportData.week.all}/>
        </div>
      </section>
    </section>)
  }
}
