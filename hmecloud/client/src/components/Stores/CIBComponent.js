import React, { Component } from 'react'
import './Stores.css'
// import t from '../Language/language'
// import * as languageSettings from '../Language/languageSettings'

// export default class BookList extends Component {
class CIBComponent extends Component { // ensure you dont export component directly
  constructor (props) {
    super(props)
    this.state = {
      showStores: this.props.showStores
    }
  }

  render () {
    return (
      <div>CIB component returned</div>
    )
  }
}

export default CIBComponent
