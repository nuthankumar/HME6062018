import React from 'react'
const _ = require("underscore");

export default class ErrorAlert extends React.Component {
  
  constructor(props){
    super(props)
    this.state = {
        isMultiple: false
    }

    
//    if (this.props.errorMessage && this.props.errors){
//     if (_.contains(this.props.errors, this.props.errorMessage))
//     {
//        this.state.isMultiple = true;
//     }
//  }

    }
  
  
  
  render () {
    if (this.props.errorMessage && !this.props.errors){
    if (this.props.errorMessage !== '' && this.props.errorMessage !== undefined && this.props.errorMessage !== null) {
      return (
        <div className='alert alert-danger'>
          <ul>
             <li>{this.props.errorMessage}</li>
          </ul>
        </div>
      )
    }
  }
    else if (this.props.errors) {
      return (
        <div className='alert alert-danger errors'>
          <ul>
          {this.renderErrors(this.props.errors)}
          </ul>
        </div>
      )
    }
    else {
      return (
        <div />
      )
    }
  }

  renderErrors(errors) {
     if (errors) {
        let errorList  = errors.map(function (error, index) {
                 return (<li key={index}>{error}</li>)
         });
        return errorList;
    }
}
}
