
import React from 'react'
import "../Alerts/Alerts.css";
import Footer from "../Footer/Footer";
import HmeHeader from "../Header/HmeHeader";
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'

export default class Message extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentLanguage: languageSettings.getCurrentLanguage(),
            key: this.props.history.location.state
        }
        const language = this.state.currentLanguage
        this.state.message = t[language][this.state.key];
        console.log(this.state.language);
    }
    render() {
    
        return (
            <section>
                    <div id="Content">
                            <div class="forms clear">
                        <div class="appr">
                            <h4>{this.state.message}</h4>
                                </div>
                            </div>
                    </div>
                </section>
            )
    }
}
