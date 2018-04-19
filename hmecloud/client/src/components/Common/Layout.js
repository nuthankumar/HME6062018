// react modules
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import HmeHeader from '../Header/HmeHeader';
import AdminSubHeader from '../Header/adminSubHeader'
import Footer from '../Footer/Footer';
import { Config } from '../../Config'
import Authenticate from '../Security/Authentication'
import * as UserContext from '../Common/UserContext'
//import AutoSignOut from '../Security/AutoSignOut'
import AuthenticationService from '../Security/AuthenticationService'
import Common from './Common.css'
import Modal from 'react-modal';
import 'url-search-params-polyfill';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding:'10px'
    }
};


export default class Layout extends React.Component {
    constructor() {
        super()
        this.authService = new AuthenticationService(Config.authBaseUrl)

        this.state = {
            modalIsOpen: false,
            signoutTime : 20000
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.signOutInterval = this.signOutInterval.bind(this);
        this.authService = new AuthenticationService(Config.authBaseUrl)
        this.state.masquerade = this.authService.getMasquerade()
        this.state.url = this.authService.getColdFusionAppUrl(UserContext.isAdmin())
      }
    componentDidMount() {
        this.signOutInterval(UserContext.isAdmin(), UserContext.isLoggedIn())
        this.setUserContext()
    }

    componentWillMount() {
        //UserContext.isAdmin()
        //this.setUserContext()
    }

    autoSignout() {
         let signout = setTimeout(function () {
             if (this.state.modalIsOpen) {
                 console.log('signOut');
                 let url = Config.adminColdFusionUrl + "?token=" + this.state.masquerade
                 window.location.href = url;
             }
             else {
             clearTimeout(signout);
             }
         }.bind(this), this.state.signoutTime)
    } 

    openModal() {
        this.setState({ modalIsOpen: true });
 
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
        this.signOutInterval(UserContext.isAdmin(), UserContext.isLoggedIn())
    }

    signOutInterval(isAdmin, isLoggedIn) {
        if (isAdmin && isLoggedIn && this.authService.getMasquerade()) {
            let autoInterval = setInterval(function () {
               if (!this.state.modalIsOpen) {                 
                   clearInterval(autoInterval);
                   this.openModal()
                   this.autoSignout();
                }
           }.bind(this), 3000000) 
        }
    }
    setUserContext() {
        // this.authService.setToken(Config.ctxToken, false)
        let ctxToken = this.authService.getToken()
        if (ctxToken) {
            let ctxUser = this.authService.getProfile()
            if (ctxUser) {
                this.state.contextUser = ctxUser
            }
        }
        let loggedInUser = this.authService.getLoggedInProfile()
        if (loggedInUser) {
            this.state.loggedInUser = loggedInUser
        }
        this.setState(this.state)
    }

    render() {
        const { Params, children } = this.props;
        const { contextUser } = this.state;
        let pathName = Params.location.pathname;
        const params = new URLSearchParams(this.props.Params.location.search);
        const token = params.get('token') ? params.get('token'):null
        const admin = params.get('a') =='true' ? true : false 
        //const admin = params.get('atoken') ? true : false;
        const uuid = params.get('uuid') ? params.get('uuid') : null
        const userName = params.get('un') ? params.get('un') : null
        const masquerade = params.get('atoken') ? params.get('atoken') : null
        if (token) {
            this.authService.setToken(token, admin)
            UserContext.isLoggedIn()
            let path = window.location.pathname;
            window.location.href = path;
        }
        
        if (uuid) {
                this.authService.setUUID(uuid)
        }
        if (userName) {
            this.authService.setUserName(userName)
        }
        if (masquerade) {
            this.authService.setMasquerade(masquerade)
        }

        localStorage.setItem('id_token', Config.token)
        let idToken = localStorage.getItem('id_token')
        let isAdministrator = (idToken) ? true : false;
         
        isAdministrator = true;
        let isAdmin = false
        let isLoggedIn = false;
        let adminLogo = false

        if (window.location.pathname == '/admin') {
            isAdmin = true
            this.authService.setAdmin(isAdmin)
        }
        else {
            isAdmin = UserContext.isAdmin();
            if (isAdmin == true) {
                isAdmin = true
            } else {
                isAdmin = false
            }
        }

        if (UserContext.isLoggedIn()) {
            isLoggedIn = true
        } else {
            isLoggedIn = false
        }

        if ((!isLoggedIn && window.location.pathname == '/admin') || isAdmin) {
            adminLogo = true
        }
         let userToken = localStorage.getItem('token') ? localStorage.getItem('token') : localStorage.getItem('ctx_token') ? localStorage.getItem('ctx_token') : localStorage.getItem('id_token') 
         let contextUserEmail = this.authService.getTokenDetails(userToken);
        return (
            <div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    ariaHideApp={false}
                >
                    <header className="modalHeader"> Auto SignOut <button onClick={this.closeModal}> X </button> </header>
                    <span className="autoSignOutContent">You are currently viewing the site as {contextUserEmail.User_EmailAddress} </span>
                    <button className="continueButton" onClick={this.closeModal}>Continue Viewing as {contextUserEmail.User_EmailAddress} </button>
                </Modal>
                <HmeHeader isAdministrator={isAdministrator} isAdmin={isAdmin} adminLogo={adminLogo} isLoggedIn={isLoggedIn} />
                <AdminSubHeader isAdmin={isAdmin} adminLogo={adminLogo} isLoggedIn={isLoggedIn} pathName={pathName} />
                <div className="hmeBody">
                    {children}
                </div>
                <Footer />
              
            </div>
        );
    }
}