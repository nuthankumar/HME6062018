import React, { Component } from 'react'

import t from '../components/Language/language'
import * as languageSettings from '../components/Language/languageSettings'
// import StoreDetail from '../components/Stores/StoreDetail'
import StoredetailsComponent from '../components/Stores/StoreDetailsComponent'
import ZoomComponent from '../components/Stores/ZoomComponent'
import CIBComponent from '../components/Stores/CIBComponent'
import EOSComponent from '../components/Stores/EOSComponent'
import * as ReactBootstrap from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { closePopup, initModal } from "../actions/modalAction";
// import  actionCreator  from '../actions/modalAction';



class ModalContainer extends Component {
 
  constructor(props, context) {
    super(props, context);
  
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    let initTab =  'Store Details';
    this.state = {
      show: false,
      key: 1,
      activetab: initTab,
      tabData : [
        { name: 'Store Details', isActive: true , comp:'store'},
        { name: 'CIB', isActive: false, comp : 'cib' },
        { name: 'EOS', isActive: false , comp: 'eos'},
        { name: 'ZOOM', isActive: false , comp : 'zoom' }
      ]
    }
    this.handleClick = this.handleClick.bind(this)
    this.renderTabComponent = this.renderTabComponent.bind(this)
    this.storeTabs = this.storeTabs.bind(this)
  }
  
  componentWillMount(){
    this.props.dispatch(initModal());       
  }



  handleSelect(key) {
   // alert(`selected ${key}`);
    this.setState({ key });
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }


  handleClick(event) {
   // let tab
   // this.setState({activetab: tab});  
  }

  storeTabs(){
    let Tab = ReactBootstrap.Tab
    return this.state.tabData.map((tabItem, index) => {
      return (
        <Tab eventKey={index+1} title={tabItem.name} onClick={this.handleClick}>
          {this.renderTabComponent(tabItem.comp)}
         </Tab>
      )
    })
    
  }
  
  renderTabComponent(tabcomponent){
    switch(tabcomponent){
      case 'store' : 
      return <StoredetailsComponent/>
      break;
      case 'cib' : 
      return <CIBComponent/>
      break;
      case 'eos' : 
      return <EOSComponent/>
      break;
      case 'zoom' : 
      return <ZoomComponent/> 
      break;
    }
  }

  render () {

    // const language = this.state.currentLanguage
    let Modal = ReactBootstrap.Modal
    let Button = ReactBootstrap.Button
    let Tabs = ReactBootstrap.Tabs
    let Tab = ReactBootstrap.Tab
    return (
       <div>
         <Button bsStyle="primary" bsSize="large" onClick={this.handleShow}>
           Launch demo modal
         </Button>
           <Modal  show={this.state.show} onHide={this.handleClose} dialogClassName = 'modal-popup'>
          
             <Modal.Body>
              <Tabs
             activeKey={this.state.key}
             onSelect={this.handleSelect}
             id="store-tabs"
             >
              {this.storeTabs()}
           </Tabs> 
             </Modal.Body>
            
          </Modal>
       </div>
    )
  }
}



function mapStateToProps(state) {
    return {
         stores: state.storePopupDetails,
     }
 }

//  function mapDispatchToProps(dispatch) {
//      return bindActionCreators({  closePopup: closePopup() }, dispatch);
//  }

 export default connect(mapStateToProps)(ModalContainer)

