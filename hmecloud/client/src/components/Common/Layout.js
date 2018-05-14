// react modules
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import HmeHeader from '../Header/HmeHeader';
import SettingsHeader from '../Header/SettingsHeader'
import AdminSubHeader from '../Header/adminSubHeader'
import Footer from '../Footer/Footer';
import { Config } from '../../Config'
import Authenticate from '../Security/Authentication'
//import * as UserContext from '../Common/UserContext'
//import AutoSignOut from '../Security/AutoSignOut'
import AuthenticationService from '../Security/AuthenticationService'
import Common from './Common.css'
import Modal from 'react-modal';
import 'url-search-params-polyfill';
import Api from '../../Api'
import t from '../Language/language'
import * as languageSettings from '../Language/languageSettings'

import Idle from 'react-idle'

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '10px'
    }
};


export default class Layout extends React.Component {
    constructor() {
        super()
        this.authService = new AuthenticationService(Config.authBaseUrl)

        this.state = {
            modalIsOpen: false,
            signoutTime: 20000,
            language: languageSettings.getCurrentLanguage(),
        };
        this.api = new Api()

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    //    this.signOutInterval = this.signOutInterval.bind(this);
        this.authService = new AuthenticationService(Config.authBaseUrl)
        this.state.idToken = this.authService.getIdToken()
        this.state.url = this.authService.getColdFusionAppUrl(this.authService.isAdmin())
        this.state.timer = null;
    }
    componentDidMount() {
       // this.signOutInterval()
        this.setUserContext()
    }

    componentWillMount() {
        this.prepareProfile();
    }

    prepareProfile() {

        const params = new URLSearchParams(this.props.Params.location.search);
        const contextToken = params.get('token') ? params.get('token') : null
        const admin = params.get('a') == 'true' ? true : false
        //const admin = params.get('atoken') ? true : false;
        const uuid = params.get('uuid') ? params.get('uuid') : null
        const userName = params.get('un') ? params.get('un') : null
        const idToken = params.get('atoken') ? params.get('atoken') : null
        const userId = params.get('memail') ? params.get('memail') : null

        if (contextToken) {
            this.authService.setToken(contextToken, admin)
        }
        if (idToken) {
            this.authService.setTokens(idToken, contextToken, admin)
        }
        if (userId) {
            let user = {
                username: userId
            }
            let url = Config.authBaseUrl + Config.tokenPath
            this.api.postData(url, user, data => {
                if (data && data.accessToken) {
                    this.authService.setTokens(this.authService.getIdToken(), data.accessToken,
                        this.authService.isAdmin())
                    let path = window.location.pathname;
                    if (uuid) {
                        path += '?uuid=' + uuid;
                    }
                    window.location.href = path;
                }
            }, error => {
            })
        }
        else if (contextToken) {
            let path = window.location.pathname;
            if (uuid) {
                path += '?uuid=' + uuid;
            }
            window.location.href = path;
        }

        if (uuid) {
            this.authService.setUUID(uuid)
        }

        if (!this.authService.isLoggedIn()) {
            this.authService.setAdmin(window.location.pathname == '/admin')
        }

        if(window.location.pathname == "/grouphierarchy" ){
             window.location.href =  "/settings/stores/grouphierarchy"+this.props.Params.location.search

         }
         else if(window.location.pathname == "/groups"){
             window.location.href =  "/settings/stores/groups"+this.props.Params.location.search
         }
         else if(window.location.pathname == "/user"){
             window.location.href =  "/settings/users/user"+this.props.Params.location.search
         }
    }

    // autoSignout() {
    //     let signout = setTimeout(function () {
    //         if (this.state.modalIsOpen) {
    //             if(this.authService.isMasquerade()){
    //             let url = Config.adminColdFusionUrl + "?token=" + this.state.idToken
    //             this.authService.clear()
    //             window.location.href = url;
    //             }
    //             else {        
    //                 if(this.authService.isAdmin()){
    //                 let url = Config.adminColdFusionUrl;
    //                 this.authService.clear()
    //                 window.location.href = url+'?pg=Logout';
    //                 }
                
    //                 else{        
    //                 let url = Config.coldFusionUrl;
    //                 this.authService.clear()
    //                 window.location.href = url+'?pg=Logout';
    //                 }
    //             }
    //         }
    //         else {
    //         clearTimeout(signout);
    //         }
    //     }.bind(this), 
    //     this.state.signoutTime)
    //     }
        

    openModal() {

        // if (this.authService.isMasquerade()) {
        //     this.setState({ modalIsOpen: true });
        // };

       // if (this.authService.isMasquerade()) {
            this.setState({ modalIsOpen: true });
       // };
    }

    closeModal() {
        clearTimeout(this.state.timer);
        this.setState({ modalIsOpen: false });
        //this.signOutInterval()
    }
    // signOutInterval() {
    //     if (this.authService.isLoggedIn()) {
    //         let autoInterval = setInterval(function () {
    //             if (!this.state.modalIsOpen) {
    //                 clearInterval(autoInterval);
    //                 this.openModal()
    //                 this.autoSignout();
    //             }
    //         }.bind(this), 300000)
    //     }
    // }
    setUserContext() {
        // this.authService.setToken(Config.ctxToken, false)
        let ctxToken = this.authService.getToken()
        if (ctxToken) {
            let ctxUser = this.authService.getProfile()
            if (ctxUser) {
                this.state.contextUser = ctxUser
            }
        }
        let loggedInUser = this.authService.getProfile()
        if (loggedInUser) {
            this.state.loggedInUser = loggedInUser
        }
        this.setState(this.state)
    }

    showPopUp(e){
        if(this.authService.isLoggedIn()){
        this.state = {
            modalIsOpen: true
        }
        clearTimeout(this.state.timer);
        this.setState(this.state);
        this.state.timer = setTimeout(function(){
            if (this.state.modalIsOpen) {
                if(this.authService.isMasquerade()){
                let url = Config.adminColdFusionUrl + "?token=" + this.state.idToken
                this.authService.clear()
                window.location.href = url;
                }
                else {        
                    if(this.authService.isAdmin()){
                    let url = Config.adminColdFusionUrl;
                    this.authService.clear()
                    window.location.href = url+'?pg=Logout';
                    }
                
                    else{        
                    let url = Config.coldFusionUrl;
                    this.authService.clear()
                    window.location.href = url+'?pg=Logout';
                    }
                }
            }
            else {
             clearTimeout(this.state.timer);
            }
        }.bind(this),20000);
        this.setState(this.state);
       }
    }

    render() {
        const { children } = this.props;
        const { contextUser,language } = this.state;

        let contextUserEmail = this.authService.getProfile();
        return (
            <div>
                <Idle
                    timeout={300000}
                    onChange={({ idle}) => {
                        if (idle) {
                          this.showPopUp(this)
                        }}
                    }
                />
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    ariaHideApp={false}
                >
                    <header className="modalHeader"> {t[language].AutoLogout} <button onClick={this.closeModal}> X </button> </header>
                    <div className={this.authService.isMasquerade()?'show':'hidden'}>                   
                    <span className="autoSignOutContent">{t[language].YouAreCurrentlyViewing}  {contextUserEmail.User_EmailAddress ? contextUserEmail.User_EmailAddress : contextUserEmail.name} </span>
                    <button className="continueButton" onClick={this.closeModal}>{t[language].ContinueViewingAs} {contextUserEmail.User_EmailAddress ? contextUserEmail.User_EmailAddress : contextUserEmail.name} </button>
                    </div>
                    <div className={!this.authService.isMasquerade()?'show':'hidden'}>
                    <span className="autoSignOutContent">{t[language].YouAreAboutToBeSignedOut}</span>
                    <button className="continueButton" onClick={this.closeModal}>{t[language].StayLoggedIn}</button>
                    </div>                
                </Modal>                
                <HmeHeader />
                <AdminSubHeader />
                <div><SettingsHeader /></div>
                <div className="hmeBody ">
                    {children}
                </div>
                <Footer />

            </div>
        );
    }
}
