import * as StoreDetailsPopup from '../actionTypes/StoreDetailsPopup/storeDetailsPopup'
import Api from '../Api'
import { Config } from '../Config'
import { CommonConstants } from '../Constants'
export const closePopup = () => {
  return {
    type: 'CLOSE_POPUP',
    payload: null
  }
}
export const openPopup = (isAdmin) => {
  return {
    type: 'OPEN_POPUP',
    payload: isAdmin
  }
}
export const mergeClosePopup = () => {
  return {
    type: 'MERGE_CLOSE_POPUP',
    payload: null
  }
}

export const mergeOpenPopup = () => {
  return {
    type: 'MERGE_OPEN_POPUP',
    payload: null
  }
}

export const initModal = (data) => {
  return {
    type: StoreDetailsPopup.INIT_STORE_POPUP,
    payload: data
  }
}

export const initStoreDetail = (suid, isAdmin) => {
  this.api = new Api()
  let url = 'https://hme-dev-public-cloud-func.azurewebsites.net/api/store/getStore?suid=' + suid
  return (dispatch) => {
    this.api.getData(url, data => {
      dispatch(initModal(data))
      dispatch(openPopup(isAdmin))
    })
  }
}
