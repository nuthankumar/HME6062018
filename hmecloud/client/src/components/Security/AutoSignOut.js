import React, { Component } from 'react'
import { ToastContainer, toast } from 'react-toastify';

import './Login.css'
import { Config } from '../../Config'

class AutoSignOut extends Component {
    constructor() {
        super()
    }
    componentWillMount() {
    }
    notify = (Msg,e) => this.toastId = toast( Msg
    , { type: toast.TYPE.INFO, autoClose: false });


    componentDidMount() {
        
    }
    render() {
        const { isAdministrator } = this.props
        const Msg = ({ closeToast }) => (
            <div>
                You are currently viewing the site as another User <span> logout </span>
                <button onClick={closeToast}>Logout</button>
                <button onClick={closeToast}>Continue</button>
            </div>
        )
        this.notify.bind(this, Msg);
        return (
            <div className={isAdministrator ? 'show' : 'hidden'}>
                <ToastContainer autoClose={false} />
            </div>
        )
    }
}

export default AutoSignOut
