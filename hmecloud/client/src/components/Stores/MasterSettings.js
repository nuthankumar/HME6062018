import React, { Component } from 'react'
import './Stores.css'

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
      settings: [{label: 'one', id: '1', 'checked': false}, {label: 'two', id: '2', 'checked': false}, {label: 'three', id: '3', 'checked': false}, {label: 'four', id: '4', 'checked': false}],
      destinations: [{label: 'one', id: '21', 'checked': true}, {label: 'two', id: '22', 'checked': false}, {label: 'three', id: '23', 'checked': true}, {label: 'four', id: '24', 'checked': true}],
      selectAllSettings: false,
      selectAllDestination: false

    }
  }

  render () {
    // const language = this.state.currentLanguage
    // let displayData = this.props.systemStats
    const settings = this.state.settings
    const destinations = this.state.destinations
    const settingsAll = this.state.selectAllSettings
    const destinationsAll = this.state.selectAllSettings
    return (
      <section className='masterSettings'>
        <section>
          <SystemStatus />
          <div className='settingsSection'>
            <h3 class='clear versions'>Settings</h3>
            <div>
              <input type='checkbox' name='settings' id='settings' onClick={this.selectAllSettigs.bind(this, settings, settingsAll)} />
              <label for='settings' class='clear'>Select All</label>
            </div>
            <div id='availSettingsBox' class='form_cbox' name=''>
              <div>
                {this.renderSettings()}
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className='destinationSection'>

            <div className='settingsSection'>
              <h3 class='clear versions'>Destination</h3>
              <div>
                <input type='checkbox' name='destinations' id='destinations' onClick={this.selectAllDestinations.bind(this, destinations, destinationsAll)} />
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
                                    &nbsp;|&nbsp;<a class='cancel_butt' href='./?pg=SettingsGroups'>Cancel</a>
          </div>
        </section>
      </section>
    )
  }
  onCheckSettings (id, e) {
    const Options = this.state.settings
    Options.map(function (Option, index) {
      if (Option.id === id) {
        Option.checked = !Option.checked
      }
    })
    this.setState({ settings: Options })
  }
  onCheckDestinations (id, e) {
    const Options = this.state.destinations
    Options.map(function (Option, index) {
      if (Option.id === id) {
        Option.checked = !Option.checked
      }
    })
    this.setState({ destinations: Options })
  }

  renderSettings () {
    let self = this
    if (this.state.settings) {
      const Options = this.state.settings
      let roleOptions = Options.map(function (Option, index) {
        return (
          <div>
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
    if (this.state.destinations) {
      let Options = this.state.destinations
      let destinations = Options.map(function (Option, index) {
        return (
          <div>
            <input type='checkbox' checked={Option.checked} name='Settings_List' value={Option.id} id={Option.id} onClick={self.onCheckDestinations.bind(self, Option.id)} />
            <label for={Option.id} class='clear'>{Option.label}</label>
          </div>
        )
      })
      return destinations
    }
  }

  selectAllSettigs (Options, state, e) {
    let settingsState = this.state.selectAll
    Options.map(function (Option, index) {
      Option.checked = !settingsState
    })
    this.state.selectAll = !this.state.selectAll
    this.setState(this.state)
    this.setState({settings: Options})
  }

  selectAllDestinations (Options, state, e) {
    let destinationState = this.state.selectAllDestination
    Options.map(function (Option, index) {
      Option.checked = !destinationState
    })
    this.state.selectAllDestination = !this.state.selectAllDestination
    this.setState(this.state)
    this.setState({destinations: Options})
  }

  submit () {
    let settings = _.where(this.state.settings, {checked: true})
    let destinations = _.where(this.state.destinations, {checked: true})
    console.log(settings)
    console.log(destinations)
  }
}

export default MasterSettings
