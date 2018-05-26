import { combineReducers } from 'redux'
import storeDetails from './storeDetails'
import viewDetails from './viewDetails'
import StorePopupDetails from './storePopupReducer'
export default combineReducers({
  storeDetails,
  viewDetails,
  StorePopupDetails
})
