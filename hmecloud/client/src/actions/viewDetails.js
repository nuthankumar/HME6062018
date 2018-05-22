import * as storeDetails from "../actionTypes/StoreDetails/storeDetails";
import Api from '../Api'
import { Config } from '../Config'
import { CommonConstants } from '../Constants'

function getStoreSuccess(stores){
    return {
        type: storeDetails.INIT_STORES_VIEW_DETAILS,
        storeViewDetails: stores
    }
} 

export const initViewStore = (duid='AD3525BB-2647-479C-8F37-34157ED67854') => {
    debugger
    this.api = new Api()
    let stores = {}
    let url = Config.apiBaseUrl + CommonConstants.apiUrls.getSettingsDevices + '?duid=' + duid
    return (dispatch) => {
        this.api.getData(url, data => {
            dispatch(getStoreSuccess(data));
        })
    }
}