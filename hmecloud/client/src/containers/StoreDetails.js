import React, { Component } from 'react'

import t from '../components/Language/language'
import * as languageSettings from '../components/Language/languageSettings'
import StoreDetailsAdmin from '../components/Stores/StoreDetailsAdmin'
import StoreDetailsClient from '../components/Stores/StoreDetailsClient'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import  actionCreator  from '../actions/index';

class StoreDetails extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentLanguage: languageSettings.getCurrentLanguage(),
    }
   this.props.getDetails();
   console.log(this.props.stores);
}

  render () {
    const language = this.state.currentLanguage
    let displayData = this.props.systemStats
    console.log(this.props.stores)
    return (
      <div>
        <StoreDetailsClient showStores={true}/>
        <StoreDetailsAdmin showStores={false}/>
      </div>
    )
  }
}

function mapStateToProps(state) {
    return {
         books: state.books,
         stores: state.storeDetails,
     }
 }

 function mapDispatchToProps(dispatch) {
     return bindActionCreators({  getDetails: actionCreator.getDetails  }, dispatch);
 }

 export default connect(mapStateToProps, mapDispatchToProps)(StoreDetails)

