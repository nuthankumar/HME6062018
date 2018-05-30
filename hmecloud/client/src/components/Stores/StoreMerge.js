import React, { Component } from 'react'
// import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
import './Stores.css'
// import * as storesFunctions from '../../actions/stores'
import { Modal, Button } from 'react-bootstrap'
import Api from '../../Api'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { confirmAlert } from 'react-confirm-alert'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { mergeClosePopup } from '../../actions/modalAction'
class StoreMerge extends Component {
  constructor(props) {
    super(props)
    this.api = new Api()
    this.state = {
      currentLanguage: languageSettings.getCurrentLanguage(),
      data: {},
      DeviceData: {},
      show: false,
      deviceSelected: [],
      storeSelected: null,
      error: ''
    }
    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  // componentDidMount() {

  // }
  rowClicked(value) {

  }
  handleClose() {
    this.props.dispatch(mergeClosePopup())
  }
  handleShow() {
    this.setState({ show: true })
  }
  selectSystemChecked(value) {
    if (value != null) {
      this.setState({ deviceSelected: [...this.state.deviceSelected, this.state.data.Device_Details[value]] })
    } else {
      this.setState({ deviceSelected: null })
    }
  }
  targetStoreChecked(value) {
    if (value != null) {
      this.setState({ storeSelected: this.state.DeviceData.storeList[value] })
    } else {
      this.setState({ storeSelected: null })
    }
  }
  SearchApi(serialNumber) {
    this.api.MergeStoreData(serialNumber).then(data => {
      this.setState({ DeviceData: data })
    })
  }
  ConfirmMerge() {
    // api to hit merge

  }
  MergeClick() {
    if (this.state.deviceSelected != null && this.state.storeSelected != null) {
      confirmAlert({
        customUI: ({ onClose }) => {
          const DeviceItems = this.state.deviceSelected.map((device) => {
            return <a>{device.Device_Name}<span /></a>
          }
          )
          return (
            <div className='custom-ui'>
              <h1>Confirmation Required </h1>
              <h2>This action will remove the following system(s) from the CLOUD</h2>
              <ul>
                <li>Store Number :{this.state.storeSelected.Store_Number}</li>
                <li>Serial Number :{this.state.storeSelected.Store_ID}</li>
                <li>System :<p> {DeviceItems}</p></li>
              </ul>
              <p>Are you sure you would like to proceed ?</p>

              <button onClick={() => {
                this.ConfirmMerge()
                onClose()
              }}>Confirm</button>
              <button onClick={onClose}>Cancel</button>
            </div>
          )
        }
      })
    } else {
      if (this.state.deviceSelected == null && this.state.storeSelected == null) {
        this.setState({ error: 'Must select at least one system \n Must select a target store.' })
      } else {
        (this.state.deviceSelected == null) ? this.setState({ error: 'Must select at least one system.' })
          : this.setState({ error: 'Must select a target store.' })
      }
    }
  }
  /* <Button bsStyle="primary" bsSize="large" onClick={this.props.handleShow}> */
  /* <Button onClick={this.props.onHide}>Close</Button> */
  render() {
    //   const language = this.state.currentLanguage
    // let displayData = this.props.systemStats
    let Show = (this.props.mergeModelPopup !== undefined) ? this.props.mergeModelPopup : false

    return (
      <Modal show={Show} dialogClassName='store-merge-popup' >
        <Modal.Body className='store-merge-popup-content'>
          <div className='merge-store-wrapper'>
            <div class='merge-store-header'>
              <h2 className=''>Merge</h2>
            </div>
            <div className='store-merge-body'>
              <div className='merge-store-row'>

                <SelectSystem data={this.props.storesDetails.storePopupDetails} selectSystemChecked={this.selectSystemChecked.bind(this)} />
                <TargetStore search={this.SearchApi.bind(this)} targetStoreChecked={this.targetStoreChecked.bind(this)} data={this.state.DeviceData} />
              </div>
            </div>
          </div>
          <div class='store-merge-footer'>
            <div class='merge-store-row'>
              <div class='merger-error-block'>
                <ul class='merge-error-list' />
              </div>
              <div class='save-merge-block text-right'>
                <a class='btn-cancel merge-cancel' href=''>Cancel</a>&nbsp;&nbsp;|&nbsp;&nbsp;
                <button type='button' class='btn-submit merge-submit-btn'>Merge</button>
              </div>
            </div>
          </div>
          <div class='merger-popup-close' onClick={this.handleClose}>X</div>
        </Modal.Body>
      </Modal>
    )
  }
}
class SelectSystem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      storeNumber: '1',
      storeBrand: 'Mary'
    }
    this.rowClicked = this.rowClicked.bind(this)
  }

  rowClicked(event) {
    let value = (event.target.checked) ? event.target.value : null
    this.props.selectSystemChecked(value)
  }
  render() {
    //  const language = this.state.currentLanguage
    let displayData = this.props.data.storeDetails
    let device = this.props.data.deviceDetails
    let headers = [' ', 'System', 'Serial Number']
    return (
      <div className='select-system-col'>
        <h3>Select System(s)</h3>
        <div className='form-group'>
          <div className='store-brand-info'>
            <div>Store Number:&nbsp;&nbsp;<span className='merge-storenobrand-label'>{displayData.Store_Name}</span></div>
            <div>Store Brand:&nbsp;&nbsp;<span className='merge-storenobrand-label'>{displayData.Brand_Name}</span></div>
          </div>
        </div>
        <div className='select-system-content'>
          <Table data={device} header={headers} rowClicked={this.rowClicked} />
        </div>
      </div>
    )
  }
}

class Table extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    let row = this.props.data
    let rows
    if (row) {
      rows = row.map((data, index) => {
        return (
          <tr>
            <td>
              <input type='checkbox' name='sys-merge-check' class='sys-merge-check' value={index} onClick={this.props.rowClicked} />
            </td>
            <td>
              {data.Device_Name}
            </td>
            <td>
              {data.Device_SerialNumber}
            </td>
          </tr>
        )
      })
    }
    let Header = this.props.header.map((data, index) => {
      return (
        <th className='merge_device_name'>
          {data}
        </th>

      )
    })
    return (
      <table >
        <thead>
          <tr>
            {Header}
          </tr>
        </thead>
        <tbody >
          {rows}
        </tbody>
      </table>)
  }
}

class TargetStore extends Component {
  constructor(props) {
    super(props)
    this.state = {
      serialNumber: 0
    }
    this.api = new Api()
    this.handleOnClick = this.handleOnClick.bind(this)
    this.rowClicked = this.rowClicked.bind(this)
  }
  handleOnClick() {
    this.props.search(this.state.serialNumber)
  }
  rowClicked(event) {
    let value = (event.target.checked) ? event.target.value : null
    this.props.targetStoreChecked(value)
  }

  render() {
    //  const language = this.state.currentLanguage
    // let displayData = this.props.systemStats
    let data = (this.props.data.storeList !== undefined) ? this.props.data.storeList : null
    let headers = [' ', 'Store', 'Company', 'Brand']
    return (
      <div className='target-store-col'>
        <h3>Select Target Store</h3>
        <form className='form-inline target-store-search'>
          <div className='form-group target-store-group'>
            <input type='text' className='form-control store-number-input' placeholder='Enter Store Number' />
          </div>
          <button type='button' className='btn btn-default merge-search-btn' onClick={this.handleOnClick.bind(this)}>Search</button>
        </form>
        <div className='target-results-content'>
          <TargetTable data={data} header={headers} rowClicked={this.rowClicked} />
        </div>
      </div>
    )
  }
}

class TargetTable extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    let row = this.props.data
    let rows
    if (row !== null) {
      rows = row.map((data, index) => {
        return (
          <tr>
            <td>
              <input type='radio' name='sys' class='sys-merge-check' value={index} onClick={this.props.rowClicked} />
            </td>
            <td>
              {data.Store_Number}
            </td>
            <td>
              {data.Brand_Name}
            </td>
            <td>
              {data.Store_Company}
            </td>
          </tr>
        )
      })
    }
    let Header = this.props.header.map((data, index) => {
      console.log(data, index)
      return (
        <th className='merge_device_name'>
          {data}
        </th>
      )
    })
    if (row !== undefined) {
      return (
        <table >
          <thead>
            <tr>
              {Header}
            </tr>
          </thead>
          <tbody >
            {rows}
          </tbody>
        </table>)
    } else {
      return (
        <table >
          <thead>
            <tr>
              {Header}
            </tr>
          </thead>
          <tbody />
        </table>)
    }
  }
}

function mapStateToProps(state) {
  return {
    storesDetails: state.StorePopupDetails,
    mergeModelPopup: state.StorePopupDetails.mergePopUp
  }
}
export default connect(mapStateToProps)(StoreMerge)
