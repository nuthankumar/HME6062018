import React, { Component } from 'react'
import moment from 'moment'
import Header from '../Header/HmeHeader'
import './SummaryReport.css'
import fetch from 'isomorphic-fetch'
class RawCarReport extends Component {
  constructor (props) {
    super(props)
    this.state = {
      rawData: false,
      displayData: {
        store: 'McDonalds 202000',
        description: 'Description of the Store',
        startTime: '2018-03-15',
        stopTime: '2018-03-15',
        printDate: '2018-04-02',
        printTime: '2:59 AM',
        dayPart: 'DP OPEN-11:59',
        rawCartData: [
          {
            departureTime: '2018-03-15 09:28:41 AM',
            eventName: 'Car_Departure',
            carsInQueue: 3,
            menu: '0:21',
            greet: '0:21',
            service: '0:40',
            laneQueue: '0:39',
            laneTotal: '1:40'
          },
          {
            departureTime: '2018-03-15 09:28:42 AM',
            eventName: 'Car_Departure',
            carsInQueue: 3,
            menu: '0:13',
            greet: '0:13',
            service: '0:49',
            laneQueue: '0:44',
            laneTotal: '1:46'
          }
        ]
      }
    }
    this.displayRecords = this.displayRecords.bind(this)
    this.displayItems = this.displayItems.bind(this)
    this.getRawCarData = this.getRawCarData.bind(this)
  }
  componentDidMount () {
    this.getRawCarData()
  }

  getRawCarData () {
    let data = {
      'reportTemplateStoreId': '3', // String Only
      'reportTemplateAdvancedOp': 0,
      'reportTemplateTimeMeasure': 'Raw Data Report',
      'reportTemplateFromDate': '2018-03-29',
      'reportTemplateToDate': '2018-03-29',
      'reportTemplateOpen': 1,
      'reportTemplateClose': 1,
      'reportTemplateType': 1,
      'reportTemplateIncludeLongs': 'on',
      'ReportTemplate_Include_Stats': '',
      'reportTemplateFormat': 1
    }
    let url = 'http://localhost:7071/api/report/getRawCarDataReport'
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
        console.log('called first')
        this.state.displayData = data.data
        this.state.rawData = true
        this.setState(this.state)
      })
      .catch((error) => {
        this.state.successMessage = ''
        this.state.errorMessage = error.message
        this.setState(this.state)
      })
  }

  timeChange (name) {
    return moment(name).format('ll')
  }

  displayRecords () {
    console.log('called second')
    if (this.state.rawData) {
      if (this.state.displayData) {
        return (
          <div>
            <div className='rawcarHeader'>
              <h2 className='rawCarh2'>{this.state.displayData.dayPart}</h2>
            </div>
            <table className='displayRecords tableLayout'>
              <tbody>
                <tr>
                  <th>Departure Time</th>
                  <th>Event Name</th>
                  <th>Cars In Queue</th>
                  <th>
                    <span>Menu</span>
                  </th>
                  <th>
                    <span>Greet</span>
                  </th>
                  <th>
                    <span>Service</span>
                  </th>
                  <th>
                    <span>Lane Queue</span>
                  </th>
                  <th>
                    <span>Lane Total</span>
                  </th>
                </tr>
                {this.displayItems()}
              </tbody>
            </table>
          </div>
        )
      } else {
        return <p>No Records Found</p>
      }
    } else {
      return <p>Loading....</p>
    }
  }
  displayItems () {
    return this.state.displayData.rawCarData.map((items) => {
      return (
        <tr className='displayResult'>
          <td>{items.departureTime ? items.departureTime : 'N/A'}</td>
          <td>{items.eventName ? items.eventName : 'N/A'}</td>
          <td>{items.carsInQueue ? items.carsInQueue : 'N/A'}</td>
          <td> {items.menu ? items.menu : 'N/A'}</td>
          <td> {items.greet ? items.greet : 'N/A'}</td>
          <td> {items.service ? items.service : 'N/A'}</td>
          <td> {items.laneQueue ? items.laneQueue : 'N/A'}</td>
          <td> {items.laneTotal ? items.laneTotal : 'N/A'}</td>
        </tr>
      )
    })
  }
  render () {
    return (
      <div>
        <Header />
        <div className='clear tableDetails'>
          <div className='rawcarHeader'>
            <h1 className='rawCarH1'>
              <span>Raw Car Data Report</span>
            </h1>
          </div>
          <table className='head-labelsRaw clear'>
            <tbody>
              <tr>
                <th className='thinHead'>
                  <span>Store</span>:
                </th>
                <td className='thinHead'>{this.state.displayData.store}</td>
                <th>
                  <span>Start Time:</span>
                </th>

                <td>
                  {this.timeChange(this.state.displayData.startTime)}&nbsp;
                </td>
                <th>
                  <span>Print Date:</span>
                </th>
                <td>{this.timeChange(this.state.displayData.printDate)}</td>
              </tr>
              <tr>
                <th>
                  <span>Description:</span>
                </th>
                <td>{this.state.displayData.description}</td>
                <th>
                  <span>Stop Time:</span>
                </th>
                <td>
                  {this.timeChange(this.state.displayData.stopTime)}&nbsp;
                </td>
                <th>
                  <span>Print Time: </span>
                </th>
                <td>{this.state.displayData.printTime}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {this.displayRecords()}
      </div>
    )
  }
}

export default RawCarReport
