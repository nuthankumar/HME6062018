import React, { Component } from 'react'
import moment from 'moment'
import './SummaryReport.css'
import {Config} from '../../Config'
import PageHeader from '../Header/PageHeader'
import {CommonConstants} from '../../Constants'
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
      ]
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
    this.state.eventList = data.rawCarData.eventList
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
            <td className='thin-header'>{this.state.displayData.storeName ? this.state.displayData.storeName : this.state.displayData.storeNumber }</td>
            <th>
              <span>{t[language].ReportsStart}</span>
            </th>
            <td>
              {this.state.displayData.startTime ? ((language === 0 ? moment(this.state.displayData.startTime).locale('en').format('MMM D, YYYY') : moment(this.state.displayData.startTime).locale('fr-ca').format('MMM D, YYYY')) + ' ' + t[language].OPEN) : 'N/A'}&nbsp;
            </td>
            <th>
              <span>{t[language].ReportsPrintDate}</span>
            </th>
            <td> {this.state.displayData.printDate ? (language === 0 ? moment(this.state.displayData.printDate).locale('en').format('MMM D, YYYY') : moment(this.state.displayData.printDate).locale('fr-ca').format('MMM D, YYYY')) : 'N/A'} </td>
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
              {this.state.displayData.stopTime ? ((language === 0 ? moment(this.state.displayData.stopTime).locale('en').format('MMM D, YYYY') : moment(this.state.displayData.stopTime).locale('fr-ca').format('MMM D, YYYY'))  + ' ' + t[language].CLOSE) : 'N/A' }&nbsp;
            </td>
            <th>
              <span>{t[language].ReportsPrintTime} </span>
            </th>
            <td>{this.state.displayData.printTime ? new moment().format('hh:mm A') : 'N/A' }</td>
          </tr>
        </tbody>
      </table>
    )
  }

  displayRawCarContent () {
    const language = this.state.currentLanguage
    if ((this.state.displayData.key === 'ReportsNoRecordsFound' && this.state.displayData.key !== undefined) || this.state.eventList === undefined) {
      return (<h3 className='rawcar-no-data'><span >{t[language][this.state.displayData.key]}</span></h3>)
    } else {
      return (<div className='rawcar-content'>
        <div className='rawcar-header'>
          <h2 className='rawcar-h2'>{this.state.displayData.dayPart}</h2>
        </div>
        <table className='display-records table-layout table-layoutRawCar'>
          <tbody>
            <tr className='raw-car-subheaders'>
              <th>{t[language].ReportsDepartureTime}</th>
              <th>{t[language].ReportsEventName}</th>
              <th>{t[language].ReportsCarsinQueue}</th>
              {this.getRawCardColumnHeaders()}
            </tr>
            {this.displayItems()}
          </tbody>
        </table>
      </div>)
    }
  }

  getRawCardColumnHeaders () {
    const language = this.state.currentLanguage
    return this.state.eventList.map((headerItem) => {
      if (headerItem !== 'departureTime' && headerItem !== 'eventName' && headerItem !== 'carsInQueue') {
        return (<th>
          <span>{t[language][headerItem] ? t[language][headerItem] : headerItem}</span>
        </th>)
      }
    })
  }

  displayItems () {
    return this.state.displayData.rawCarData.map((items) => {
      return (
        <tr className='display-result'>
          {this.displayRawCarCell(items)}
        </tr>
      )
    })
  }

  displayRawCarCell (items) {
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
    // adding report type csv for rcd
    let url = Config.apiBaseUrl + CommonConstants.apiUrls.generateNewReport + '?reportType=csv'
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
      this.state.errorMessage = error.message
      this.setState(this.state)
    })
  }
}

export default RawCarReport
