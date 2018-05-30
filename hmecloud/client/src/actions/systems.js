import * as systems from '../actionTypes/Systems/Systems'
import Api from '../Api'
import { Config } from '../Config'
import { CommonConstants } from '../Constants'
// import AuthenticationService from '../components/Security/AuthenticationService'

function getSystemsSuccess (stores) {
  return {
    type: systems.GET_SYSTEMS,
    systemDetails: stores
  }
}

export const getSystems = () => {
  this.api = new Api()
  let url = Config.apiBaseUrl + CommonConstants.apiUrls.getUnregisteredDevices + '?isAdmin=1&psize=10&pno=1'
  return (dispatch, getState) => {
    const state = getState()
    if (state.systems.paginationParams) {
      url = url + '&psize=' + state.systems.paginationParams.pageSize + '&pno=' + state.systems.paginationParams.pageNumber
    } else {
      url = url + '&psize=10&pno=1'
    }
    if (state.systems.searchParams) {
      url = url + '&criteria=' + (state.systems.searchParams.criteria ? state.systems.searchParams.criteria : '') + '&filter=' + (state.systems.searchParams.filter ? state.systems.searchParams.filter : '')
    }
    if (state.systems.sortParams) {
      url = url + '&Sortby=' + (state.systems.sortParams.sortBy ? state.systems.sortParams.sortBy : '') + '&sortType=' + (state.systems.sortParams.sortType ? state.systems.sortParams.sortType : '')
    }
    console.log(url)
    this.api.getData(url, data => {
      let systems = data
      dispatch(getSystemsSuccess(systems))
    })
  }
}

export const sortSystems = (sortParams) => {
  return {
    type: systems.SET_SORT_PARAMS_SYSTEMS,
    sortParams: sortParams
  }
}
export const paginationSystems = (paginationParams) => {
  return {
    type: systems.SET_PAGINATION_PARAMS,
    paginationParams: paginationParams
  }
}

export const setSearchParams = (searchParams) => {
  return {
    type: systems.SET_SEARCH_PARAMS_SYSTEMS,
    searchParams: searchParams
  }
}
