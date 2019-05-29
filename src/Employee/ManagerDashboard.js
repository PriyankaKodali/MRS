import React, { Component } from 'react';
import $ from 'jquery';

var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

class ManagerDashboard extends Component {
    
    render() {
        return (
            <div>
                <div className="col-xs-12">
                    <div className="col-xs-6">
                        <div className="empJobsHeader">
                            <div className="row">
                                <div className="col-xs-6 EmpHeader">
                                    <strong >  My Jobs  </strong>
                                </div>
                            </div>
                            <div className="clearfix"> </div>

                            <div className="btstrap">
                                <BootstrapTable striped hover remote={true} >
                                    <TableHeaderColumn dataField="Heading" width="10"> </TableHeaderColumn>
                                    <TableHeaderColumn dataField="Client" width="20" isKey={true} >Pending </TableHeaderColumn>
                                    <TableHeaderColumn dataField="DoctorName" width="20" > Completed </TableHeaderColumn>
                                    <TableHeaderColumn dataField="AQA" width="20"> Total </TableHeaderColumn>
                                    <TableHeaderColumn dataField="QA" width="15"> {'< '}  18</TableHeaderColumn>
                                    <TableHeaderColumn dataField="TAT" width="15"> > 18 </TableHeaderColumn>
                                </BootstrapTable>
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-6">
                        <div className="empJobsHeader">
                            <div className="row">
                                <div className="col-xs-6 EmpHeader">
                                    <strong > Team Jobs  </strong>
                                </div>
                            </div>
                            <div className="clearfix"> </div>

                            <div className="btstrap">
                                <BootstrapTable striped hover remote={true} >
                                    <TableHeaderColumn dataField="Heading" width="10"> </TableHeaderColumn>
                                    <TableHeaderColumn dataField="Pending" width="20" isKey={true} >Pending </TableHeaderColumn>
                                    <TableHeaderColumn dataField="DoctorName" width="20" > Completed </TableHeaderColumn>
                                    <TableHeaderColumn dataField="AQA" width="20"> Total </TableHeaderColumn>
                                    <TableHeaderColumn dataField="QA" width="15"> {'< '}  18</TableHeaderColumn>
                                    <TableHeaderColumn dataField="TAT" width="15"> > 18 </TableHeaderColumn>
                                </BootstrapTable>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="col-xs-12">

                    <div className="col-xs-6">
                        <div className="empJobsHeader">
                            <div className="row">
                                <div className="col-xs-6 EmpHeader">
                                    <strong >  Monthly Work Details  </strong>
                                </div>
                            </div>
                            <div className="clearfix"> </div>
                            <div className="btstrap">
                                <BootstrapTable striped hover remote={true} >
                                    <TableHeaderColumn dataField="Heading" width="10" > </TableHeaderColumn>
                                    <TableHeaderColumn dataField="Direct" width="20" isKey={true} > Direct </TableHeaderColumn>
                                    <TableHeaderColumn dataField="InDirect" width="20"> InDirect</TableHeaderColumn>
                                    <TableHeaderColumn dataField="Total" width="15"> Total</TableHeaderColumn>
                                </BootstrapTable>
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-6">
                        <div className="empJobsHeader">
                            <div className="row">
                                <div className="col-xs-6 EmpHeader">
                                    <strong >  Leaves  </strong>
                                </div>
                            </div>
                            <div className="clearfix"> </div>

                            <div className="btstrap">
                                <BootstrapTable striped hover remote={true} >
                                    <TableHeaderColumn dataField="Type" width="10" > Type </TableHeaderColumn>
                                    <TableHeaderColumn dataField="Remaining" width="20" isKey={true} >Remaining </TableHeaderColumn>
                                    <TableHeaderColumn dataField="Taken" width="20" > Taken </TableHeaderColumn>
                                    <TableHeaderColumn dataField="Total" width="20"> Total</TableHeaderColumn>
                                </BootstrapTable>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default ManagerDashboard
