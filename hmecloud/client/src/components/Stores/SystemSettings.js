import React, { Component } from 'react'
import './Stores.css'
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from 'react-accessible-accordion'
import 'react-accessible-accordion/dist/fancy-example.css'
// import t from '../Language/language'
// import * as languageSettings from '../Language/languageSettings'

class SystemSettings extends Component {
  constructor (props) {
    super(props)
  }
  // this.state = {
  //   currentLanguage: languageSettings.getCurrentLanguage()
  // }
  render () {
    // const language = this.state.currentLanguage
    return (
      <div className='system-settings-container'>
        <h3 className='system-settings-header'>System Settings</h3>
        <Accordion className='system-settings-accordion'>
          {this.renderAccordian()}
        </Accordion>
      </div>
    )
  }

  renderAccordian () {
    if (this.props.data !== undefined) {
      const values = this.props.data.systemSettings
      let roleOptions = values.map(function (value, index) {
        return (<AccordionItem key={index} className='settings-accordion-item'>
          <AccordionItemTitle className='settings-accordion-title'>
            <h3 className='settings-accordion-header'>{value.name}</h3>
          </AccordionItemTitle>
          <AccordionItemBody className='settings-accordion-content'>
            <Table data={value.value} />
          </AccordionItemBody>
        </AccordionItem>)
      })
      return roleOptions
    }
  }
}

class Table extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    let rows = this.props.data.map((person, index) => {
      return <PersonRow key={
        person.index
      } data={person}
      />
    })
    return (<table > <thead>
      <tr className='settings-table-header'>
        <th>Settings</th>
        <th className='text-right'>Value</th>
      </tr>
    </thead><tbody > {rows} </tbody> </table>)
  }
}

const PersonRow = (props) => {
  return (
    <tr className='system-settings-row-data'>
      <td>
        <strong>{props.data.SettingInfo_Name}</strong>
      </td>
      <td className='text-right'>
        {props.data.DeviceSetting_SettingValue}
      </td>
    </tr>
  )
}

export default SystemSettings
