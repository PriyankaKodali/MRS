import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Link } from 'react-router-dom';

class App extends Component {

    constructor(props) {
        super(props);
        var isLoggedIn = sessionStorage.getItem("access_token") != null;
        window.isLoggedIn = isLoggedIn;
    }

    logoutClick(e) {
        e.preventDefault();
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("roles");
        window.isLoggedIn = false;
        window.open("/", "_self")
    }

    addNewClick(e) {
        e.preventDefault();
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("roles");
        window.isLoggedIn = false;
        window.open("https://maxmaster.azurewebsites.net/#/", "_self")
    }

    render() {
        var roles = sessionStorage.getItem("roles");
        return (
            <div >
                {
                    window.isLoggedIn && roles.indexOf("Manager") != -1 || window.isLoggedIn && roles.indexOf("Coordinator") != -1 || window.isLoggedIn && roles.indexOf("SuperAdmin") != -1 ?
                        <div className="my-nav-bar" style={{ zIndex: '1000' }}>
                            <div className="container-fluid">
                                <div className="navbar-header header headerimage">
                                    <img className="headerimage" src="Images/logo.png" alt="" />
                                </div>
                                <div id="navbar2" className="navbar-collapse collapse">
                                    <ul className="nav navbar-nav navbar-right">
                                        <li className="dropdown">
                                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">{"Hi " + sessionStorage.getItem("displayName")}</a>
                                            <ul className="dropdown-menu">
                                                {/* <li> <Link to="/ChangePassword" > Change Password </Link> </li> */}
                                                <li><a onClick={this.logoutClick.bind(this)}>Logout</a></li>
                                            </ul>
                                        </li>
                                    </ul>


                                    <ul className="nav navbar-nav navbar-right">
                                        <li className="dropdown">
                                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Allocations</a>
                                            <ul className="dropdown-menu">
                                                {/* <li> <Link to="../DefaultAllocationsList"> Default Allocations </Link> </li> */}
                                                <li> <Link to="../JobAllocations"> Job Allocations  </Link> </li>
                                            </ul>
                                        </li>
                                    </ul>

                                    <ul className="nav navbar-nav navbar-right">
                                        <li className="dropdown">
                                            <Link className="dropdown-toggle" to="../Jobs"> Jobs </Link>
                                        </li>
                                    </ul>

                                    <ul className="nav navbar-nav navbar-right">
                                        <li className="dropdown">
                                            <Link className="dropdown-toggle" to="../Dashboard"> Dashboard  </Link>
                                        </li>
                                    </ul>

                                    <ul className="nav navbar-nav navbar-right">
                                        <li className="dropdown">
                                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false" onClick={this.addNewClick.bind(this)}> Add New</a>
                                        </li>
                                    </ul>

                                </div>
                            </div>
                        </div>
                        :
                        window.isLoggedIn && roles.indexOf("Transcriptionist") != -1 ?
                            <div className="my-nav-bar" style={{ zIndex: '1000' }}>
                                <div className="container-fluid">
                                    <div className="navbar-header header headerimage">
                                        <img className="headerimage" src="Images/logo.png" alt="" />
                                    </div>
                                    <div id="navbar2" className="navbar-collapse collapse">
                                        <ul className="nav navbar-nav navbar-right">
                                            <li className="dropdown">
                                                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">{"Hi " + sessionStorage.getItem("displayName")}</a>
                                                <ul className="dropdown-menu">
                                                    {/* <li> <Link to="/ChangePassword" > Change Password </Link> </li> */}
                                                    <li><a onClick={this.logoutClick.bind(this)}>Logout</a></li>
                                                </ul>
                                            </li>
                                        </ul>

                                        <ul className="nav navbar-nav navbar-right">
                                            <li className="dropdown">
                                                <Link to="/Jobs" > Jobs </Link>
                                            </li>
                                        </ul>

                                        <ul className="nav navbar-nav navbar-right">
                                            <li className="dropdown">
                                                <Link to="/EmployeeDashboard" > Dashboard</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            :
                            window.isLoggedIn && roles.indexOf("ClientEmployee") != -1 || window.isLoggedIn && roles.indexOf("Client") != -1 || window.isLoggedIn && roles.indexOf("Doctor") != -1 ?
                                <div className="my-nav-bar" style={{ zIndex: '1000' }}>
                                    <div className="container-fluid">
                                        <div className="navbar-header header headerimage">
                                            <img className="headerimage" src="Images/logo.png" alt="" />
                                        </div>
                                        <div id="navbar2" className="navbar-collapse collapse">
                                            <ul className="nav navbar-nav navbar-right">
                                                <li className="dropdown">
                                                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">{"Hi " + sessionStorage.getItem("displayName")}</a>
                                                    <ul className="dropdown-menu">
                                                        <li> <Link to="/ChangePassword"> Change Password </Link></li>
                                                        <li><a className="pointer" onClick={this.logoutClick.bind(this)} >Logout</a></li>
                                                    </ul>
                                                </li>
                                            </ul>

                                            <ul className="nav navbar-nav navbar-right">
                                                <li className="dropdown">
                                                    <Link to="/ClientDashboard" > Dashboard</Link>
                                                </li>
                                            </ul>

                                        </div>
                                    </div>
                                </div>
                                :
                                <div />
                }
                {this.props.children}
            </div>
        );
    }
}

export default App;


// window.isLoggedIn && roles.indexOf("Admin") != -1 ?
// <div className="my-nav-bar" style={{ zIndex: '1000' }}>
//     <div className="container-fluid">
//         <div className="navbar-header header headerimage">
//             <img className="headerimage" src="Images/logo.png" alt="" />
//         </div>
//         <div id="navbar2" className="navbar-collapse collapse">
//             <ul className="nav navbar-nav navbar-right">
//                 <li className="dropdown">
//                     <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">{"Hi " + sessionStorage.getItem("displayName")}</a>
//                     <ul className="dropdown-menu">
//                         <li> <Link to="/ChangePassword" > Change Password </Link> </li>
//                         <li><a onClick={this.logoutClick.bind(this)}>Logout</a></li>
//                     </ul>
//                 </li>
//             </ul>

//             <ul className="nav navbar-nav navbar-right">
//                 <li className="dropdown">
//                     <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Menu</a>
//                     <ul className="dropdown-menu">
//                         <li> <Link to="../JobAllocations"> Coordinator </Link> </li>
//                     </ul>
//                 </li>
//             </ul>
//         </div>
//     </div>
// </div>

