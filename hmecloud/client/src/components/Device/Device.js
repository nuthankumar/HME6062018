import React, { Component } from 'react';
//import './Systems.css'
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
import CommonLoader from '../Alerts/CommonLoader'


class Device extends Component { //ensure you dont export component directly
    constructor (props) {
        super(props)
        this.state = {
          showStores: this.props.showStores,
          language: languageSettings.getCurrentLanguage(),
        }
    }
    render() {
        const { language } = this.state;
        return (
              <section className="device">
                 <CommonLoader showLoader={true} message={"AttemptingConnection"}/>
                 {/* <iframe src=""></iframe>*/}
              </section>
        );
    }
}

export default Device;

















