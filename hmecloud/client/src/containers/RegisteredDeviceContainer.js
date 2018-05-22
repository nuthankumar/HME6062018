import React, { Component } from 'react'

import t from '../components/Language/language'
import * as languageSettings from '../components/Language/languageSettings'
// import StoreDetail from '../components/Stores/StoreDetail'
import StoredetailsComponent from '../components/Stores/StoreDetailsComponent'
import ZoomComponent from '../components/Stores/ZoomComponent'
import CIBComponent from '../components/Stores/CIBComponent'
import EOSComponent from '../components/Stores/EOSComponent'
import RegisteredDeviceComponent from '../components/Stores/RegisteredDeviceComponent'
import * as ReactBootstrap from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { closePopup } from "../actions/modalAction";
// import  actionCreator  from '../actions/modalAction';



class RegisteredDeviceContainer extends Component {
 
  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false
    }
  }


  render () {
   
    return (
         <RegisteredDeviceComponent deviceDetails = {this.props.deviceDetails}/>
    )
  }
}



function mapStateToProps(state) {
    return {
         deviceDetails: state.storePopupDetails.deviceDetails,
     }
 }

 function mapDispatchToProps(dispatch) {
     return bindActionCreators({  closePopup: closePopup()  }, dispatch);
 }

 export default connect(mapStateToProps, mapDispatchToProps)(RegisteredDeviceContainer)

