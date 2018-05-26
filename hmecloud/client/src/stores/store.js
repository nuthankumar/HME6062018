// Initial state store
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { createLogger } from 'redux-logger'
import createHistory from 'history/createBrowserHistory'
import ReduxThunk from 'redux-thunk'
import store from '../reducers/store'
const history = createHistory()
let middlewareBean = [routerMiddleware(history), ReduxThunk]
if (process.env.NODE_ENV !== 'production') {
  let logger = createLogger()
  middlewareBean = [...middlewareBean, logger]
}
const middleware = applyMiddleware(...middlewareBean)

export default createStore(combineReducers({
  router: routerReducer,
  store
}), middleware)
