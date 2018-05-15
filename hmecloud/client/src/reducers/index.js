import { combineReducers } from 'redux';
import storeDetails from './storeDetails';
const rootReducer=combineReducers({
    storeDetails:storeDetails
});
export default rootReducer;