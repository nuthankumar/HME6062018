import React, { Component } from 'react'
import moment from 'moment'
import './SummaryReport.css'
import fetch from 'isomorphic-fetch'
import {Config} from '../../Config'
import PageHeader from '../Header/PageHeader'
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
import Loader from '../Alerts/Loader'
import Api from '../../Api'

class RawCarReport extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentLanguage: languageSettings.getCurrentLanguage(),
      showLoader: false,
      rawData: false,
      pageHeading: 'Raw Car Data Report',
      displayData: '',
      eventList: [
      ],
    }
    this.api = new Api()
    this.displayRawCarHeader = this.displayRawCarHeader.bind(this)
    this.displayRawCarContent = this.displayRawCarContent.bind(this)
    this.displayRecords = this.displayRecords.bind(this)
    this.displayItems = this.displayItems.bind(this)
    this.getRawCarData = this.getRawCarData.bind(this)
  }
  componentWillMount () {
    this.getRawCarData()
  }

  getRawCarData () {
    let data = this.props.history.location.state
    this.state.displayData = data.rawCarData
    this.state.eventList = data.eventList
    this.state.rawCarRequest = data.rawCarRequest
    this.state.rawData = true
    this.setState(this.state)
  }

  timeChange (name) {
    return moment(name).format('ll')
  }

  displayRecords () {
    const language = this.state.currentLanguage
    return (<section className='rawcar-data-page'>
      <section className='rawcar-data-section'>
        <div className='btn btn-danger emailCSV' onClick={this.emailAsCSV.bind(this)}> {t[language].ReportsEmailCSVVersion}</div>
        <div className='clear rawcar-table-details'>
          <PageHeader pageHeading={t[language].ReportsRawDataReport} />
          {this.displayRawCarHeader()}
        </div>
        {this.displayRawCarContent()}
      </section>
    </section>)
  }

  displayRawCarHeader () {
    const language = this.state.currentLanguage
    return (
      <table className='rawcar-header-labels clear'>
        <tbody>
          <tr>
            <th className='thin-header'>
              <span>{t[language].store}</span>:
            </th>
            <td className='thin-header'>{this.state.displayData.storeName ? this.state.displayData.storeName :this.state.displayData.storeNumber }</td>
            <th>
              <span>{t[language].ReportsStart}</span>
            </th>
            <td>
              {this.state.displayData.startTime ? (this.state.displayData.startTime +' '+ t[language].OPEN) : 'N/A'}&nbsp;
            </td>
            <th>
              <span>{t[language].ReportsPrintDate}</span>
            </th>
            <td> {this.state.displayData.printDate ? this.state.displayData.printDate : 'N/A'} </td>
          </tr>
          <tr>
            <th>
              <span>{t[language].Description}</span>
            </th>
            <td>{this.state.displayData.storeDescription ? this.state.displayData.storeDescription : 'N/A'}</td>
            <th>
              <span>{t[language].ReportsStop}</span>
            </th>
            <td>
              {this.state.displayData.stopTime ? (this.state.displayData.stopTime +' '+ t[language].CLOSE) : 'N/A' }&nbsp;
            </td>
            <th>
              <span>{t[language].ReportsPrintTime} </span>
            </th>
            <td>{this.state.displayData.printTime ? this.state.displayData.printTime : 'N/A' }</td>
          </tr>
        </tbody>
      </table>
    )
  }

  displayRawCarContent () {
    const language = this.state.currentLanguage
    if (this.state.displayData.key === 'ReportsNoRecordsFound' && this.state.displayData.key !== undefined) {
      return (<h3 className='rawcar-no-data'><span >{t[language][this.state.displayData.key]}</span></h3>)
    } else {
      return (<div className='rawcar-content'>
        <div className='rawcar-header'>
          <h2 className='rawcar-h2'>{this.state.displayData.dayPart}</h2>
        </div>
        <table className='display-records table-layout table-layoutRawCar'>
          <tbody>
            <tr className ='raw-car-subheaders'>
              <th>{t[language].ReportsDepartureTime}</th>
              <th>{t[language].ReportsEventName}</th>
              <th>{t[language].ReportsCarsinQueue}</th>
              {/* <th>
                <span>{t[language].MenuBoard}</span>
              </th>
              <th>
                <span>{t[language].Greet}</span>
              </th>
              <th>
                <span>{t[language].Service}</span>
              </th>
              <th>
                <span>{t[language].LaneQueue}</span>
              </th>
              <th>
                <span>{t[language].LaneTotal}</span>
              </th> */}
              {this.getRawCardColumnHeaders()}
            </tr>
            {this.displayItems()}
          </tbody>
        </table>
      </div>)
    }
  }

  getRawCardColumnHeaders(){
   return  this.state.eventList.map((headerItem) => {
      if(headerItem !== 'DepartureTime' && headerItem !== 'EventName' && headerItem !== 'CarsInQueue'){
        return(<th>
        <span>{headerItem}</span>
      </th>)
      }
    })
    
  }

  displayItems () {
    return this.state.displayData.rawCarData.map((items) => {
      return (
        // <tr className='display-result'>
        //   <td>{items.departureTime ? items.departureTime : 'N/A'}</td>
        //   <td>{items.eventName ? items.eventName : 'N/A'}</td>
        //   <td>{items.carsInQueue ? items.carsInQueue : 'N/A'}</td>
        //   <td> {items.menu ? items.menu : 'N/A'}</td>
        //   <td> {items.greet ? items.greet : 'N/A'}</td>
        //   <td> {items.service ? items.service : 'N/A'}</td>
        //   <td> {items.laneQueue ? items.laneQueue : 'N/A'}</td>
        //   <td> {items.laneTotal ? items.laneTotal : 'N/A'}</td>
        // </tr>
          <tr className='display-result'>
          {this.displayRawCarCell(items)}
        </tr>
      )
    })
  }

  displayRawCarCell(items){
    let eventHeaders = this.state.eventList
    return eventHeaders.map((headerItem) => {
      return (
        <td>{items[headerItem] ? items[headerItem] : 'N/A'}</td>)
    })
  }

  render () {
    const { showLoader } = this.state
    return (
      <div className='rawCarContainer'>
        <Loader showLoader={showLoader} />
        <div className={showLoader ? 'hidden' : 'show'}>
          {this.displayRecords()}
        </div>
      </div>
    )
  }
  emailAsCSV () {
    this.setState({
      showLoader: true
    })
    let url = Config.apiBaseUrl + 'api/report/getRawCarDataReport?reportType=rrcsv1'
    this.api.postData(url, this.state.rawCarRequest, data => {
      if (data.status) {
        this.setState({
          email: data.data
        })
        this.state.emailId = data.data
        this.setState({
          showLoader: false
        })
        this.props.history.push('/emailSent', this.state.emailId)
      }
    }, error => {
      this.state.successMessage = ''
      this.state.errorMessage = 'Failed sending Email'
      this.setState(this.state)
    })
  }
}

export default RawCarReport
