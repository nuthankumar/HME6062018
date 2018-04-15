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
    notify = () => this.toastId = toast(`You are currently viewing the site as another User`
    , { type: toast.TYPE.INFO, autoClose: 5000 });

    render() {
        return (
            <div>
                <a onClick={this.notify}>Timer</a>
                <ToastContainer />
            </div>
        )
    }
}

export default AutoSignOut
