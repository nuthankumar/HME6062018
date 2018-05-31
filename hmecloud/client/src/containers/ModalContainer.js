import React, { Component } from 'react'
import t from '../components/Language/language'
import * as languageSettings from '../components/Language/languageSettings'
// import StoreDetail from '../components/Stores/StoreDetail'
import StoredetailsComponent from '../components/Stores/StoreDetailsComponent'
import ZoomComponent from '../components/Stores/ZoomComponent'
import CIBComponent from '../components/Stores/CIBComponent'
import EOSComponent from '../components/Stores/EOSComponent'
import IONComponent from '../components/Stores/IONComponent'
import * as ReactBootstrap from 'react-bootstrap'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { closePopup, initModal } from '../actions/modalAction'
// import  actionCreator  from '../actions/modalAction';

class ModalContainer extends Component {
  constructor(props) {
    super(props)
    // this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    let initTab = 'Store Details'
    this.state = {
      show: false,
      key: 1,
      activetab: initTab,
      tabData: []
    }
    // this.handleClick = this.handleClick.bind(this)
    this.renderTabComponent = this.renderTabComponent.bind(this)
    this.storeTabs = this.storeTabs.bind(this)
  }

  handleSelect(key) {
    this.setState({ key })
  }

  handleClose() {
    this.setState({ state: null })
    this.props.dispatch(closePopup())
  }

  storeTabs(array) {
    let Tab = ReactBootstrap.Tab
    return array.map((tabItem, index) => {
      return (
        <Tab eventKey={index + 1} title={tabItem.Device_Name} onClick={this.handleClick}>
          {this.renderTabComponent(tabItem.Device_Name, this.props.stores.storePopUpDetailisAdmin, tabItem)}
        </Tab>
      )
    })
  }

  renderTabComponent(tabcomponent, isAdmin, tabItem) {
    switch (tabcomponent) {
      case 'Store Details':
        return <StoredetailsComponent isAdmin={isAdmin} />
        break
      case 'CIB':
        return <CIBComponent isAdmin={isAdmin} email={this.props.stores.storePopupDetails.storeDetails.User_EmailAddress} data={tabItem} />
        break
      case 'EOS':
        return <EOSComponent isAdmin={isAdmin} data={tabItem} />
        break
      case 'ION':
        return <IONComponent isAdmin={isAdmin} data={tabItem} />
        break
      case 'ZOOM':
        return <ZoomComponent isAdmin={isAdmin} data={tabItem} />
        break
    }
  }

  render() {
    // const language = this.state.currentLanguage
    let Modal = ReactBootstrap.Modal
    let Tabs = ReactBootstrap.Tabs
    let show = false
    if (this.props.stores.storePopUpClient !== undefined && this.props.stores.storePopUpClient) {
      show = this.props.stores.storePopUpClient
    } else if (this.props.stores.storePopUpAdmin !== undefined && this.props.stores.storePopUpAdmin) {
      show = this.props.stores.storePopUpAdmin
    }
    let array = []
    array.push({ Device_Name: 'Store Details', isActive: true })
    array = array.concat(this.props.stores.storePopupDetails.Device_Details)

    return (
      <Modal show={show} dialogClassName='modal-popup' onHide={this.handleClose} >
        <Modal.Header closeButton>
          <Modal.Title />
        </Modal.Header>
        <Modal.Body>
          <Tabs
            activeKey={this.state.key}
            onSelect={this.handleSelect}
            id='store-tabs'
          >
            {this.storeTabs(array)}
          </Tabs>
        </Modal.Body>
      </Modal>

    )
  }
}

function mapStateToProps(state) {
  return {
    stores: state.StorePopupDetails
  }
}

//  function mapDispatchToProps(dispatch) {
//      return bindActionCreators({  closePopup: closePopup() }, dispatch);
//  }

export default connect(mapStateToProps)(ModalContainer)
