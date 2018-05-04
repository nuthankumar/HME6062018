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
//import * as UserContext from '../Common/UserContext'

const ProductLogo = require('../../images/ProductLogo-1.png')

const AdminProductLogo = require('../../images/ProductLogo-2.png')
const HMELogo = require('../../images/HMELogo.png')
const CogWheel = require("../../images/Cog.png");


export default class HmeHeader extends React.Component {
    constructor(props) {
        super(props)
        //languageSettings.setCurrentLanguage('fr');
        this.authService = new AuthenticationService(Config.authBaseUrl)
        this.state = {
            language: languageSettings.getCurrentLanguage(),
            settingsDropdown: false,
            showSubMenu: true,
            contextUser: {
                User_EmailAddress: ''
            },
            loggedInUser: {},
            token: this.authService.getToken(),

        }

        this.apiMediator = new Api()
        this.state.url = this.authService.getColdFusionAppUrl(this.authService.isAdmin())
        this.state.masquerade = this.authService.isMasquerade();
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);

        // this.contextUser = {}
    }

    componentDidMount() {
        // if (localStorage.getItem('token')) {
        this.setUserContext() // to-do: remove this once its set @ cfm-app
        // }
        document.addEventListener('mousedown', this.handleClickOutside);
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setUserContext() {
        this.state.contextUser = this.authService.getProfile()
        let user = this.authService.isMasquerade() ? this.authService.getAdminProfile() : this.authService.getProfile();
        this.state.userName = user.name ? user.name : user.User_FirstName + ' ' + user.User_LastName;
        this.setState(this.state)
    }

    renderAdminMenuItems(isAdmin) {
        //  document.body.addEventListener('click', this.handleOnClick.bind(this)); 
    }
    renderAdminMenuItems() {

        const { language, showSubMenu, token, url } = this.state;
        if (this.authService.isAdmin() && this.authService.isLoggedIn()) {
            return (
                <ul>
                    <li><a className="headerMenu" href={url + "?token=" + token}>{t[language].navbarWelcome}</a></li>
                    <li><a className={"headerMenu "+ (window.location.pathname ? (window.location.pathname.indexOf("/settings/stores") !== -1 ? "active_tab" : '') : '')} href={url + "?pg=SettingsStores&path=Main&token=" + token}>{t[language].navbarStores}</a></li>
                    <li><a className="headerMenu" href={url + "?pg=SettingsDevices&path=Main&token=" + token}>{t[language].navbarSystems}</a></li>
                    <li><a className={"headerMenu "+ (window.location.pathname ? (window.location.pathname.indexOf("/settings/users") !== -1 ? "active_tab" : '') : '')} href={url + "?pg=pg=SettingsUsers&path=Main&token=" + token}>{t[language].navbarUsers}</a></li>
                    <li><a className="headerMenu" href={url + "?pg=SettingsAccounts&token=" + token}>{t[language].navbarAccounts}</a></li>
                    <li><a className="headerMenu" href={url + "?pg=SettingsDistributors&token=" + token}>{t[language].navbarDistributers}</a></li>
                </ul>
            );
        } else {
            return '';
        }
    }
    renderClientMenuItems() {
        const { language, showSubMenu, token, url } = this.state;
        if (!this.authService.isAdmin() && this.authService.isLoggedIn()) {
            return (
                <ul>
                    <li><a className="headerMenu" href={url + "?token=" + token}>{t[language].navbarWelcome}</a></li>
                    <li id="zoomLabel"><a className="headerMenu" href={url + "?pg=Dashboards&token=" + token}>{t[language].navbarDashboard}</a></li>
                    <li id="zoomLabel"><Link className={"headerMenu "+ (window.location.pathname ? (window.location.pathname.indexOf("/reports") !== -1 ? "active_tab" : '') : '')} to='/reports'>{t[language].navbarReports}</Link></li>
                    <li><a className="headerMenu" href={url + "?pg=SettingsAccount&token=" + token}>{t[language].navbarMyAccount}</a></li>
                    <li><a className={"headerMenu "+ (window.location.pathname ? (window.location.pathname.indexOf("/settings") !== -1 ? "active_tab" : '') : '')} href={url + "?pg=SettingsStores&token=" + token}>{t[language].navbarSettings}</a></li>
                </ul>
            );
        } else {
            return '';
        }
    }
    renderLogo() {
        if (this.authService.isAdmin()) {
            return (<img className='adminImage ' src={AdminProductLogo} aria-hidden='true' />)

        } else {
            return (<img src={ProductLogo} aria-hidden='true' />)
        }
    }
    renderProfileHeader() {
        const { language, showSubMenu, contextUser, loggedInUser, token, url, masquerade, userName } = this.state;

        if (this.authService.isLoggedIn()) {
            return (<span >
                <div>
                    <div className="loggedInUser">
                        <a className="black_link headerLink loginInfo" href={url + "?pg=SettingsAccount&token=" + token}><span> {t[language].headerLoggedInAs} </span> <span className="username">{userName}</span></a>
                    </div>
                    <div>
                        <span className={masquerade ? 'show' : 'hidden'}>
                            <MasqueradeHeader />
                        </span>
                    </div>
                </div>
            </span>)
        }
        else {
            return (<span></span>)
        }
    }
    renderLogoutButton() {
        if (this.authService.isLoggedIn()) {
            return (<button className='logout ' onClick={this.logout.bind(this)}> <span> {t[this.state.language].headerSignOut}</span></button>
            );
        } else {
            return "";
        }
    }
    renderMenu() {
        if (this.authService.isLoggedIn()) {
            return (<div className='mainMenu menuBar '>
                {this.renderClientMenuItems()}
                {this.renderAdminMenuItems()}
            </div>)
        } else {
            return (<div />)
        }
    }
    renderSettings() {
        const { language, showSubMenu, contextUser, loggedInUser, token, url, masquerade, userName } = this.state;

        if (this.authService.isLoggedIn()) {
            return (<div >
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
            </div>)
        }
        else {
            return (<div />)
        }
    }
    render() {
        const { language, showSubMenu, contextUser, loggedInUser, token, url, masquerade, userName } = this.state;

        return (
            <div >
                <header className='reports-page-header'>
                    <div> <a href={url + "?token=" + token}>
                        {this.renderLogo()}
                    </a></div>
                    <div className='user-info-section'>
                        {this.renderProfileHeader()}
                        {this.renderLogoutButton()}
                        <img className='logOutIcon' src={HMELogo} aria-hidden='true' />
                    </div>
                </header>
                <nav className='reports-navigation-header'>
                    <div id="Navbar" className="Navbar">
                        {this.renderMenu()}
                    </div>
                    {this.renderSettings()}
                </nav>
            </div>)
    }

    toggle(e) {
        this.state.settingsDropdown ? this.setState({ settingsDropdown: false }) : this.setState({ settingsDropdown: true })
    }

    logout(e) {
        this.authService.clear()
        let url = this.state.url + "?pg=Logout&token=" + this.state.token
        window.location.href = url;
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
