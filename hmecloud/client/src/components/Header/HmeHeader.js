import React from 'react'
import ReactTooltip from 'react-tooltip'
import ReactDOM from "react-dom";
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
import "../Header/Header.css";
import { Config } from '../../Config'
import { Link } from 'react-router-dom'

const ProductLogo = require('../../images/ProductLogo-1.png')
const HMELogo = require('../../images/HMELogo.png')
const CogWheel = require("../../images/Cog.png");




export default class HmeHeader extends React.Component {
    constructor(props) {
        super(props)
        languageSettings.setCurrentLanguage('fr');
        this.state = {
            currentLanguage: languageSettings.getCurrentLanguage()
        }
    }
    render() {
    const language = this.state.currentLanguage
    return (<div >
        <header className='reports-page-header'>
            <div> <a href={Config.coldFusionUrl}> <img className='logOutIcon' src={ProductLogo} aria-hidden='true' /> </a></div>
        <div className='user-info-section'>
                <span> <a class="black_link" href={Config.coldFusionUrl + "?pg=SettingsAccount"}><span> {t[language].headerLoggedInAs} </span> ' Rudra</a> </span>
                <button className='logout'> <a href={Config.coldFusionUrl + "?pg=Logout"}> {t[language].headerSignOut}</a></button>
          <img className='logOutIcon' src={HMELogo} aria-hidden='true' />
        </div>
      </header>
      <nav className='reports-navigation-header' >
   <div id="Navbar" className="Navbar">    
     <ul>
                    <li><a href={Config.coldFusionUrl}>{t[language].navbarWelcome}</a></li>
                    <li id="zoomLabel"><a href={Config.coldFusionUrl + "?pg=Dashboards"}>{t[language].navbarDashboard}</a></li>
                    <li id="zoomLabel" class="active_tab"><Link to='/reports'>{t[language].navbarReports}</Link></li>
                    <li><a href={Config.coldFusionUrl + "?pg=SettingsAccount"}>{t[language].navbarMyAccount}</a></li>
                    <li><a href={Config.coldFusionUrl + "?pg=SettingsStores"}>{t[language].navbarSettings}</a></li>
 	</ul>
  </div>
        <div className='cogWheelSection'>
            <img className='cogWheel' src={CogWheel} aria-hidden='true' />
        </div>         
      </nav>
    </div>)
  }
}
