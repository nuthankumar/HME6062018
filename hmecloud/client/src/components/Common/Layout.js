// react modules
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import HmeHeader from '../Header/HmeHeader';
import AdminSubHeader from '../Header/adminSubHeader'
import Footer from '../Footer/Footer';
import AutoSignOut from '../Security/AutoSignOut';

import { Config } from '../../Config'
import Authenticate from '../Security/Authentication'
import * as UserContext from '../Common/UserContext'

export default class Layout extends React.Component {
    render() {
        const { Params, children } = this.props;
        let pathName = Params.location.pathname;

        localStorage.setItem('id_token', Config.token)
        let idToken = localStorage.getItem('id_token')
        let isAdmin = (idToken) ? true : false;

        // return (

        let isLoggedIn = false;
        // let isAdmin;
        let adminLogo = false

        if (window.location.pathname == '/admin') {
            isAdmin = true
        }
        else {
            isAdmin = UserContext.isAdmin() === 'true' ? true:false ;
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

        // console.log(isAdmin);
        // console.log(isLoggedIn);
        return (
            <div>
                <HmeHeader isAdmin={isAdmin} adminLogo={adminLogo} isLoggedIn={isLoggedIn} />
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