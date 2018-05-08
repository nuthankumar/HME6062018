import { combineReducers } from 'redux';
import BooksReducer from './reducers_books';
import ActiveBook from './reducer_active_book';
import storeDetails from './storeDetails';

const rootReducer=combineReducers({
    books:BooksReducer,//books is a key for global application state
    activeBook:ActiveBook,
    storeDetails:storeDetails
});

export default rootReducer;