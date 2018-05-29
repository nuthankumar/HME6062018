import * as storeDetails from '../actionTypes/StoreDetails/storeDetails'
import Api from '../Api'
import { Config } from '../Config'
import { CommonConstants } from '../Constants'
// import AuthenticationService from '../components/Security/AuthenticationService'

function getNotesSuccess (stores) {
  return {
    type: storeDetails.INIT_STORESDETAILS,
    storeDetails: stores
  }
}
export const initStoresDetails = () => {
  this.api = new Api()
  let url = Config.apiBaseUrl + CommonConstants.apiUrls.getStores + '?isAdmin=0'
  return (dispatch, getState) => {
    const state = getState()
    if (state.storeDetails.sortParams) {
      url = url + '&Sortby=' + state.storeDetails.sortParams.sortBy + '&sortType=' + state.storeDetails.sortParams.sortType
    }
    this.api.getData(url, data => {
      dispatch(getNotesSuccess(data))
    })
  }
}

function getAdminStoresSuccess (stores) {
  return {
    type: storeDetails.ADMIN_STORESDETAILS,
    adminStoreDetails: stores
  }
}

export const adminStoresDetails = () => {
  this.api = new Api()
  let url = Config.apiBaseUrl + CommonConstants.apiUrls.getStores + '?isAdmin=1&psize=10&pno=1'
  return (dispatch, getState) => {
    const state = getState()
    if (state.storeDetails.sortParams) {
      url = url + '&Sortby=' + state.storeDetails.sortParams.sortBy + '&sortType=' + state.storeDetails.sortParams.sortType
    }
    console.log(url)
    this.api.getData(url, data => {
      dispatch(getAdminStoresSuccess(data))
    })
  }
}

export const sortStores = (sortParams) => {
  return {
    type: storeDetails.SET_SORT_PARAMS,
    sortParams: sortParams
  }
}

export const deviceDetails = () => {
  this.api = new Api()
  let url = 'https://hme-dev-public-cloud-func.azurewebsites.net/api/store/getStore?suid=7F671C950B924E4CA61A5E7975765BB0'
  this.api.getData(url, data => {
    return data
  })
}
