import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import Reports from './components/Report/Reports'
import Authenticate from './components/Security/Authentication'
import ReportGroup from './components/Group/ReportGroup'
import ReportGroupHierarchy from './components/Group/ReportGroupHierarchy'
import SummaryReport from './components/Report/SummaryReport'
import RawCarDataReport from './components/Report/RawCarDataReport'
import LongestTime from './components/Report/LongestTime'
import User from './components/User/User'
import registerServiceWorker from './registerServiceWorker'
import EmailAlert from './components/Alerts/Email'
import Message from './components/Alerts/Message'
import SystemStatus from './components/Stores/SystemStatus'
import './i18n'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { browserHistory } from 'react-dom';

import { Provider } from 'react-redux';
import StoreDetails from './containers/StoreDetails'
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers/index';
import Layout from './components/Common/Layout'
import Login from './components/Security/Login'
import Logout from './components/Security/Logout'
import Systems from './components/Systems/Systems'

const createStoreWithMiddlewaare = applyMiddleware()(createStore);

ReactDOM.render( <Provider store={createStoreWithMiddlewaare(reducers)}>
<Router history={browserHistory}>
    <div>
        <Route exact path="/" render={(props) => <Layout Params={props}><Route path='/' component={(Login)} /></Layout>} />
        <Route exact path="/admin" render={(props) => <Layout Params={props}><Route path='/admin' component={(Login)} /></Layout>} />
        <Route exact path="/reports" render={(props) => <Layout Params={props}><Route path='/reports' component={Authenticate(Reports)} /></Layout>} />
        <Route exact path="/settings/stores/groups" render={(props) => <Layout Params={props}><Route path='/settings/stores/groups' component={Authenticate(ReportGroup)} /></Layout>} />
        <Route exact path="/groups" render={(props) => <Layout Params={props}><Route path='/groups' component={Authenticate(ReportGroup)} /></Layout>} />
        <Route exact path="/emailSent" render={(props) => <Layout Params={props}><Route path='/emailSent' component={Authenticate(EmailAlert)} /></Layout>} />
        <Route exact path="/message" render={(props) => <Layout Params={props}><Route path='/message' component={Authenticate(Message)} /></Layout>} />
        <Route exact path="/longestTime" render={(props) => <Layout Params={props}><Route path='/longestTime' component={Authenticate(LongestTime)} /></Layout>} />
        <Route exact path="/rawcardatareport" render={(props) => <Layout Params={props}><Route path='/rawcardatareport' component={Authenticate(RawCarDataReport)} /></Layout>} />
        <Route exact path="/settings/stores/grouphierarchy" render={(props) => <Layout Params={props}><Route path='/settings/stores/grouphierarchy' component={Authenticate(ReportGroupHierarchy)} /></Layout>} />        
        <Route exact path="/grouphierarchy" render={(props) => <Layout Params={props}><Route path='/grouphierarchy' component={Authenticate(ReportGroupHierarchy)} /></Layout>} />        
        <Route exact path="/summaryreport/:r?" render={(props) => <Layout Params={props}><Route path='/summaryreport/:r?' component={Authenticate(SummaryReport)} /></Layout>} />       
        <Route exact path="/settings/users/user/:uuid?" render={(props) => <Layout Params={props}><Route path='/settings/users/user/:uuid?' component={Authenticate(User)} /></Layout>} />
        <Route exact path="/user/:uuid?" render={(props) => <Layout Params={props}><Route path='/user/:uuid?' component={Authenticate(User)} /></Layout>} />
        <Route exact path="/logout" render={(props) => <Layout Params={props}><Route path='/logout' component={Authenticate(Logout)} /></Layout>} />
        <Route exact path="/settings/stores" render={(props) => <Layout Params={props}><Route path='/settings/stores' component={Authenticate(StoreDetails)} /></Layout>} />  
        <Route exact path="/systemStatus" render={(props) => <Layout Params={props}><Route path='/systemStatus' component={Authenticate(SystemStatus)} /></Layout>} />
        <Route exact path="/systems" render={(props) => <Layout Params={props}><Route path='/systems' component={Authenticate(Systems)} /></Layout>} />
   
    </div>
   
    </Router></Provider>, document.getElementById('root'))
registerServiceWorker()