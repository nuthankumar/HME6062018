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
            modalIsOpen: false
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.signOutInterval = this.signOutInterval.bind(this);
      
    }
    componentDidMount() {
        this.signOutInterval(UserContext.isAdmin() === 'true' ? true : false, UserContext.isLoggedIn())
    }
    
    openModal() {
        this.setState({ modalIsOpen: true });
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
        this.signOutInterval(UserContext.isAdmin() === 'true' ? true : false, UserContext.isLoggedIn())
    }

    signOutInterval(isAdmin,isLoggedIn){
        if (isAdmin && isLoggedIn) {
           let autoInterval = setInterval(function () {
               if (!this.state.modalIsOpen) {
                   clearInterval(autoInterval);
                    this.openModal()
                }
           }.bind(this), 300000) 
        }
     }

    render() {
 
        const { Params, children } = this.props;
        let pathName = Params.location.pathname;
        var url_string = window.location.href
        var url = new URL(url_string);
        let token = url.searchParams.get("token");
        let isAdminParam = url.searchParams.get("a");

        if (token) {
            this.authService.setToken(token, isAdminParam)
            UserContext.isLoggedIn()
            let path = window.location.pathname;
            window.location.href = path;
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
        }
        else {
            isAdmin = UserContext.isAdmin() === 'true' ? true : false;
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

    

        return (
            <div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    ariaHideApp={false}
                >
                    <header className="modalHeader"> Auto SignOut <button onClick={this.closeModal}> X </button> </header>
                    <span className="autoSignOutContent">You are currently viewing the site as another User</span> 
                    <button className="continueButton" onClick={this.closeModal}>Continue Viewing as Selected User</button>
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