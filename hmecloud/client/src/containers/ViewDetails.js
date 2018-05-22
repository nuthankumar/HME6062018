import React, { Component } from 'react'

import t from '../components/Language/language'
import * as languageSettings from '../components/Language/languageSettings'
import SystemSettings from '../components/Stores/SystemSettings'
import SystemStatus from '../components/Stores/SystemStatus'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { initViewStoresDetails} from "../actions/viewDetails";

class ViewDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentLanguage: languageSettings.getCurrentLanguage(),
        }
        // console.log(this.props.viewDetails);
    }
    componentWillMount() {  
           
            this.props.dispatch(initViewStoresDetails());       
      
    }
    render() {
        const language = this.state.currentLanguage
        let displayData = this.props.systemStats
        console.log(this.props.storeViewDetails)
        return (
            <div>
                <SystemSettings data={this.props.storeViewDetails}/>
                <SystemStatus />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        storeViewDetails: state.viewDetails
    }
}


export default connect(mapStateToProps)(ViewDetails)

