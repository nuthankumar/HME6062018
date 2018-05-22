import React, { Component } from 'react'

import t from '../components/Language/language'
import * as languageSettings from '../components/Language/languageSettings'
import StoreDetailsAdmin from '../components/Stores/StoreDetailsAdmin'
import StoreDetailsClient from '../components/Stores/StoreDetailsClient'
import { initStoresDetails , adminStoresDetails} from "../actions/stores";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import { initViewStoresDetails} from "../actions/stores";


class StoreDetails extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentLanguage: languageSettings.getCurrentLanguage()
    }
 }
componentWillMount() {   

  this.props.initStoresDetails(); 
  console.log(this.props);
 // this.props.dispatch(adminStoresDetails()); 
}


  render () {


    const language = this.state.currentLanguage
    let displayData = this.props.systemStats
     return (
        <div>
          <StoreDetailsClient showStores={true} stores={this.props.storesDetails}/>
          <StoreDetailsAdmin showStores={false} stores={this.props.storesDetails}/>
        </div>
      )
  }
} 

function mapStateToProps(state) {
    return {
         books: state.books,
         storesDetails: state.storeDetails,
     }
 }

//  function mapDispatchToProps(dispatch) {
//   return bindActionCreators({
//     initStoresDetails:initStoresDetails }, dispatch);
//   } 


  function matchDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        initStoresDetails:initStoresDetails
      },    dispatch
    );
  } 


 export default connect(mapStateToProps, matchDispatchToProps)(StoreDetails)

