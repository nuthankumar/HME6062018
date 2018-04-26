
import { Config } from '../../Config';
import AuthenticationService from '../Security/AuthenticationService'

export default class SettingService {

    constructor() {
        this.authService = new AuthenticationService(Config.authBaseUrl)
    }

    canShowAdminHeader() {
        return this.authService.isAdmin() && this.authService.isLoggedIn()
    }

    canShowAdminSubHeader() {
        if (this.authService.getUUID())
            return this.authService.isAdmin() && this.authService.isLoggedIn()
        else
            return false;
    }

    canShowPortalHeader() {
        return !this.authService.isAdmin() && this.authService.isLoggedIn()
    }

}
