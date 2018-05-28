import React, { Component } from 'react'
import './ViewDetails.css'
// import t from '../components/Language/language'
import * as languageSettings from '../components/Language/languageSettings'
import SystemSettings from '../components/Stores/SystemSettings'
import SystemStatus from '../components/Stores/SystemStatus'
import { connect } from 'react-redux'
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
    this.props.dispatch(initViewStore())
  }
  render () {
    // const language = this.state.currentLanguage
    // let displayData = this.props.systemStats
    console.log('okkkk', this.props.storeViewDetails)
    if (this.props.storeViewDetails !== undefined) {
      return (
        <div className='deviceDetails'>
          <div className='col-xs-4'>
            <SystemStatus data={this.props.storeViewDetails} />
          </div>
          <div className='col-xs-8'>
            <SystemSettings data={this.props.storeViewDetails} />
          </div>
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
