// react modules
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import HmeHeader from '../Header/HmeHeader';
import AdminSubHeader from '../Header/adminSubHeader'
import Footer from '../Footer/Footer';
import { Config } from '../../Config'
import Authenticate from '../Security/Authentication'
import * as UserContext from '../Common/UserContext'
import AutoSignOut from '../Security/AutoSignOut'
import AuthenticationService from '../Security/AuthenticationService'

export default class Layout extends React.Component {
    constructor() {
        super()
        this.authService = new AuthenticationService(Config.authBaseUrl)
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
        // return (
        let isAdmin = false
        let isLoggedIn = false;
        // let isAdmin;
        let adminLogo = false

        if (window.location.pathname == '/admin') {
            isAdmin = true
        }
        else {
            isAdmin = UserContext.isAdmin() === 'true' ? true : false;
            console.log(UserContext.isAdmin());
            if (isAdmin == true) {
                isAdmin = true
            } else {
                isAdmin = false
            }
        }

        // console.log(UserContext.isAdmin());

        if (UserContext.isLoggedIn()) {
            isLoggedIn = true
        } else {
            isLoggedIn = false
        }

        if ((!isLoggedIn && window.location.pathname == '/admin') || isAdmin) {
            adminLogo = true
        }

         console.log(isAdmin);
         console.log(isLoggedIn);
        return (
            <div>
                <AutoSignOut showToast={isAdministrator}/>
                <HmeHeader isAdministrator={isAdministrator} isAdmin={isAdmin} adminLogo={adminLogo} isLoggedIn={isLoggedIn} />
                <AdminSubHeader isAdmin={isAdmin} adminLogo={adminLogo} isLoggedIn={isLoggedIn} pathName={pathName} />
                <div className="hmeBody">
                    {children}
                </div>
                <Footer />
                {/* <AutoSignOut /> */}
            </div>
        );
    }
}