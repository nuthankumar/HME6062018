import React from 'react'

export default class ErrorAlert extends React.Component {
  render () {
    if (this.props.errorMessage !== '' && this.props.errorMessage !== undefined && this.props.errorMessage !== null) {
      return (
        <div className='alert alert-danger'>
          {this.props.errorMessage}
        </div>
      )
    } else {
      return (
        <div />
      )
    }
  }
}
