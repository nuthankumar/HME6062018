import React, { Component } from 'react'

import t from '../components/Language/language'
import * as languageSettings from '../components/Language/languageSettings'
import StoreDetailsAdmin from '../components/Stores/StoreDetailsAdmin'
import StoreDetailsClient from '../components/Stores/StoreDetailsClient'
import { initStoresDetails} from "../actions/stores";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { initViewStoresDetails} from "../actions/stores";


class StoreDetails extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentLanguage: languageSettings.getCurrentLanguage(),
    }

   console.log(this.props.stores);
}
componentWillMount() {             
  this.props.dispatch(initStoresDetails()); 
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

 export default connect(mapStateToProps)(StoreDetails)

