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
        let isAdmin = false;
        return (
            <div>
                <HmeHeader isAdmin={isAdmin}/>
                <AdminSubHeader isAdmin={isAdmin} pathName={pathName}/>
                <div className="hmeBody">
                    {children}
                </div>
                <Footer />
            </div>
        );
    }
}