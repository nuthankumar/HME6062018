// react modules
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import HmeHeader from '../Header/HmeHeader';
import AdminSubHeader from '../Header/adminSubHeader';
import Footer from '../Footer/Footer';
import AutoSignOut from '../Security/AutoSignOut';

import { Config } from '../../Config'

export default class Layout extends React.Component {
    render() {
        const { Params, children } = this.props;
        let pathName = Params.location.pathname;
        
        localStorage.setItem('id_token', Config.token)
        let idToken = localStorage.getItem('id_token')
        let isAdmin = (idToken) ? true : false;

        return (
            <div>
                <HmeHeader isAdmin={isAdmin}/>
                <AdminSubHeader isAdmin={isAdmin} pathName={pathName}/>
                <div className="hmeBody">
                    {children}
                </div>
                <Footer />
                <AutoSignOut />
            </div>
        );
    }
}