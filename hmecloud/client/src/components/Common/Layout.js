// react modules
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import HmeHeader from '../Header/HmeHeader';
import AdminSubHeader from '../Header/adminSubHeader'
import Footer from '../Footer/Footer';
import Authenticate from '../Security/Authentication'
import * as UserContext from '../Common/UserContext'


export default class Layout extends React.Component {
    render() {
        const { Params, children } = this.props;
        let pathName = Params.location.pathname;
      
        let isAdmin, isLoggedIn = false;
        let adminLogo = false
        if (UserContext.isAdmin()) {
            isAdmin = true
        } else {
            isAdmin = false
        }
        if (UserContext.isLoggedIn()) {
            isLoggedIn = true
        } else {
            isLoggedIn = false
        }

        if ((!isLoggedIn && window.location.pathname == '/admin') || isAdmin ) {
            adminLogo = true
        }
     return (
            <div>
             <HmeHeader isAdmin={isAdmin} adminLogo={adminLogo} isLoggedIn={isLoggedIn}/>
             <AdminSubHeader isAdmin={isAdmin} adminLogo={adminLogo} isLoggedIn={isLoggedIn} pathName={pathName}/>
                <div className="hmeBody">
                    {children}
                </div>
                <Footer />
            </div>
        );
    }
}