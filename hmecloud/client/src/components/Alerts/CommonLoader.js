import React from 'react'
import "./Alerts.css";
import Footer from "../Footer/Footer";
import HmeHeader from "../Header/HmeHeader";
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'

const LoaderImg = require("../../images/Loader.gif");

export default class CommonLoader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            language: languageSettings.getCurrentLanguage(), 
          }
    }
    render() {
        const { language } = this.state;
        const message = this.props.message;
        const { showLoader } = this.props;
        return (
            <section className={"commonLoaderSection text-center " + (showLoader ? 'show' : 'hidden')}>
                <h3 className="loaderTxt">{t[language][message]? t[language][message] : message }</h3>
                <div><img src={LoaderImg}/></div>
            </section>
        )
    }
}
