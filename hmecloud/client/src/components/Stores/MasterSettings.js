import React, { Component } from 'react'
import './Stores.css'
import { bindActionCreators, getState } from 'redux'
import { connect } from 'react-redux'
// import viewDetails from '../../reducers/store/storeDetails'
import store from '../../reducers/store'
import * as masterSettingsAction from '../../actions/masterSettings'

import SystemStatus from './SystemStatus'
// import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'

const _ = require('underscore')

class MasterSettings extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentLanguage: languageSettings.getCurrentLanguage(),
      selectAll: false,
      settings: [],
      destinations: [],
      selectAllSettings: false,
      selectAllDestination: false
    }
  }
  componentWillMount () {
    this.props.getMasterSettings('asdasd')
  }


  // generateSettings () {
  //   console.log(this.props.masterSettings)
  //   return [{ label: 'one', id: '1', 'checked': true }, { label: 'two', id: '2', 'checked': false }, { label: 'three', id: '3', 'checked': false }, { label: 'four', id: '4', 'checked': false }]
  // }
  // generateDestinations () {    
  //   console.log(this.props.masterSettings)
  //   return [{ label: 'one', id: '21', 'checked': true }, { label: 'two', id: '22', 'checked': false }, { label: 'three', id: '32', 'checked': false }, { label: 'four', id: '42', 'checked': false }]
  // }
  render () {
    // const language = this.state.currentLanguage
    // let displayData = this.props.systemStats
   // const settings = this.props.masterSettings.selectList ? this.props.masterSettings.selectList : [] 
    const destinationsAll = this.state.selectAllSettings
   // const destinations = this.props.masterSettings.destinationList ?  this.props.masterSettings.destinationList : []
    const settingsAll = this.state.selectAllSettings

    if (this.props.masterSettings) {
     return (
        <section className='masterSettings'>
          <section>
            <SystemStatus data={this.props.viewDetails.storeViewDetails} />
            <div className='settingsSection'>
              <h3 className='clear versions'>Settings</h3>
              <div className='alignItems selectAllHeader'>
                <input type='checkbox' name='settings' id='settings' onClick={this.selectAllSettigs.bind(this, settingsAll)} />
                <label for='settings' class='clear'>Select All</label>
              </div>
              <div id='availSettingsBox' class='form_cbox' name=''>
                <div>
                  {this.renderSettings()}
                </div>
              </div>
            </div>
          </section>
          <section className='destinationSectionRight'>
            <div className='destinationSection'>
              <div className='settingsSection'>
                <h3 class='clear versions'>Destination</h3>
                <div className='alignItems selectAllHeader'>
                  <input type='checkbox' name='destinations' id='destinations' onClick={this.selectAllDestinations.bind(this, destinationsAll)} />
                  <label for='destinations' class='clear'>Select All</label>
                </div>
                <div id='availSettingsBox' class='form_cbox' name=''>
                  <div>
                    {this.renderDestinations()}
                  </div>
                </div>
              </div>
            </div>
            <div id='settings-content'>
              <input id='settings-btn' type='submit' value='Apply' onClick={this.submit.bind(this)} />
            &nbsp;|&nbsp;<a className='cancel_btn' href='./?pg=SettingsGroups'>Cancel</a>
            </div>
          </section>
        </section>
      )
    } else {
      return ''
    }
  }
  onCheckSettings (id, e) {
    const Options = this.props.masterSettings.settingsList
    Options.map(function (Option, index) {
      if (Option.id === id) {
        Option.checked = !Option.checked
      }
    })
    this.setState({ settings: Options })
  }
  onCheckDestinations (id, e) {
    const Options = this.props.masterSettings.destinationList
    Options.map(function (Option, index) {
      if (Option.DestinationId === id) {
        Option.checked = !Option.checked
      }
    })
    this.setState({ destinations: Options })
  }

  renderSettings () {
    let self = this
    console.log(this.props.masterSettings)
    if (this.props.masterSettings.settingsList) {
      const Options = this.props.masterSettings.settingsList
      let roleOptions = Options.map(function (Option, index) {
        return (
          <div className='alignItems'>
            <input type='checkbox' checked={Option.checked} item={Options} name='Settings_List' value={Option.id} id={Option.id} onClick={self.onCheckSettings.bind(self, Option.id)} />
            <label for={Option.id} class='clear'>{Option.label}</label>
          </div>
        )
      })
      return roleOptions
    }
  }

  renderDestinations () {
    let self = this
    
    console.log(this.props.masterSettings)
    if (this.props.masterSettings) {
      let Options = this.props.masterSettings.destinationList
      let destinations = Options.map(function (Option, index) {
        return (
          <div className='alignItems'>
            <input type='checkbox' checked={Option.checked} name='Settings_List' value={Option.DestinationId} id={Option.DestinationId} onClick={self.onCheckDestinations.bind(self, Option.DestinationId)} />
            <label for={Option.DestinationId} class='clear'>{Option.label}</label>
          </div>
        )
      })
      return destinations
    }
  }

  selectAllSettigs (state, e) {

    let Options = this.props.masterSettings.settingsList
    let settingsState = this.state.selectAll
    Options.map(function (Option, index) {
      Option.checked = !settingsState
    })
    this.state.selectAll = !this.state.selectAll
    this.setState(this.state)
    this.setState({ settings: Options })
  }

  selectAllDestinations ( state, e) {
    let Options = this.props.masterSettings.destinationList
    let destinationState = this.state.selectAllDestination
    Options.map(function (Option, index) {
      Option.checked = !destinationState
    })
    this.state.selectAllDestination = !this.state.selectAllDestination
    this.setState(this.state)
    this.setState({ destinations: Options })
  }

  submit () {
    let settings = _.where(this.state.settings, { checked: true })
    let destinations = _.where(this.state.destinations, { checked: true })
    console.log(settings)
    console.log(destinations)
  }
}

function mapStateToProps (state) {
  return {
    viewDetails: state.viewDetails,
    masterSettings: state.masterSettings.masterSettings
  }
}
function matchDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      getMasterSettings: masterSettingsAction.getMasterSettings
    }, dispatch
  )
}
export default connect(mapStateToProps, matchDispatchToProps)(MasterSettings)
