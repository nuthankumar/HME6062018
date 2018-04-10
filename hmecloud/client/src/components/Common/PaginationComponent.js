import React, { Component } from 'react'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../Report/SummaryReport.css'
import '../../../node_modules/font-awesome/css/font-awesome.min.css'

export default class PaginationComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

render () {
  return (<div id='page-navigations'>
            <div className='page-navs'>
            Page <span className='start-page'>{this.props.curPage}</span> <span translate='' className='ReportsOf'>of </span> {this.props.totalPages}</div>
            <div className={'previous-link ' + (this.props.disablePrevButton ? 'disable' : '' )} onClick={() => this.props.handlePreviousPage(this.props.curPage, this.props.totalPages)} ><i className='fa fa-angle-left previous-page' /></div>
            <div className={'next-link ' + (this.props.disableNextButton ? 'disable' : '' )} onClick={() => this.props.handleNextPage(this.props.curPage, this.props.totalPages)} ><i className='fa fa-angle-right next-page' /></div>
          </div>)
  }
}
