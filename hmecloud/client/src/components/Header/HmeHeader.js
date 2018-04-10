import React from 'react'
import ReactTooltip from 'react-tooltip'
import ReactDOM from "react-dom";
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
import "../Header/Header.css";

const ProductLogo = require('../../images/ProductLogo-1.png')
const HMELogo = require('../../images/HMELogo.png')
const CogWheel = require("../../images/Cog.png");

export default class HmeHeader extends React.Component {
    constructor(props) {
        super(props)
        languageSettings.setCurrentLanguage('en');
        this.state = {
            currentLanguage: languageSettings.getCurrentLanguage()
        }
    }
    render() {
    const language = this.state.currentLanguage
    return (<div >
      <header className='reports-page-header'>
            <div> <a href="./"> <img className='logOutIcon' src={ProductLogo} aria-hidden='true' /> </a></div>
        <div className='user-info-section'>
                <span> <a class="black_link" href="./?pg=SettingsAccount"><span> {t[language].headerLoggedInAs} </span> ' Rudra</a> </span>
                <button className='logout'> <a href="./?pg=Logout"> {t[language].headerSignOut}</a></button>
          <img className='logOutIcon' src={HMELogo} aria-hidden='true' />
        </div>
      </header>
      <nav className='reports-navigation-header' >
   <div id="Navbar" className="Navbar">    
     <ul>
                    <li><a href="/" translate="" key="navbarWelcome">{t[language].navbarWelcome}</a></li>
                    <li id="zoomLabel"><a href="/?pg=Dashboards">{t[language].navbarDashboard}</a></li>
                    <li id="zoomLabel" class="active_tab"><a href="/?pg=Reports">{t[language].navbarReports}</a></li>
                    <li><a href="./?pg=SettingsAccount">{t[language].navbarMyAccount}</a></li>
                    <li><a href="./?pg=SettingsStores">{t[language].navbarSettings}</a></li>
 	</ul>
  </div>
        <div className='cogWheelSection'>
            <img className='cogWheel' src={CogWheel} aria-hidden='true' />
        </div>         
      </nav>
    </div>)
  }
}
