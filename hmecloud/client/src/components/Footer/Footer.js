import React from 'react'
import ReactDOM from "react-dom";
import "../Footer/Footer.css";
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
import { Config } from '../../Config'
import * as UserContext from '../Common/UserContext'
import AuthenticationService from '../Security/AuthenticationService'
const ProductLogo = require('../../images/ProductLogo-1.png')
const HMELogo = require('../../images/HMELogo.png')
const CogWheel = require("../../images/Cog.png");

export default class Footer extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            currentLanguage: languageSettings.getCurrentLanguage(),
            token: UserContext.getToken()
        }
        this.authService = new AuthenticationService(Config.authBaseUrl)
        this.state.url = this.authService.getColdFusionAppUrl(UserContext.isAdmin())
    }
  render() {
      const language = this.state.currentLanguage
      const { token, url } = this.state;
    return (<div >
        <div id="Footer">
            <div className="copyright">
            <span>HM Electronics, Inc. ©2018
	    |
		    <a className="terms black_link" href={url + "images/HMECLOUD_Terms_and_Conditions.pdf?token="+token} target="_blank" translate="" key="useragreement">{t[language].useragreement}</a>
                    |
			<a className="privacy black_link" href={url + "images/HMECLOUD_Privacy_Policy.pdf?token=" + token} target="_blank" translate="" key="privacypolicy">{t[language].privacypolicy}</a>
                    | 
		    <a className="supply black_link" href={url + "images/California_Transparency_Supply_Chains_Act_Disclosures.pdf?token=" + token} target="_blank" translate="" key="californiasupply">{t[language].californiasupply}</a>
                    |
		    <a className="cookie black_link" href={url + "images/HMECLOUD_Cookie_Policy.pdf?token=" + token} target="_blank">{t[language].cookiepolicy}</a>
            </span></div>
        </div>
    </div>)
  }
}
