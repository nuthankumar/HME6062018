import React from 'react'

const HMELogo = require('../../images/HMELogo.png')
const zoomLogo = require('../../images/ZoomLogo.PNG')

export default class PageHeader extends React.Component {
  constructor (props) {
    super()
  }
  render () {
    return (<div className='row'>
      <div className='col-xs-9 summary-header'>
        <div className='summary-header-text'>{this.props.pageHeading}</div>
      </div>
      <div className='col-xs-3'>
        <img src={HMELogo} />
        <img src={zoomLogo} />
      </div>
    </div>)
  }
}
