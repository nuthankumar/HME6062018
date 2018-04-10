import React from 'react'
import ReactDOM from "react-dom";
import "../Footer/Footer.css";
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'

const ProductLogo = require('../../images/ProductLogo-1.png')
const HMELogo = require('../../images/HMELogo.png')
const CogWheel = require("../../images/Cog.png");

export default class Footer extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            currentLanguage: languageSettings.getCurrentLanguage()
        }
    }
  render() {
    const language = this.state.currentLanguage
    return (<div >
        <div id="Footer">
            <div class="copyright">
            <span>HM Electronics, Inc. ©2018
	    |
		    <a class="terms" href="/images/HMECLOUD_Terms_and_Conditions.pdf" target="_blank" translate="" key="useragreement">{t[language].useragreement}</a>
                    |
			<a class="privacy" href="/images/HMECLOUD_Privacy_Policy.pdf" target="_blank" translate="" key="privacypolicy">{t[language].privacypolicy}</a>
                    |
		    <a class="supply" href="/images/California_Transparency_Supply_Chains_Act_Disclosures.pdf" target="_blank" translate="" key="californiasupply">{t[language].californiasupply}</a>
                    |
		    <a class="cookie" href="/images/HMECLOUD_Cookie_Policy.pdf" target="_blank" translate="" key="cookiepolicy">{t[language].cookiepolicy}</a>
                </span></div>
        </div>
    </div>)
  }
}
