import React from 'react';
import { Link } from 'react-router-dom';
import t from '../Language/language';
import { Config } from '../../Config';
import * as languageSettings from '../Language/languageSettings';
import AuthenticationService from '../Security/AuthenticationService'
import * as UserContext from '../Common/UserContext'


export default class MasqueradeHeader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            language: languageSettings.getCurrentLanguage(),
              token: UserContext.getToken(),
        }
        this.authService = new AuthenticationService(Config.authBaseUrl)
        this.state.masquerade = this.authService.getMasquerade()
        this.state.url = this.authService.getColdFusionAppUrl(UserContext.isAdmin())

    }
    render() {
        const { language, masquerade ,url} = this.state;
        const { isAdministrator, viewAsUser } = this.props;
        return (
            <span className="view-as"><button type="button"> <a href={Config.adminColdFusionUrl + "?pg=SettingsUsers&path=Main&token=" + masquerade} onClick={this.authService.logoutMasquerade.bind()}> X </a></button> Currently Viewing As {viewAsUser.User_EmailAddress} </span>
        )
    }
}
