import React from 'react';


const ProductLogo = require('../../images/ProductLogo-1.png');
const HMELogo = require('../../images/HMELogo.png');
const Calendar = require('../../images/mini-cal.jpg');

export default class HmeHeader extends React.Component {
    constructor() {
        super()
    }
    render() {
        return (<div >
            <header className="reportsPageHeader">
                <div>  <img className="logOutIcon" src={ProductLogo} aria-hidden="true" /></div>
                <div className="userInfoSection">
                    <span> Logged in as Abhradip Rudra </span>
                    <button className="logout"> Logout </button>
                    <img className="logOutIcon" src={HMELogo} aria-hidden="true" />
                </div>
            </header>
            <nav className="reportsNavigationHeader">
                <div className="navItems">
                    <div className="menuItems"><a href="/">Welcome</a></div>
                    <div className="menuItems"><a href="/?pg=Dashboards" >ZOOM Dashboard</a></div>
                    <div className="menuItems" id="zoomLabel"><a href="/?pg=Reports">Reports</a></div>
                    <div className="menuItems"><a href="./?pg=SettingsAccount">My Account</a></div>
                    <div className="menuItems"><a href="./?pg=SettingsStores">Settings</a></div>
                </div>
                <div className="cogWheel">
                    cog
               </div>
            </nav>
        </div>);
    }
}
