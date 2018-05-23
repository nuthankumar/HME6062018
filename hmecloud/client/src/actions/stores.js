import * as storeDetails from "../actionTypes/StoreDetails/storeDetails";
import Api from '../Api'
import { Config } from '../Config'
import { CommonConstants } from '../Constants'
import AuthenticationService from '../components/Security/AuthenticationService'


function getNotesSuccess(stores){
    return {
        type: storeDetails.INIT_STORESDETAILS,
        storeDetails: stores
    }
}
// export function initStoresDetails () {
//     this.authService = new AuthenticationService(Config.authBaseUrl)
//     let url = Config.apiBaseUrl + CommonConstants.apiUrls.getStores + '?isAdmin=0'
//     return (dispatch) => {
//         fetch(url, {
//             headers: {
//               'Content-Type': 'application/json',
//               // 'x-access-token': token
//               //'Authorization': 'Bearer ' + this.authService.getToken()
//               'Authorization': 'Bearer ' + this.authService.getToken()
//             }
//           })
//         .then((response) => {
//         if (!response.ok) {
//             throw Error(response.statusText);
//         }
//             return response;
//         })
//         .then(response =>
//             response.json().then(notes => ({ notes, response }))
//         ).then(({ notes, response }) => {
//         if (!response.ok) {
//         // If there was a problem, we want to
//         // dispatch the error condition
//         return Promise.reject(notes)
//         } else {
//                 dispatch(getNotesSuccess(notes));
//             }
//             })
//         };
// } 


export const initStoresDetails = () => {
    this.api = new Api()
    let stores = {}
    let url = Config.apiBaseUrl + CommonConstants.apiUrls.getStores + '?isAdmin=0'
    return (dispatch) => {
        this.api.getData(url, data => {
            dispatch(getNotesSuccess(data));
        })
    }
}

function adminStoresSuccess(stores){
    return {
        type: storeDetails.ADMIN_STORESDETAILS,
        adminStoreDetails: stores
    }
}


export const adminStoresDetails = () => {
    this.api = new Api()
    let stores = {}
    let url = Config.apiBaseUrl + CommonConstants.apiUrls.getStores + '?isAdmin=1'
    return (dispatch) => {
        this.api.getData(url, data => {
            dispatch(adminStoresSuccess(data));
        })
    }
}



// export const adminStoresDetails = () => {
//     this.api = new Api()
//     let stores = {}
//     let url = Config.apiBaseUrl + CommonConstants.apiUrls.getStores + '?isAdmin=1'
//     this.api.getData(url, data => {
//         stores = data.data
//     })
//     return {
//         type: storeDetails.ADMIN_STORESDETAILS,
//         adminStoreDetails: stores
//     }
// }


export const sortStores = (sortParams) => {
    return {
        type: storeDetails.SET_SORT_PARAMS,
        sortParams: sortParams
    }
}




