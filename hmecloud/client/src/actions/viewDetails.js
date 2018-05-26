import * as storeDetails from '../actionTypes/StoreDetails/storeDetails'
import Api from '../Api'
import { Config } from '../Config'
import { CommonConstants } from '../Constants'

function getStoreSuccess (stores) {
  return {
    type: storeDetails.INIT_STORES_VIEW_DETAILS,
    storeViewDetails: stores
  }
}

export const initViewStore = (duid = '5D665CCD-83B6-4A48-9483-E4CB3450578E') => {
  this.api = new Api()
  let url = Config.apiBaseUrl + CommonConstants.apiUrls.getSettingsDevices + '?duid=' + duid
  return (dispatch) => {
    this.api.getData(url, data => {
      dispatch(getStoreSuccess(data))
    })
  }
}
