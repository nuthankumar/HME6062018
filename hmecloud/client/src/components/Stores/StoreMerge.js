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
    this.setState({ show: false })
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
    let show = (this.props.mergeModelPopup !== undefined) ? this.props.mergeModelPopup : false

    return (
      <Modal show={show} dialogClassName='modal-popup' >
        <Modal.Body>
          <div className='merge'>
            <div className='row'>
              <SelectSystem data={this.props.storesDetails.storePopupDetails} selectSystemChecked={this.selectSystemChecked.bind(this)} />
              <TargetStore search={this.SearchApi.bind(this)} targetStoreChecked={this.targetStoreChecked.bind(this)} data={this.state.DeviceData} />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <p>{this.state.error}</p>
          <Button onClick={this.handleClose}>Close</Button>
          <Button onClick={this.MergeClick.bind(this)}>Merge</Button>
        </Modal.Footer>
      </Modal >
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
      <div className='col-1-2'>
        <h3>Select System(s)</h3>
        <div className='form-group'>
          <div className='merge_store_devices'>
            <div>Store Number:&nbsp;&nbsp;<span className='merge_store_num_label'>{displayData.Store_Number}</span></div>
            <div>Store Brand:&nbsp;&nbsp;<span className='merge_store_brand_label'>{displayData.Brand_Name}</span></div>
          </div>
        </div>
        <div className='select-cont'>
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
            <td className='sys-merge-name sys-merge-ctr'>
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
      console.log(data, index)
      return (
        <tr key={index}>
          <th className='merge_device_name'>
            {data}
          </th>
        </tr>
      )
    })
    return (
      <table >
        <thead>
          {Header}
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
      <div className='col-2-2 vert-line'>
        <h3>Select Target Store</h3>
        <form className='form-inline search-box' id='nameform' >
          <div className='form-group'>
            <input type='text' className='form-control' id='merge_store_search' placeholder='Enter Store Number' onChange={(event => { this.setState({ serialNumber: event.target.value }) })} />
          </div>
          <button type='button' form='nameform' className='btn btn-default merge_search_btn' onClick={this.handleOnClick}>Search</button>
        </form>
        <div className='results-cont'>
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
            <td className='sys-merge-name sys-merge-ctr'>
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
        <tr key={index}>
          <th className='merge_device_name'>
            {data}
          </th>
        </tr>
      )
    })
    if (row !== undefined) {
      return (
        <table >
          <thead>
            {Header}
          </thead>
          <tbody >
            {rows}
          </tbody>
        </table>)
    } else {
      return (
        <table >
          <thead>
            {Header}
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
