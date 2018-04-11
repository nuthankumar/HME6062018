import React from 'react'
import "./Alerts.css";
import Footer from "../Footer/Footer";
import HmeHeader from "../Header/HmeHeader";
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'

const LoaderImg = require("../../images/Loader.gif");

export default class Loader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentLanguage: languageSettings.getCurrentLanguage(),
        }

    }
    render() {
        const language = this.state.currentLanguage;
        const { showLoader } = this.props;
        console.log(showLoader);
        return (
            <section className={"loaderSection text-center " + (showLoader ? 'show' : 'hidden')}>
                <h3 className="loaderTxt">Please wait while your report is being generated...</h3>
                <div><img src={LoaderImg}/></div>
                <div className="loaderNote">Please Note: This report may take a while to load depending on the amount of data being requested.</div>
            </section>
        )
    }
}
