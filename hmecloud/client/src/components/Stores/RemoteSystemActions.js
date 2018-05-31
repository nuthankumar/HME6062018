import React, { Component } from 'react'
// import ReactDOM from 'react-dom';
import './Stores.css'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class RemoteSystemActions extends Component {
  constructor (props) {
    super(props)
    this.state = {
      systemActions: this.props.systemActions
    }
  }

  masterSettings (e) {
    this.props.history.push('/stores/masterSettings')
    // this.props.history.location.pathName = '/stores/masterSettings'
  }

  render () {
    return (
      <div className='RemoteSystemActions'>
        <div><h3 class='versions'>Remote System Actions</h3>
          <a id='upgrade-btn'><div class='ActionButtons'> Upgrade System</div></a>
        </div>
        <div id='reboot-content'>
          <a id='reboot-btn'><div class='ActionButtons'>Reboot System</div></a>
        </div>
        <div id='reconnect-content'>
          <a id='reconnect-btn'><div class='ActionButtons'>Force Reconnect</div></a>
        </div>
        <div id='master-settings'>
          <a id='settings2-btn'><div class='ActionButtons' onClick={this.masterSettings.bind(this)}>Master Settings</div></a>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    storeViewDetails: state.viewDetails.storeViewDetails
  }
}

export default connect(mapStateToProps)(RemoteSystemActions)
