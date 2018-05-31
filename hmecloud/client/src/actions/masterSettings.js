import * as masterSettings from '../actionTypes/MasterSettings/masterSettings'
import Api from '../Api'
import { Config } from '../Config'
import { CommonConstants } from '../Constants'
// import AuthenticationService from '../components/Security/AuthenticationService'

function getSystemsSuccess (devices) {
  return {
    type: masterSettings.GET_SETTINGS,
    masterSettings: devices
  }
}

export const getMasterSettings = (params) => {
  this.api = new Api()
  let url = Config.apiBaseUrl + CommonConstants.apiUrls.getMasterSettings
  return (dispatch, getState) => {
    const state = getState()
    console.log(state)
    // if (state) {
    //   url = url + '&psize=' + state.systems.paginationParams.pageSize + '&pno=' + state.systems.paginationParams.pageNumber
    // } else {
    //   url = url + '&psize=10&pno=1'
    // }
    // if (state.systems.searchParams) {
    //   url = url + '&criteria=' + (state.systems.searchParams.criteria ? state.systems.searchParams.criteria : '') + '&filter=' + (state.systems.searchParams.filter ? state.systems.searchParams.filter : '')
    // }
    // if (state.systems.sortParams) {
    //   url = url + '&Sortby=' + (state.systems.sortParams.sortBy ? state.systems.sortParams.sortBy : '') + '&sortType=' + (state.systems.sortParams.sortType ? state.systems.sortParams.sortType : '')
    // }
    // console.log(url)
    // this.api.getData(url, data => {
    //   let systems = data
    //   dispatch(getSystemsSuccess(systems))
    // })
  }
}
