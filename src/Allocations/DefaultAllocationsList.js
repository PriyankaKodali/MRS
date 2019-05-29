import React, { Component } from 'react';
import $ from 'jquery';
import Select from 'react-select';
import { ApiUrl, MRSUrl } from '../Config';

var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

class DefaultAllocationsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1, sizePerPage: 10, dataTotalSize: 0,
            IsDataAvailable: false, sortCol: 'Client', sortDir: 'asc', DefaultAllocationsList: [],
            Client: '', Doctor: '', Employee: '', JobLevel: ""
        }
    }

    componentWillMount() {
        $.ajax({
            url: ApiUrl + "/api/MasterData/GetAllClients",
            type: "get",
            success: (data) => { this.setState({ Clients: data["clients"] }) }
        }),
            $.ajax({
                url: ApiUrl + "/api/MasterData/GetDoctors",
                type: "get",
                success: (data) => { this.setState({ Doctors: data["doctors"] }) }
            })
        $.ajax({
            url: ApiUrl + "/api/MasterData/GetEmployees",
            type: "get",
            success: (data) => { this.setState({ Employees: data["employees"] }) }
        })

        this.getDefaultAllocationList(this.state.currentPage, this.state.sizePerPage);
    }

    getDefaultAllocationList(page, count) {

        var url = ApiUrl + "/api/Allocations/GetDefaultAllocation?ClientId=" + this.state.Client +
            "&DoctorId=" + this.state.Doctor + "&EmployeeId=" + this.state.Employee +
            "&JobLevel=" + this.state.JobLevel + "&page=" + page + "&count=" + count +
            "&SortCol=" + this.state.sortCol + "&SortDir=" + this.state.sortDir;

        $.ajax({
            url: url,
            type: "get",
            success: (data) => {
                this.setState({
                    DefaultAllocationsList: data["defaultAllocations"], IsDataAvailable: true,
                    dataTotalSize: data["totalCount"]
                })
            }
        })

    }

    render() {
        return (
            <div className="container">
                <div className="headercon" >
                    <div className="headercon">
                        <div className="row">
                            <div className="col-md-12">
                                <h3 className="col-md-10 formheader" style={{ paddingLeft: '10px' }}> Default Allocations </h3>
                                <div className="col-md-2 mybutton">
                                    <button type="button" className="btn btn-default pull-right headerbtn" onClick={() => this.setState({ searchClick: !this.state.searchClick })} >
                                        <span className="glyphicon glyphicon-chevron-down"></span>
                                    </button>
                                    <button type="button" className="btn btn-default pull-right headerbtn" onClick={() => this.props.history.push("/DefaultAllocations")} >
                                        <span className="glyphicon glyphicon-plus"></span>
                                    </button>

                                </div>
                            </div>
                        </div>

                        {
                            this.state.searchClick ?

                                <form className="formSearch" id="searchform">
                                    <div className="col-md-2 form-group">
                                        <Select className="col-md-2 form-control" type="text" name="Client" placeholder="Select Client" value={this.state.Client} options={this.state.Clients} onChange={this.ClientChanged.bind(this)} />
                                    </div>

                                    <div className="col-md-2 form-group">
                                        <Select className="col-md-2 form-control" type="text" name="Doctor" placeholder="Select Doctor" value={this.state.Doctor} options={this.state.Doctors} onChange={this.DoctorChanged.bind(this)} />
                                    </div>

                                    <div className="col-md-2 form-group">
                                        <Select className="form-control" name="jobLevel" ref="jobLevel" placeholder="Select JobLevel" value={this.state.JobLevel}
                                            options={[{ value: 'MRA', label: 'MRA' }, { value: 'AQA', label: 'AQA' }, { value: 'QA', label: 'QA' }]}
                                            onChange={this.JobLevelChanged.bind(this)} />
                                    </div>

                                    <div className="col-md-2 form-group">
                                        <Select className="col-md-2 form-control" type="text" name="Employee" placeholder="Select Employee" value={this.state.Employee} options={this.state.Employees} onChange={this.EmployeeChanged.bind(this)} />
                                    </div>

                                    {/* <div className="col-md-2 form-group">
                                        <input className="col-md-1 form-control" type="text" name="Status" placeholder="Status" autoComplete="off" ref="status" onChange={this.SearchClick.bind(this)} />
                                    </div> */}

                                    <div className="col-md-1 button-block text-center">
                                        <input type="button" className="mleft10 btn btn-default" value="Clear" onClick={this.clearClick.bind(this)} />
                                    </div>
                                </form>
                                : <div />
                        }
                    </div>
                </div>
                {/* {
                    !this.state.IsDataAvailable ? < div className="loader visible" ></div >
                        : */}
                <div style={{ marginTop: '1%' }}>
                    <BootstrapTable striped hover remote={true} pagination={true}
                        data={this.state.DefaultAllocationsList}
                        fetchInfo={{ dataTotalSize: this.state.dataTotalSize }}
                        options={{
                            sizePerPage: this.state.sizePerPage,
                            onPageChange: this.onPageChange.bind(this),
                            sizePerPageList: [{ text: '10', value: 10 },
                            { text: '25', value: 25 },
                            { text: 'ALL', value: this.state.dataTotalSize }],
                            page: this.state.currentPage,
                            onSizePerPageList: this.onSizePerPageList.bind(this),
                            paginationPosition: 'bottom',
                            onSortChange: this.onSortChange.bind(this)
                        }}
                    >
                        <TableHeaderColumn dataField="ShortName" isKey={true} dataAlign="left" dataSort={true} width="20" > Client</TableHeaderColumn>
                        <TableHeaderColumn dataField="Doctor" dataAlign="left" dataSort={true} width="30" > Doctor </TableHeaderColumn>
                        <TableHeaderColumn dataField="Employee" dataAlign="left" dataSort={true} width="30" >Employee </TableHeaderColumn>
                        <TableHeaderColumn dataField="JobLevel" dataAlign="left" dataSort={true} width="30" > Job Level</TableHeaderColumn>
                        <TableHeaderColumn dataField="Inactive" dataAlign="center" dataSort={true} width="15" dataFormat={this.statusFormatter.bind(this)} >Status</TableHeaderColumn>
                        <TableHeaderColumn columnClassName="edit" dataField="Edit" dataAlign="center" width="10" dataFormat={this.editDataFormatter.bind(this)} ></TableHeaderColumn>
                    </BootstrapTable>
                </div>
                {/* } */}

            </div>
        )
    }

    editDataFormatter(cell, row) {
        return (
            <a>
                <i className='glyphicon glyphicon-edit' style={{ fontSize: '18px', cursor: 'pointer' }} onClick={() => this.props.history.push("/DefaultAllocations/" + row["Id"])}  ></i>
            </a>
        )
    }

    statusFormatter(cell, row) {
        if (row["Inactive"] == 0) {
            return (<p> Active</p>);
        }
        else {
            return (<p> InActive </p>);
        }
    }

    ClientChanged(val) {
        if (val != null) {
            this.setState({ Client: val.value }, () => {
                this.getDefaultAllocationList(this.state.currentPage, this.state.sizePerPage)
            })
        }
        else {
            this.setState({ Client: '' }, () => {
                this.getDefaultAllocationList(this.state.currentPage, this.state.sizePerPage)
            })
        }

    }

    DoctorChanged(val) {
        if (val != null) {
            this.setState({ Doctor: val.value }, () => {
                this.getDefaultAllocationList(this.state.currentPage, this.state.sizePerPage)
            })
        }
        else {
            this.setState({ Doctor: '' }, () => {
                this.getDefaultAllocationList(this.state.currentPage, this.state.sizePerPage)
            })
        }

    }

    EmployeeChanged(val) {
        if (val != null) {
            this.setState({ Employee: val.value }, () => {
                this.getDefaultAllocationList(this.state.currentPage, this.state.sizePerPage)
            })
        }
        else {
            this.setState({ Employee: '' }, () => {
                this.getDefaultAllocationList(this.state.currentPage, this.state.sizePerPage)
            })
        }
    }

    JobLevelChanged(val) {
        if (val != null) {
            this.setState({ JobLevel: val.value }, () => {
                this.getDefaultAllocationList(this.state.currentPage, this.state.sizePerPage)
            })
        }
        else {
            this.setState({ JobLevel: '' }, () => {
                this.getDefaultAllocationList(this.state.currentPage, this.state.sizePerPage)
            })
        }
    }

    SearchClick() {
        
    }

    clearClick() {
        this.setState({ Client: '', Doctor: '', Employee: '', JobLevel: '' }, () => {
            this.getDefaultAllocationList(this.state.currentPage, this.state.sizePerPage)
        })

    }


    onSortChange(sortCol, sortDir) {
        sortDir = this.state.sortCol === sortCol && this.state.sortDir === "asc" ? "desc" : "asc";
        this.setState({
            sortCol: sortCol,
            sortDir: sortDir
        }, () => {
            this.getDefaultAllocationList(this.state.currentPage, this.state.sizePerPage)
        });
    }

    onPageChange(page, sizePerPage) {
        this.getDefaultAllocationList(page, sizePerPage)
    }

    onSizePerPageList(sizePerPage) {
        this.getDefaultAllocationList(this.state.currentPage, sizePerPage)
    }
}

export default DefaultAllocationsList