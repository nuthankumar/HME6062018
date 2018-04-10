import React, { Component } from 'react'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './SummaryReport.css'
import '../../../node_modules/font-awesome/css/font-awesome.min.css'

export default class PaginationComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {

    return (<div className={'col-xs-2 left-padding-none ' + (this.state.allTab ? 'hide' : 'show')}>
            <div id='page-navigations'>
              <div className='page-navs'>
                Page <span className='pgStarts'>1</span> <span translate='' className='ReportsOf'>of </span> 1</div>
              <div className='previous-link' ><i className='fa fa-angle-left previous-page' /></div>
              <div className='next-link'><i className='fa fa-angle-right next-page' /></div>
            </div>
          </div>)
  }
}
