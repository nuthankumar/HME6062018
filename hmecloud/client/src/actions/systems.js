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
  let url = Config.apiBaseUrl + CommonConstants.apiUrls.getStores + '?isAdmin=1&psize=10&pno=1'
  return (dispatch, getState) => {
    const state = getState()
    console.log(state)
    this.api.getData(url, data => {
      let systems = {
        'systems': [
          {
            'System': 'Zoom',
            'Store': null,
            'Serial': '0111555',
            'Settings_Version': 'A.2.00',
            'Lane_Config': 'DualLane',
            'Brand': null,
            'Device_UID': 'B4422D64-1A01-492A-9A5B-1AF2FEF75723',
            'System_Status': null,
            'Version': '2.3.7.99'
          },
          {
            'System': 'Zoom',
            'Store': null,
            'Serial': '0111555',
            'Settings_Version': 'A.2.00',
            'Lane_Config': 'DualLane',
            'Brand': null,
            'Device_UID': 'B4422D64-1A01-492A-9A5B-1AF2FEF75726',
            'System_Status': 1,
            'Version': '2.31.7.999'
          }
        ],
        'totalRecordCount': {
          'NoOfPage': 1,
          'TotalRecord': 2
        },
        'status': true
      }

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
