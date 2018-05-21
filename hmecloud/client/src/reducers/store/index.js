import { combineReducers } from 'redux';
import storeDetails from './storeDetails';
import viewDetails from './viewDetails';



export default combineReducers({
    storeDetails,
    viewDetails
});