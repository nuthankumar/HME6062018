import {getDetails} from './stores'
import {getStoreDetails} from './stores1'

const actionCreator={
    getDetails:getDetails,//books is a key for global application state
    getStoreDetails:getStoreDetails
 }

export default actionCreator;
