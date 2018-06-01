import React, { Component } from 'react'
import * as languageSettings from '../components/Language/languageSettings'
import StoreDetailsAdmin from '../components/Stores/StoreDetailsAdmin'
import StoreDetailsClient from '../components/Stores/StoreDetailsClient'
import { initStoresDetails, adminStoresDetails } from '../actions/stores'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AuthenticationService from '../components/Security/AuthenticationService'
import {Config} from '../Config'

class StoreDetails extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentLanguage: languageSettings.getCurrentLanguage()
    }
    this.authService = new AuthenticationService(Config.authBaseUrl)
  }
  componentWillMount () {
    this.props.initStoresDetails()
    this.props.adminStoresDetails()
  }

  render () {
    return (
      <div>
        <StoreDetailsClient showStores={!this.authService.isAdmin()} stores={this.props.storesDetails} />
        <StoreDetailsAdmin showStores={this.authService.isAdmin()} stores={this.props.storesDetails} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    books: state.books,
    storesDetails: state.storeDetails
  }
}
function  matchDispatchToProps (dispatch) {
  return  bindActionCreators(
    {
      initStoresDetails: initStoresDetails,
      adminStoresDetails: adminStoresDetails
    }, dispatch
  )
}
export default connect(mapStateToProps, matchDispatchToProps)(StoreDetails)
