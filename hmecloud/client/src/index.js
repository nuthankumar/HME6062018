import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import Reports from './components/Report/Reports'
import ReportGroup from './components/Group/ReportGroup'
import ReportGroupHierarchy from './components/Group/ReportGroupHierarchy'
import SummaryReport from './components/Report/SummaryReport'
import RawCarDataReport from './components/Report/RawCarDataReport'
import LongestTime from './components/Report/LongestTime'
import registerServiceWorker from './registerServiceWorker'
import EmailAlert from './components/Alerts/Email'
import './i18n'
import { BrowserRouter as Router, Route } from 'react-router-dom'
// import { Router, Route } from 'react-router-dom'
// import history from '../history';
import Layout from './components/Common/Layout';
import Login from './components/Security/Login'

ReactDOM.render(<Router>
    <div>
        <Route exact path="/login" render={(props) => <Layout Params={props}><Route path='/login' component={(Login)} /></Layout>} />
        <Route exact path="/reports" render={(props) => <Layout Params={props}><Route path='/reports' component={(Reports)} /></Layout>} />
        <Route exact path="/groups" render={(props) => <Layout Params={props}><Route path='/groups' component={(ReportGroup)} /></Layout>} />
        <Route exact path="/emailSent" render={(props) => <Layout Params={props}><Route path='/emailSent' component={(EmailAlert)} /></Layout>} />
        <Route exact path="/longestTime" render={(props) => <Layout Params={props}><Route path='/longestTime' component={(LongestTime)} /></Layout>} />
        <Route exact path="/rawcardatareport" render={(props) => <Layout Params={props}><Route path='/rawcardatareport' component={(RawCarDataReport)} /></Layout>} />
        <Route exact path="/grouphierarchy" render={(props) => <Layout Params={props}><Route path='/grouphierarchy' component={(ReportGroupHierarchy)} /></Layout>} />        <Route exact path="/longestTime" render={(props) => <Layout Params={props}><Route path='/grouphierarchy' component={(ReportGroupHierarchy)} /></Layout>} />
        <Route exact path="/summaryreport" render={(props) => <Layout Params={props}><Route path='/summaryreport' component={(SummaryReport)} /></Layout>} />        <Route exact path="/longestTime" render={(props) => <Layout Params={props}><Route path='/summaryreport' component={(SummaryReport)} /></Layout>} />
    </div>
</Router>, document.getElementById('root'))
registerServiceWorker()
