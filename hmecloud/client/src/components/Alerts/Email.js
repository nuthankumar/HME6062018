import React from 'react'
import "../Alerts/Alerts.css";
import Footer from "../Footer/Footer";
import HmeHeader from "../Header/HmeHeader";
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'

export default class EmailAlert extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentLanguage: languageSettings.getCurrentLanguage(),
            emailId: this.props.history.location.state
        }
       
    }
    render() {
        const language = this.state.currentLanguage
        return (
            <section>
                    <div id="Content">
                            <div class="forms clear">
                        <div class="appr">
                            <h4>{t[language].pleasecheckemailreport} {this.state.emailId}.</h4>
                                </div>
                            </div>
                    </div>
                </section>
            )
    }
}
