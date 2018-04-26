
import { Config } from '../../Config';
import AuthenticationService from '../Security/AuthenticationService'

export default class NavigationService {

    constructor() {
        this.authService = new AuthenticationService(Config.authBaseUrl)
        this.url = this.authService.getColdFusionAppUrl(this.authService.isAdmin())
        this.contextToken = this.authService.getToken();
        this.uuid = this.authService.getUUID();
    }

    getStoresUrl() {
        return this.url + "?pg=SettingsStores&path=Users&token=" + this.contextToken
    }
    getUserStoresUrl() {
        return this.url + "?pg=SettingsStores&uuid=" + this.uuid + "&path=Users&token=" + this.contextToken
    }
    getSelectedUserUrl() {
        return this.url + "?pg=SettingsUsers&uuid=" + this.uuid + "&path=Users&token=" + this.contextToken
    }
    getUserDashboardUrl() {
        return this.url + "?pg=Dashboard&uuid=" + this.uuid + "&path=Users&token=" + this.contextToken
    }
    getUserRoleUrl() {
        return this.url + "?pg=SettingsRoles&uuid=" + this.uuid + "&path=Users&token=" + this.contextToken
    }
    getDeviceSettingsHistoryUrl() {
        return this.url + "?pg=SettingsZoomHistory&uuid=" + this.uuid + "&path=Users&token=" + this.contextToken
    }
    toAdminUsers() {

    }

}