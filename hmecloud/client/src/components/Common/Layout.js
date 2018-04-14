// react modules
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import HmeHeader from '../Header/HmeHeader';
import AdminSubHeader from '../Header/adminSubHeader';
import Footer from '../Footer/Footer';

export default class Layout extends React.Component {
    render() {
        const { Params, children } = this.props;
        let pathName = Params.location.pathname;
        console.log(Params.location.pathname);
        let isAdmin = false;
        let isLogin = false;
        if (Params.location.pathname == '/login') {
            isLogin = true;
        }
        return (
            <div>
                <HmeHeader isAdmin={isAdmin} isLogin={isLogin}/>
                <AdminSubHeader isAdmin={isAdmin} isLogin={isLogin} pathName={pathName}/>
                <div className="hmeBody">
                    {children}
                </div>
                <Footer />
            </div>
        );
    }
}