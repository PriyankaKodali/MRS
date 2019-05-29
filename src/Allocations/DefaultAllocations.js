import React, { Component } from 'react';
import $ from 'jquery';
import { ValidateForm, showErrorsForInput, setUnTouched, showErrors } from '../Validation';
import { ApiUrl, MRSUrl } from '../Config';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { MyAjaxForAttachments, MyAjax } from '../MyAjax';

var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

class DefaultAllocations extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Client: null, Clients: [], Doctor: null, Doctors: [], JobLevel: null, JobLevels: [],
            Employee: null, Employees: [], Accuracy: '', Pages: '', DefaultAlloc: [], IsInActive: false
        }
    }

    componentDidMount() {
        setUnTouched(document);
    }

    componentWillMount() {

        this.setState({ DoctorId: this.props.match.params["id"] }, () => {
            if (this.props.match.params["id"] != null) {
                $.ajax({
                    url: ApiUrl + "/api/Allocations/GetDefaultEmp?defaultAllocId=" + this.props.match.params["id"],
                    type: "get",
                    success: (data) => {
                        this.setState({
                            DefaultAlloc: data["defaultAlloc"],
                            Client: { value: data["defaultAlloc"]["Client_Id"], label: data["defaultAlloc"]["Client"] },
                            Doctor: { value: data["defaultAlloc"]["Doctor_Id"], label: data["defaultAlloc"]["Doctor"] },
                            Employee: { value: data["defaultAlloc"]["Employee_Id"], label: data["defaultAlloc"]["Employee"] },
                            JobLevel: { value: data["defaultAlloc"]["JobLevel"], label: data["defaultAlloc"]["JobLevel"] }
                        })
                    }
                })
            }
        })

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
    }

    render() {
        return (
            <div className="headerCon" key={this.state.DefaultAlloc}>
                <div className="clientEmpContainer">
                    <div className="col-xs-12 headerstyle" >
                        <h3 className="col-xs-11 formheader" style={{ paddingLeft: '10px' }}> Default Allocation </h3>
                        <div className="col-md-1 mybutton">
                            <button type="button" className="btn btn-default pull-left headerbtn" onClick={() => this.props.history.push("/DefaultAllocationsList")} >
                                <span className="glyphicon glyphicon-th-list"></span>
                            </button>
                        </div>
                    </div>

                    <form onSubmit={this.handleSubmit.bind(this)} onChange={this.validate.bind(this)} >
                        <div className="col-xs-12">
                            <div className="col-md-4">
                                <label> Client </label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon" >
                                            <span className="glyphicon glyphicon-user"></span>
                                        </span>
                                        <Select className="form-control" name="clientname" ref="client" placeholder="Select Client" value={this.state.Client} options={this.state.Clients} onChange={this.ClientChanged.bind(this)} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <label> Doctor </label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon" >
                                            <span className="glyphicon glyphicon-user"></span>
                                        </span>
                                        <Select className="form-control" name="doctor" ref="doctor" placeholder="Select Doctor" value={this.state.Doctor} options={this.state.Doctors} onChange={this.DoctorChanged.bind(this)} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <label> Job Level</label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon" >
                                            <span className="glyphicon glyphicon-user"></span>
                                        </span>
                                        <Select className="form-control" name="jobLevel" ref="jobLevel" placeholder="Select JobLevel" value={this.state.JobLevel}
                                            options={[{ value: 'MRA', label: 'MRA' }, { value: 'AQA', label: 'AQA' }, { value: 'QA', label: 'QA' }]}
                                            onChange={this.JobLevelChanged.bind(this)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xs-12">

                            <div className="col-md-4">
                                <label> Employee </label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon" >
                                            <span className="glyphicon glyphicon-user"></span>
                                        </span>
                                        <Select className="form-control" name="employee" ref="employee" placeholder="Select Employee" value={this.state.Employee}
                                            options={this.state.Employees}
                                            onChange={this.EmployeeChanged.bind(this)} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-xs-3">
                                <label> Accuracy </label>
                                <div className="form-group">
                                    <input className="form-control" name="accuracy" type="number" ref="accuracy" defaultValue={this.state.DefaultAlloc["Accuracy"]} />
                                </div>
                            </div>

                            <div className="col-xs-3">
                                <label> No. Of Pages </label>
                                <div className="form-group">
                                    <input className="form-control" name="noofpages" type="text" ref="noofpages" defaultValue={this.state.DefaultAlloc["NoOfPages"]} />
                                </div>
                            </div>

                            {this.props.match.params["id"] != null ?
                                <div className="col-xs-2" style={{ marginTop: '2.5%' }} >
                                    <label className="chkBox"> In Active
                                  <input type="checkbox" name="isActive" ref="isActive" value={this.state.IsInActive} onChange={this.isInActiveChanged.bind(this)} defaultChecked={this.state.DefaultAlloc["Inactive"]} />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                                :
                                <div />
                            }

                        </div>

                        <div className="col-xs-12">
                            <div className="loader loaderActivity" style={{ marginLeft: '43%', marginBottom: '8px' }} ></div>
                            <button type="submit" style={{ marginLeft: '43%' }} name="submit" className="btn btn-md btn-success" > Save </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    isInActiveChanged() {
        this.setState({ IsInActive: !this.state.DefaultAlloc["Inactive"] })
    }

    DoctorChanged(val) {
        this.setState({ Doctor: val || '' });
        showErrorsForInput(this.refs.doctor.wrapper, null);
    }

    ClientChanged(val) {
        this.setState({ Client: val || '' })
        showErrorsForInput(this.refs.client.wrapper, null);
    }
    JobLevelChanged(val) {
        this.setState({ JobLevel: val || '' })
        showErrorsForInput(this.refs.jobLevel.wrapper, null);
    }

    EmployeeChanged(val) {
        this.setState({ Employee: val || '' });
        showErrorsForInput(this.refs.employee.wrapper, null);
    }

    handleSubmit(e) {
        e.preventDefault();

        $(".loaderActivity").show();
        $("button[name='submit']").hide();


        if (!this.validate(e)) {

            $(".loaderActivity").hide();
            $("button[name='submit']").show();
            return;
        }

        var data = new FormData();
        data.append("Client", this.state.Client.value);
        data.append("Doctor", this.state.Doctor.value);
        data.append("Employee", this.state.Employee.value);
        data.append("JobLevel", this.state.JobLevel.value);
        data.append("NoOfPages", this.refs.noofpages.value);
        data.append("Accuracy", this.refs.accuracy.value)

        if (this.props.match.params["id"] != null) {
            data.append("IsInActive", this.state.IsInActive);
            var url = ApiUrl + "api/Allocations/UpdateDefaultAlloc?defaultAllocId=" + this.props.match.params["id"]
        }
        else {
            var url = ApiUrl + "api/Allocations/AddDefaultAllocation"
        }

        try {
            MyAjaxForAttachments(
                url,
                (data) => {
                    toast("Default allocation saved successfully!", {
                        type: toast.TYPE.SUCCESS
                    });
                    $(".loaderActivity").hide();
                    $("button[name='submit']").show();
                    this.props.history.push("/DefaultAllocationsList");
                    return true;
                },
                (error) => {
                    toast("An error occured, please try again later", {
                        type: toast.TYPE.ERROR,
                        autoClose: false
                    });
                    $(".loader").hide();
                    $("button[name='submit']").show();
                    return false;
                },
                "POST",
                data
            );
        }
        catch (e) {
            toast("An error occoured, please try again!", {
                type: toast.TYPE.ERROR
            });
            $(".loaderActivity").hide();
            $("button[name='submit']").show();
            return false;
        }
    }

    validate(e) {
        var success = ValidateForm(e);

        if (!this.state.Client || !this.state.Client.value) {
            success = false;
            showErrorsForInput(this.refs.client.wrapper, ["Please select client"]);
        }

        if (!this.state.Doctor || !this.state.Doctor.value) {
            success = false;
            showErrorsForInput(this.refs.doctor.wrapper, ["Please select doctor"]);
        }

        if (!this.state.Employee || !this.state.Employee.value) {
            success = false;
            showErrorsForInput(this.refs.employee.wrapper, ["Please select employee"]);
        }

        if (!this.state.JobLevel || !this.state.JobLevel.value) {
            success = false;
            showErrorsForInput(this.refs.jobLevel.wrapper, ["Please select job level"]);
        }

        return success;
    }
}

export default DefaultAllocations;