import React from 'react'

const ProductLogo = require('../../images/ProductLogo-1.png')
const HMELogo = require('../../images/HMELogo.png')

export default class HmeHeader extends React.Component {
  render () {
    return (<div >
      <header className='reports-page-header'>
        <div>  <img className='logOutIcon' src={ProductLogo} aria-hidden='true' /></div>
        <div className='user-info-section'>
          <span> Logged in as Abhradip Rudra </span>
          <button className='logout'> Logout </button>
          <img className='logOutIcon' src={HMELogo} aria-hidden='true' />
        </div>
      </header>
      <nav className='reports-navigation-header'>
        <div className='nav-items'>
          <div className='menu-items'><a href='/'>Welcome</a></div>
          <div className='menu-items'><a href='/?pg=Dashboards' >ZOOM Dashboard</a></div>
          <div className='menu-items' id='zoomLabel'><a href='/?pg=Reports'>Reports</a></div>
          <div className='menu-items'><a href='./?pg=SettingsAccount'>My Account</a></div>
          <div className='menu-items'><a href='./?pg=SettingsStores'>Settings</a></div>
        </div>
        <div className='cogWheel' />
      </nav>
    </div>)
  }
}
