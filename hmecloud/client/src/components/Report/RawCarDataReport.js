import React, { Component } from 'react'
import moment from 'moment'
import Header from '../Header/HmeHeader'
import './SummaryReport.css'
import fetch from 'isomorphic-fetch'
import {Config} from '../../Config'
import PageHeader from '../Header/PageHeader'
import Api from '../../Api'

class RawCarReport extends Component {
  constructor (props) {
    super(props)
    this.state = {
      rawData: false,
      pageHeading: 'Raw Car Data Report',
      displayData: {
        store: 'McDonalds 202000',
        description: 'Description of the Store',
        startTime: '2018-03-15',
        stopTime: '2018-03-15',
        printDate: '2018-04-02',
        printTime: '2:59 AM',
        dayPart: 'DP OPEN-11:59'
      }
    }
    this.api = new Api()
    this.displayRecords = this.displayRecords.bind(this)
    this.displayItems = this.displayItems.bind(this)
    this.getRawCarData = this.getRawCarData.bind(this)

  }
  componentDidMount () {
    this.getRawCarData()
  }

  getRawCarData () {
      let data = {
          "timeMeasure": 4,
          "fromDate": "2018-03-24",
          "toDate": "2018-03-24",
          "openTime": "12:00 AM",
          "closeTime": "12:00 PM",
          "open": true,
          "close": true,
          "type": 2,
          "include": [
              "1",
              "2"
          ],
          "format": 2,
          "selectedStoreIds": ["4"],
          "advancedOptions": false,
          "longestTime": true,
          "systemStatistics": true
      }
      let url = Config.apiBaseUrl + 'api/report/getRawCarDataReport?reportType=rr1'
      this.api.postData(url, data, data => {
          console.log(data);
          this.state.displayData = data
          this.state.rawData = true
          this.setState(this.state)
      }, error => {
          this.state.successMessage = ''
          this.state.errorMessage = error.message
          this.setState(this.state)
          })
  }

  timeChange (name) {
    return moment(name).format('ll')
  }

  displayRecords () {
    if (this.state.rawData) {
      if (this.state.displayData) {
        return (<section className='rawcar-data-page'>
          <section className='rawcar-data-section'>

                <div className='btn btn-danger emailCSV' onClick={this.emailAsCSV.bind(this)}> Email CSV version</div>
             <div className='clear rawcar-table-details'>
              <PageHeader pageHeading={this.state.pageHeading} />
              <table className='rawcar-header-labels clear'>
                <tbody>
                  <tr>
                    <th className='thin-header'>
                      <span>Store</span>:
                    </th>
                    <td className='thin-header'>{this.state.displayData.store ? this.state.displayData.store : 'N/A' }</td>
                    <th>
                      <span>Start Time:</span>
                    </th>
                    <td>
                      {this.state.displayData.startTime ? this.state.displayData.startTime : 'N/A'}&nbsp;
                    </td>
                    <th>
                      <span>Print Date:</span>
                    </th>
                    <td> {this.state.displayData.printDate ? this.state.displayData.printDate : 'N/A'} </td>
                  </tr>
                  <tr>
                    <th>
                      <span>Description:</span>
                    </th>
                    <td>{this.state.displayData.description ? this.state.displayData.description : 'N/A'}</td>
                    <th>
                      <span>Stop Time:</span>
                    </th>
                    <td>
                      {this.state.displayData.stopTime ? this.state.displayData.stopTime : 'N/A' }&nbsp;
                    </td>
                    <th>
                      <span>Print Time: </span>
                    </th>
                    <td>{this.state.displayData.printTime ? this.state.displayData.printTime : 'N/A' }</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <div className='rawcar-header'>
                <h2 className='rawcar-h2'>{this.state.displayData.dayPart}</h2>
              </div>
              <table className='display-records table-layout table-layoutRawCar'>
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
          </section>
        </section>)
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
        <tr className='display-result'>
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
        {this.displayRecords()}
      </div>
    )
  }
  emailAsCSV() {
      let data = {
          "timeMeasure": 4,
          "fromDate": "2018-03-24",
          "toDate": "2018-03-24",
          "openTime": "12:00 AM",
          "closeTime": "12:00 PM",
          "open": true,
          "close": true,
          "type": 2,
          "include": [
              "1",
              "2"
          ],
          "format": 2,
          "selectedStoreIds": ["4"],
          "advancedOptions": false,
          "longestTime": true,
          "systemStatistics": true
      }
      let url = Config.apiBaseUrl + 'api/report/getRawCarDataReport?reportType=rrcsv1'
      this.api.postData(url, data, data => {
          if (data.status) {
              console.log(data);
              this.setState({
                  email: data.data
              });
              this.state.emailId = data.data;
              this.props.history.push("/emailSent", this.state.emailId); 
           }
           }, error => {
          this.state.successMessage = ''
          this.state.errorMessage = 'Failed sending Email'
          this.setState(this.state)
      })
  }
}

export default RawCarReport
