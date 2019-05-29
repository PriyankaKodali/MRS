import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker'; 
import { ToastContainer } from 'react-toastify';
import { Route} from 'react-router';
import { HashRouter } from 'react-router-dom';
import 'react-select/dist/react-select.css'; 
import 'bootstrap/dist/css/bootstrap.css';
import Login from './Login/Login';
import ChangePassword from './ChangePassword/ChangePassword';  
import JobAllocations from './Allocations/JobAllocations';
import ForgotPassword from './ForgotPassword/ForgotPassword';
import ResetPassword from './ResetPassword/ResetPassword'; 
import EmployeeJobAllocation from './Allocations/EmployeeJobAllocation';
import UploadFiles from './Client/UploadFiles'; 
import SplitJob from './Employee/SplitJob';
import Jobs from './Employee/Jobs';
import EmployeeDashboard from './Employee/EmployeeDashboard';
import ManagerDashboard from './Employee/ManagerDashboard';
import ClientDashboard from './Client/ClientDashboard';
import Upload from './Allocations/Upload';
// import QAJobs from './Employee/QAJobs';
// import AQAJobs from './Employee/AQAJobs';
// import MRAJobs from './Employee/MRAJobs';
 
import 'bootstrap-fileinput/js/plugins/piexif.min.js';
import 'bootstrap-fileinput/js/plugins/purify.min.js';
import 'bootstrap-fileinput/js/fileinput.js';
import 'bootstrap-fileinput/themes/fa/theme.js';

window.jQuery = window.$ = require("jquery");
var bootstrap = require('bootstrap');
window.isLoggedIn = sessionStorage.getItem("access_token") !== null;

ReactDOM.render((
    <HashRouter>
        <div>
            <ToastContainer autoClose={3000} position="top-center" />
            <App>
                <Route exact path="/" component={Login} />
                <Route exact path="/Login" component={Login} />
                {/* <Route path='/userLogin' component={() => window.location = 'http://localhost:4000/#/userLogin'}/> */}
                <Route exact path="/ForgotPassword" component={ForgotPassword} />
                <Route exact path="/ChangePassword"  render={(nextState)=>requireAuth(nextState, <ChangePassword location={nextState.location} history= {nextState.history} match={nextState.match} /> )}  />
                <Route exact path="/reset-password/:userId/:code" component={ResetPassword} />
                <Route exact path="/ClientDashboard" render={(nextState)=>requireAuth(nextState, <ClientDashboard location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/JobAllocations" render={(nextState)=> requireAuth(nextState, <JobAllocations location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/UploadFiles" render={(nextState)=> requireAuth(nextState, <UploadFiles location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/Upload" render={(nextState)=>requireAuth(nextState, <Upload location={nextState.location} history={nextState.history} match={nextState.match} />)}   />
                <Route exact path="/EmployeeJobAllocation" render={(nextState)=>requireAuth(nextState, <EmployeeJobAllocation location={nextState.location} history={nextState.history} match={nextState.match} />)}   />
                <Route exact path="/SplitJob" render={(nextState)=>requireAuth(nextState, <SplitJob location={nextState.location} history={nextState.history} match={nextState.match} />)}  />
                <Route exact path="/Jobs" render={(nextState)=>requireAuth(nextState, <Jobs location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/EmployeeDashboard"  render={(nextState) => requireAuth(nextState, <EmployeeDashboard location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path="/Dashboard"  render={(nextState)=> requireAuth(nextState, <ManagerDashboard location={nextState.location} history={nextState.history} match={nextState.match} />)} />
           </App>
        </div>
    </HashRouter>
),
    document.getElementById('root')
);

function requireAuth(nextState, component) {
    var isLoggedIn = sessionStorage.getItem("access_token") != null;
    if (!isLoggedIn) {
        nextState.history.push("/Login");
        return null;
    }
    else {
        return component;
    }
}
