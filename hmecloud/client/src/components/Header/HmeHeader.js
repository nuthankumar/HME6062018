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
            token: UserContext.getToken(),

        }

        this.apiMediator = new Api()
        this.authService = new AuthenticationService(Config.authBaseUrl)
        this.state.url = this.authService.getColdFusionAppUrl(UserContext.isAdmin())
        this.state.masquerade = this.authService.isMasquerade();
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);

        // this.contextUser = {}
    }

    componentDidMount() {
        if (localStorage.getItem('token')) {
            this.setUserContext() // to-do: remove this once its set @ cfm-app
        }
        document.addEventListener('mousedown', this.handleClickOutside);
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setUserContext() {
        // this.authService.setToken(Config.ctxToken, false)
        let ctxToken = this.authService.getToken()
        let token = UserContext.getToken()

        if (token) {
            this.state.contextUser = this.authService.getTokenDetails(token)
        }
        else if (ctxToken) {
            let ctxUser = this.authService.getProfile()
            if (ctxUser) {
                this.state.contextUser = ctxUser
            }
        }

        //let loggedInUser = this.authService.getLoggedInProfile()
        let loggedInUser = this.authService.getUserName()
        if (loggedInUser) {
            this.state.userName = loggedInUser
        }
        else {
            let token = UserContext.getToken();
            let userObject = this.authService.getTokenDetails(token);
            this.state.userName = userObject.name;
        }
        this.setState(this.state)
    }

    renderAdminMenuItems(isAdmin) {
        //  document.body.addEventListener('click', this.handleOnClick.bind(this)); 
    }
    renderAdminMenuItems(isAdmin, isLoggedIn) {

        const { language, showSubMenu, token, url } = this.state;
        if (isAdmin && isLoggedIn) {
            return (
                <ul>
                    <li><a className="headerMenu" href={url + "?token=" + token}>{t[language].navbarStores}</a></li>
                    <li><a className="headerMenu" href={url + "?pg=SettingsStores&path=Main&token=" + token}>{t[language].navbarSystems}</a></li>
                    <li><a className="headerMenu" href={url + "?pg=SettingsDevices&path=Main&token=" + token}>{t[language].navbarSystems}</a></li>
                    <li><a className="headerMenu active_tab" href={url + "?pg=pg=SettingsUsers&path=Main&token=" + token}>{t[language].navbarUsers}</a></li>
                    <li><a className="headerMenu" href={url + "?pg=SettingsAccounts&token=" + token}>{t[language].navbarAccounts}</a></li>
                    <li><a className="headerMenu" href={url + "?pg=SettingsDistributors&token=" + token}>{t[language].navbarDistributers}</a></li>
                </ul>
            );
        } else {
            return '';
        }
    }
    renderClientMenuItems(isAdmin, isLoggedIn) {
        const { language, showSubMenu, token, url } = this.state;
        if (!isAdmin && isLoggedIn) {
            return (
                <ul>
                    <li><a className="headerMenu" href={url + "?token=" + token}>{t[language].navbarWelcome}</a></li>
                    <li id="zoomLabel"><a className="headerMenu" href={url + "?pg=Dashboards&token=" + token}>{t[language].navbarDashboard}</a></li>
                    <li id="zoomLabel"><Link className="active_tab headerMenu" to='/reports'>{t[language].navbarReports}</Link></li>
                    <li><a className="headerMenu" href={url + "?pg=SettingsAccount&token=" + token}>{t[language].navbarMyAccount}</a></li>
                    <li><a className="headerMenu" href={url + "?pg=SettingsStores&token=" + token}>{t[language].navbarSettings}</a></li>
                </ul>
            );
        } else {
            return '';
        }
    }
    render() {
        const { language, showSubMenu, contextUser, loggedInUser, token, url, masquerade, userName } = this.state;
        const { isAdministrator, isAdmin, isLoggedIn, adminLogo } = this.props;



        return (
            <div >
                <header className='reports-page-header'>
                    <div> <a href={url + "?token=" + token}>
                        <img className={adminLogo ? 'hidden' : 'show'} src={ProductLogo} aria-hidden='true' />
                        <img className={'adminImage ' + (adminLogo ? 'show' : 'hidden')} src={AdminProductLogo} aria-hidden='true' />
                    </a></div>
                    <div className='user-info-section'>
                        {/* <span className={(isLoggedIn ? 'show' : 'hidden')}> */}
                        <span className={(isAdministrator && isLoggedIn ? 'show' : 'hidden')}>

                            <div>
                                <div className="loggedInUser">
                                    <a className="black_link headerLink loginInfo" href={url + "?pg=SettingsAccount&token=" + token}><span> {t[language].headerLoggedInAs} </span> <span className="username">{userName}</span></a>
                                </div>
                                <div>
                                    <span className={masquerade ? 'show' : 'hidden'}><MasqueradeHeader isAdministrator={isAdministrator} viewAsUser={this.state.contextUser} />
                                    </span>
                                </div>
                            </div>


                            {/* <MasqueradeHeader isAdmin="true" viewAsUser={this.state.contextUser} /> */}
                        </span>
                        <button className={'logout ' + (isLoggedIn ? 'show' : 'hidden')}> <a className="black_link" href={url + "?pg=Logout&token=" + token} onClick={this.logout.bind(this)}> {t[language].headerSignOut}</a></button>
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
                            <div className="dropdown open" ref={this.setWrapperRef}>
                                <a href="javascript:void(0);" className="dropdown-toggle" onClick={this.toggle.bind(this)}><img className='cogWheel' src={CogWheel} aria-hidden='true' /></a>
                                <ul className={'dropdown-menu dropdown-menu-right ' + (this.state.settingsDropdown ? 'show' : 'hide')}>
                                    <li><a href={url + "?pg=Settings&token=" + token}>{t[language].navbarOptionSettings}</a></li>
                                    <li><a href={url + "?pg=Leaderboard&st=Edit&token=" + token}>{t[language].customizeleaderboard}</a></li>
                                    <li><a href={url + "?pg=Help&token=" + token}>{t[language].navbarOptionHelp}</a></li>
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


    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({ settingsDropdown: false })
        }
    }
    setWrapperRef(node) {
        this.wrapperRef = node;
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
