import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Stores.css'

class RemoteSystemActions extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="RemoteSystemActions">
                <div><h3 class="versions">Remote System Actions</h3>
                    <a id="upgrade-btn"><div class="ActionButtons"> Upgrade System</div></a>
                </div>
                <div id="reboot-content">
                    <a id="reboot-btn"><div class="ActionButtons">Reboot System</div></a>
                </div>
                <div id="reconnect-content">
                    <a id="reconnect-btn"><div class="ActionButtons">Force Reconnect</div></a>
                </div>
                <div id="master-settings">
                    <a id="settings2-btn"><div class="ActionButtons">Master Settings</div></a>
                </div>
            </div>
        )
    }
}


export default RemoteSystemActions