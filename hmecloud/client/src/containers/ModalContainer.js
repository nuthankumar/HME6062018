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
  constructor (props, context) {
    super(props, context)
    // this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    let initTab = 'Store Details'
    this.state = {
      show: false,
      key: 1,
      activetab: initTab,
      tabData: [
        { name: 'Store Details', isActive: true, comp: 'store' },
        { name: 'CIB', isActive: false, comp: 'cib' },
        { name: 'EOS', isActive: false, comp: 'eos' },
        { name: 'ION', isActive: false, comp: 'ion'},
        { name: 'ZOOM', isActive: false, comp: 'zoom' }
      ]
    }
    // this.handleClick = this.handleClick.bind(this)
    this.renderTabComponent = this.renderTabComponent.bind(this)
    this.storeTabs = this.storeTabs.bind(this)
  }

  // componentWillMount() {
  //   this.props.dispatch(initModal())
  // }

  handleSelect (key) {
    this.setState({ key })
  }

  handleClose () {
    this.setState({ state: null })
    this.props.dispatch(closePopup())
  }

  // handleShow () {
  //   this.setState({ show: true })
  // }

  // handleClick (event) {
  //   // let tab
  //   // this.setState({activetab: tab});
  // }

  storeTabs () {
    let Tab = ReactBootstrap.Tab
    return this.state.tabData.map((tabItem, index) => {
      return (
        <Tab eventKey={index + 1} title={tabItem.name} onClick={this.handleClick}>
          {this.renderTabComponent(tabItem.comp, this.props.stores.storePopUpDetailisAdmin)}
        </Tab>
      )
    })
  }

  renderTabComponent (tabcomponent, isAdmin) {
    switch (tabcomponent) {
      case 'store':
        return <StoredetailsComponent isAdmin={isAdmin} data={this.props.stores} />
        break
      case 'cib':
        return <CIBComponent isAdmin={isAdmin} data={this.props.stores} />
        break
      case 'eos':
        return <EOSComponent isAdmin={isAdmin} data={this.props.stores} />
        break
      case 'ion' :
        return <IONComponent isAdmin={isAdmin} data={this.props.stores} />
        break
      case 'zoom':
        return <ZoomComponent isAdmin={isAdmin} data={this.props.stores} />
        break
    }
  }

  render () {
    // const language = this.state.currentLanguage
    let Modal = ReactBootstrap.Modal
    let Button = ReactBootstrap.Button
    let Tabs = ReactBootstrap.Tabs
    let show = false
    if (this.props.stores.storePopUpClient !== undefined && this.props.stores.storePopUpClient) {
      show = this.props.stores.storePopUpClient
    } else if (this.props.stores.storePopUpAdmin !== undefined && this.props.stores.storePopUpAdmin) {
      show = this.props.stores.storePopUpAdmin
    }
    // let Tab = ReactBootstrap.Tab
    // let show = (this.props.stores.storePopUpClient !== undefined) ? this.props.stores.storePopUpClient : (this.props.stores.storePopUpAdmin !== undefined) ? this.props.stores.storePopUpAdmin : false
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
            {this.storeTabs()}
          </Tabs>
        </Modal.Body>
      </Modal >
    )
  }
}

function mapStateToProps (state) {
  return {
    stores: state.StorePopupDetails
  }
}

//  function mapDispatchToProps(dispatch) {
//      return bindActionCreators({  closePopup: closePopup() }, dispatch);
//  }

export default connect(mapStateToProps)(ModalContainer)
