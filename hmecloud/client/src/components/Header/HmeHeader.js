import React from 'react'
import ReactTooltip from 'react-tooltip'
import ReactDOM from "react-dom";
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'
import "../Header/Header.css";
import { Config } from '../../Config'
import { Link } from 'react-router-dom'
import MasqueradeHeader from '../Header/masqueradeHeader';
import Api from '../../Api'

const ProductLogo = require('../../images/ProductLogo-1.png')
const HMELogo = require('../../images/HMELogo.png')
const CogWheel = require("../../images/Cog.png");


export default class HmeHeader extends React.Component {
    constructor(props) {
        super(props)
        //languageSettings.setCurrentLanguage('fr');
        this.state = {
            language: languageSettings.getCurrentLanguage(),
            settingsDropdown: false,
            showSubMenu: true,
        }

        this.apiMediator = new Api()
    }

    componentDidMount(){
        this.setUserContext()
    }

    setUserContext(){
        localStorage.setItem('loggedInUserToken', Config.token)
        localStorage.setItem('viewAsUserToken', Config.ctxToken)
        
        const loggedInUser = localStorage.getItem('loggedInUserToken');
        const viewAsUser = localStorage.getItem('viewAsUserToken');
        if (loggedInUser) {
            this.apiMediator.verifyToken
        console.log('loggedInUser: ', loggedInUser)          
        console.log('viewAsUser: ', viewAsUser)          
        }
    }

    renderAdminMenuItems(isAdmin) {
        const { language, showSubMenu } = this.state;
        if (isAdmin) {
            return (
                <ul>
                    <li><a className="headerMenu" href={Config.coldFusionUrl}>{t[language].navbarStores}</a></li>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?pg=SettingsStores&amp;path=Main"}>{t[language].navbarSystems}</a></li>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?pg=SettingsDevices&amp;path=Main"}>{t[language].navbarSystems}</a></li>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?pg=pg=SettingsUsers&amp;path=Main"}>{t[language].navbarUsers}</a></li>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?pg=SettingsAccounts"}>{t[language].navbarAccounts}</a></li>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?pg=SettingsDistributors"}>{t[language].navbarDistributers}</a></li>
                </ul>
            );
        } else {
            return '';
        }
    }
    renderClientMenuItems(isAdmin) {
        const { language, showSubMenu } = this.state;
        if (!isAdmin) {
            return (
                <ul>
                    <li><a className="headerMenu" href={Config.coldFusionUrl}>{t[language].navbarWelcome}</a></li>
                    <li id="zoomLabel"><a className="headerMenu" href={Config.coldFusionUrl + "?pg=Dashboards"}>{t[language].navbarDashboard}</a></li>
                    <li id="zoomLabel"><Link className="active_tab headerMenu" to='/reports'>{t[language].navbarReports}</Link></li>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?pg=SettingsAccount"}>{t[language].navbarMyAccount}</a></li>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?pg=SettingsStores"}>{t[language].navbarSettings}</a></li>
                </ul>
            );
        } else {
            return '';
        }
    }
    render() {
        const { language, showSubMenu } = this.state;
        const { isAdmin } = this.props;
        let viewAsUser = 'Manoj VS', loggedInUser = 'Rudra'
        return (
            <div >
                <header className='reports-page-header'>
                    <div> <a href={Config.coldFusionUrl}> <img className='logOutIcon' src={ProductLogo} aria-hidden='true' /> </a></div>
                    <div className='user-info-section'>
                        <span>
                            <a className="black_link headerLink" href={Config.coldFusionUrl + "?pg=SettingsAccount"}><span> {t[language].headerLoggedInAs} </span> <span className="username">{loggedInUser}</span></a>
                            <MasqueradeHeader isAdmin={isAdmin} viewAsUser={viewAsUser} />
                        </span>
                        <button className='logout'> <a className="black_link" href={Config.coldFusionUrl + "?pg=Logout"}> {t[language].headerSignOut}</a></button>
                        <img className='logOutIcon' src={HMELogo} aria-hidden='true' />
                    </div>
                </header>
                <nav className='reports-navigation-header'>
                    <div id="Navbar" className="Navbar">
                        <div className="mainMenu menuBar">
                            { this.renderClientMenuItems(isAdmin)}

                            {/* admin menu */}
                            { this.renderAdminMenuItems(isAdmin) }
                        </div>
                    </div>
                    <div className='cogWheelSection'>
                        {/*<a data-tip="<a>HTML tooltip</a> <br/> <a>HTML tooltip</a> <br/> <a>HTML tooltip</a>" data-html={true} data-event='click focus'>  <img className='cogWheel' src={CogWheel} aria-hidden='true' /></a>
            <ReactTooltip html={true} place="right" type="dark" effect="solid" globalEventOff='click' eventOff='click' />*/}
                        <div className="dropdown open">
                            <a href="javascript:void(0);" className="dropdown-toggle" onClick={this.toggle.bind(this)}><img className='cogWheel' src={CogWheel} aria-hidden='true' /></a>
                            <ul className={'dropdown-menu dropdown-menu-right ' + (this.state.settingsDropdown ? 'show' : 'hide')}>
                                <li><a href={Config.coldFusionUrl + "?pg=Settings"}>{t[language].navbarOptionSettings}</a></li>
                                <li><a href={Config.coldFusionUrl + "?pg=Leaderboard&amp;st=Edit"}>{t[language].navbarOptionLeaderboard}</a></li>
                                <li><a href={Config.coldFusionUrl + "?pg=Help"}>{t[language].navbarOptionHelp}</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>)
    }

    toggle(e) {
        this.state.settingsDropdown ? this.setState({ settingsDropdown: false }) : this.setState({ settingsDropdown: true })
    }

    redirectUrl(url) {
        console.log(url)
    }
}
