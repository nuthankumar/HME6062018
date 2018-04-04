import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import Reports from './components/Report/Reports'
import ReportGroup from './components/Group/ReportGroup'
import ReportGroupHierarchy from './components/Group/ReportGroupHierarchy'
import SummaryReport from './components/Report/SummaryReport'
import RawCarDataReport from './components/Report/RawCarDataReport'
import SystemStatistics from './components/Report/SystemStatistics'
import registerServiceWorker from './registerServiceWorker'
import { BrowserRouter as Router, Route } from 'react-router-dom'
// import { Router, Route } from 'react-router-dom'
// import history from '../history';

import Login from './components/Security/Login'

ReactDOM.render(<Router>
  <div>
    <Route path='/' exact component={App} />
    <Route exact path='/login' component={Login} />
    <Route exact path='/reports' component={Reports} />
    <Route exact path='/groups' component={ReportGroup} />
    <Route exact path='/grouphierarchy' component={ReportGroupHierarchy} />
    <Route exact path='/summaryreport' component={SummaryReport} />
    <Route exact path='/rawcardatareport' component={RawCarDataReport} />
    <Route exact path='/systemStats' component={SystemStatistics} />
  </div>
</Router>, document.getElementById('root'))
registerServiceWorker()
