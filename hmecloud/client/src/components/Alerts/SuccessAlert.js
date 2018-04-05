import React from 'react'

export default class SuccessAlert extends React.Component {
  render () {
    if (this.props.successMessage !== '' && this.props.successMessage !== undefined && this.props.successMessage !== null) {
      return (
        <div className='alert alert-success alert-dismissible' role='alert'>
          {this.props.successMessage}
        </div>
      )
    } else {
      return (
        <div />
      )
    }
  }
}
