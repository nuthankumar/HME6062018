import React from 'react';
import { Link } from 'react-router-dom';
import t from '../Language/language';
import { Config } from '../../Config';
import * as languageSettings from '../Language/languageSettings';

export default class MasqueradeHeader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            language: languageSettings.getCurrentLanguage()
        }
    }
    render() {
        const { language } = this.state;
        const { isAdmin, viewAsUser } = this.props;
        return (
            <span className="view-as">Currently Viewing As {viewAsUser} </span>
        )
    }
}
