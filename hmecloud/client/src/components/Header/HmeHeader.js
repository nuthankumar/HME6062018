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
import AuthenticationService from '../Security/AuthenticationService'
import * as UserContext from '../Common/UserContext'

const ProductLogo = require('../../images/ProductLogo-1.png')

const AdminProductLogo = require('../../images/ProductLogo-2.png')
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
            contextUser: {
                User_EmailAddress: ''
            },
            loggedInUser: {},
            token: UserContext.getToken()
        }

        this.apiMediator = new Api()
        this.authService = new AuthenticationService(Config.authBaseUrl)
        // this.contextUser = {}
    }

    componentDidMount() {
        this.setUserContext() // to-do: remove this once its set @ cfm-app
    }

    setUserContext() {
        this.authService.setToken(Config.ctxToken)
        let ctxToken = this.authService.getToken()
        if (ctxToken) {
            let ctxUser = this.authService.getProfile()
            if (ctxUser) {
                this.state.contextUser = ctxUser
            }
            console.log('ctxUser: ', ctxUser)

        }

        let loggedInUser = this.authService.getLoggedInProfile()

        if (loggedInUser) {
            this.state.loggedInUser = loggedInUser
        }
        console.log('loggedInUser: ', loggedInUser)
        this.setState(this.state)
    }

    renderAdminMenuItems(isAdmin) {
        //  document.body.addEventListener('click', this.handleOnClick.bind(this)); 
    }
    renderAdminMenuItems(isAdmin, isLoggedIn) {

        const { language, showSubMenu, token } = this.state;
        if (isAdmin && isLoggedIn) {
            return (
                <ul>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?token=" + token}>{t[language].navbarStores}</a></li>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?pg=SettingsStores&amp;path=Main;token=" + token}>{t[language].navbarSystems}</a></li>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?pg=SettingsDevices&amp;path=Main;token=" + token}>{t[language].navbarSystems}</a></li>
                    <li><a className="headerMenu active_tab" href={Config.coldFusionUrl + "?pg=pg=SettingsUsers&amp;path=Main;token=" + token}>{t[language].navbarUsers}</a></li>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?pg=SettingsAccounts;token=" + token}>{t[language].navbarAccounts}</a></li>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?pg=SettingsDistributors;token=" + token}>{t[language].navbarDistributers}</a></li>
                </ul>
            );
        } else {
            return '';
        }
    }
    renderClientMenuItems(isAdmin, isLoggedIn) {
        const { language, showSubMenu, token } = this.state;
        if (!isAdmin && isLoggedIn) {
            return (
                <ul>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?token=" + token}>{t[language].navbarWelcome}</a></li>
                    <li id="zoomLabel"><a className="headerMenu" href={Config.coldFusionUrl + "?pg=Dashboards;token=" + token}>{t[language].navbarDashboard}</a></li>
                    <li id="zoomLabel"><Link className="active_tab headerMenu" to='/reports'>{t[language].navbarReports}</Link></li>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?pg=SettingsAccount;token=" + token}>{t[language].navbarMyAccount}</a></li>
                    <li><a className="headerMenu" href={Config.coldFusionUrl + "?pg=SettingsStores;token=" + token}>{t[language].navbarSettings}</a></li>
                </ul>
            );
        } else {
            return '';
        }
    }
    render() {
        const { language, showSubMenu, contextUser, loggedInUser, token } = this.state;
        const { isAdministrator, isAdmin, isLoggedIn, adminLogo } = this.props;
        // let loggedInUser = 'Rudra'
        return (
            <div >
                <header className='reports-page-header'>
                    <div> <a href={Config.coldFusionUrl + "?token=" + token}>
                        <img className={adminLogo ? 'hidden' : 'show'} src={ProductLogo} aria-hidden='true' />
                        <img className={'adminImage ' + (adminLogo ? 'show' : 'hidden')} src={AdminProductLogo} aria-hidden='true' />
                    </a></div>
                    <div className='user-info-section'>
                        {/* <span className={(isLoggedIn ? 'show' : 'hidden')}> */}
                        <span className={(isAdministrator ? 'show' : 'hidden')}>
                            <a className="black_link headerLink" href={Config.coldFusionUrl + "?pg=SettingsAccount;token=" + token}><span> {t[language].headerLoggedInAs} </span> <span className="username">{loggedInUser.name}</span></a>
                            <MasqueradeHeader isAdministrator={isAdministrator} viewAsUser={this.state.contextUser} />
                            {/* <MasqueradeHeader isAdmin="true" viewAsUser={this.state.contextUser} /> */}
                        </span>
                        <button className={'logout ' + (isLoggedIn ? 'show' : 'hidden')}> <a className="black_link" href={Config.coldFusionUrl + "?pg=Logout;token=" + token} onClick={this.logout.bind(this)}> {t[language].headerSignOut}</a></button>
                        <img className='logOutIcon' src={HMELogo} aria-hidden='true' />
                    </div>
                </header>
                <nav className='reports-navigation-header'>
                    <div id="Navbar" className="Navbar">

                        <div className={'mainMenu menuBar ' + (isLoggedIn ? 'show' : 'hidden')}>

                            {
                                this.renderClientMenuItems(isAdmin, isLoggedIn)
                            }

                            {/* admin menu */}
                            {this.renderAdminMenuItems(isAdmin, isLoggedIn)}

                        </div>
                    </div>
                    <div className={(isLoggedIn ? 'show' : 'hidden')}>
                        {/*<a data-tip="<a>HTML tooltip</a> <br/> <a>HTML tooltip</a> <br/> <a>HTML tooltip</a>" data-html={true} data-event='click focus'>  <img className='cogWheel' src={CogWheel} aria-hidden='true' /></a>
            <ReactTooltip html={true} place="right" type="dark" effect="solid" globalEventOff='click' eventOff='click' />*/}
                        <div className="cogWheelSection">
                            <div className="dropdown open">
                                <a href="javascript:void(0);" className="dropdown-toggle" onClick={this.toggle.bind(this)}><img className='cogWheel' src={CogWheel} aria-hidden='true' /></a>
                                <ul className={'dropdown-menu dropdown-menu-right ' + (this.state.settingsDropdown ? 'show' : 'hide')}>
                                    <li><a href={Config.coldFusionUrl + "?pg=Settings;token=" + token}>{t[language].navbarOptionSettings}</a></li>
                                    <li><a href={Config.coldFusionUrl + "?pg=Leaderboard&amp;st=Edit;token=" + token}>{t[language].customizeleaderboard}</a></li>
                                    <li><a href={Config.coldFusionUrl + "?pg=Help;token=" + token}>{t[language].navbarOptionHelp}</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>)
    }

    toggle(e) {
        this.state.settingsDropdown ? this.setState({ settingsDropdown: false }) : this.setState({ settingsDropdown: true })
    }
    logout(e) {
        UserContext.clearToken();
    }

    redirectUrl(url) {
        console.log(url)
    }
    //handleOnClick(e) {
    //    console.log(e)
    //    let set;
    //    if (e.target.className == 'cogWheel') {
    //        this.setState({ settingsDropdown: true });
    //    }
    //    else {
    //        this.setState({ settingsDropdown: false });
    //    }
    //}
}
