import React, { Component } from 'react'
import './ViewDetails.css'
// import t from '../components/Language/language'
import * as languageSettings from '../components/Language/languageSettings'
import SystemSettings from '../components/Stores/SystemSettings'
import SystemStatus from '../components/Stores/SystemStatus'
import RemoteSystemActions from '../components/Stores/RemoteSystemActions'
import { connect } from 'react-redux'
import 'url-search-params-polyfill'
// import { bindActionCreators } from 'redux'
import { initViewStore } from '../actions/viewDetails'

class ViewDetails extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentLanguage: languageSettings.getCurrentLanguage()
    }
    // console.log(this.props.viewDetails);
  }
  componentWillMount () {
    const params = new URLSearchParams(this.props.history.location.search)
    const contextToken = params.get('uuid') ? params.get('uuid') : null
    this.props.dispatch(initViewStore(contextToken))
  }
  render () {
    // const language = this.state.currentLanguage
    // let displayData = this.props.systemStats
    if (this.props.storeViewDetails !== undefined) {
      return (
        <div className='deviceDetails'>
          {/* <div className='col-xs-4'> */}
          <SystemStatus data={this.props.storeViewDetails} history={this.props.history} />
          {/* </div> */}
          {/* <div className='col-xs-8'> */}
          <SystemSettings data={this.props.storeViewDetails} />
          <RemoteSystemActions systemActions={this.props.storeViewDetails} history={this.props.history} />
          {/* </div> */}
        </div>
      )
    } else {
      return (
        <div>Loading</div>
      )
    }
  }
}

function mapStateToProps (state) {
  return {
    storeViewDetails: state.viewDetails.storeViewDetails
  }
}

export default connect(mapStateToProps)(ViewDetails)
