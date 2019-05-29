import React, { Component } from 'react';
import $ from 'jquery';
import Select from 'react-select';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import '../Employee/Employee.css';
import { toast } from 'react-toastify';
import { ApiUrl, MRSUrl } from '../Config';
import { MyAjaxForAttachments, MyAjax } from '../MyAjax';
import { ValidateForm, showErrorsForInput, setUnTouched, showErrors } from '../Validation';

var moment = require('moment');

class EmployeeJobAllocation extends Component {
    constructor(props) {
        super(props);

        var allocateJob = { JobId: '', JobDate: '', JobNumber: '', JobLevel: '', DefaultTAT: '', MRA: null, AQA: null, QA: null };

        this.state = {
            JobDate: '', Employee: '', Employees: [], selectLevel: null, level: null, JobLevel: '',
            Client: '', Doctor: '' , JobNumber: null, AQA: null, QA: null, MRA: null,uiItemRefs: [],
            AllocateJob: allocateJob, TotalPages: '', JobDetails:this.props.JobDetails,
            JobLevels:[{value: "L1", label:"L1"}, {value:"L1-L3", label:"L1-L3"}, 
                          {value:"L1-L2-L3", label:"L1-L2-L3"}]
                               
        }
    }
    componentWillMount() {

        $.ajax({
              url: ApiUrl + "/api/MasterData/GetEmployees?orgId=" + sessionStorage.getItem("orgId"),
              type: "get",
               success: (data) => { this.setState({ Employees: data["employees"] }) }
            })
            this.GetJobDetails();
    }
    
    GetJobDetails(){
      
        $.ajax({
            url: MRSUrl + "/api/Jobs/GetAllocatedJob?jobId=" + this.state.JobDetails.JobId,
            type: "get",
            success: (data) => {
                 this.setState({ AllocatedJob: data["allocatedJob"], JobLevel: data["jobLevel"],
                            allocatedCount: data["alloctdJobcount"],
                            JobLevel:{value:data["jobLevel"], label:data["jobLevel"]}
                        }, () => {
                            if (data["allocatedJob"]["previouslyAllocated"] == true) {
                           
                                if (data["jobLevel"] == "L1") {
                                    this.setState({ MRA: { value: data["allocatedJob"]["MRAId"], label: data["allocatedJob"]["MRA"] } })
                                }
                                else if ((data["jobLevel"] == "L1-L3")) {
                                    this.setState({
                                        MRA: { value: data["allocatedJob"]["MRAId"], label: data["allocatedJob"]["MRA"] },
                                        QA: { value: data["allocatedJob"]["QAId"], label: data["allocatedJob"]["QA"] }
                                    })
                                }
                                else {
                                    this.setState({
                                        MRA: { value: data["allocatedJob"]["MRAId"], label: data["allocatedJob"]["MRA"] },
                                        AQA: { value: data["allocatedJob"]["AQAId"], label: data["allocatedJob"]["AQA"] },
                                        QA: { value: data["allocatedJob"]["QAId"], label: data["allocatedJob"]["QA"] },
                                    })
                                }
                            }
                            else{
                                this.setState({MRA:null, AQA:null, QA:null})
                            }

                        })
                    }
                })
    }

    componentWillReceiveProps(nextProps) {
        setUnTouched(document);
        this.setState({JobDetails: nextProps.JobDetails},()=>{
            this.GetJobDetails();
        })
    }

    render() {
        return (
            <div key={this.state.AllocatedJob}>
                <form onSubmit={this.handleSubmit.bind(this)} onChange={this.validate.bind(this)} key={this.state.JobDetails}>
                    <div>
                     <div className="col-xs-12" >
                              <div className="col-md-2 form-group">
                                 <input type="text" id="name" className="form-control" name="JobNumber" ref="jobnumber" value={this.state.JobDetails.JobNumber} required />
                                 <label className="form-control-placeholder" >Job Number</label>
                               </div>

                              <div className="col-md-2 form-group">
                                    <input type="text" id="name" className="form-control" name="TotalPages" ref="totalPages" autoComplete="off" value={this.state.JobDetails["TotalPages"]}  />
                                    <label className="form-control-placeholder" >Total Pages</label>
                              </div>

                               <div className="col-md-2 form-group">
                                   <input type="text" id="name" className="form-control" name="jobDate" ref="jobDate" value={moment(this.state.JobDetails["JobDate"]).format("DD-MM-YYYY")} />
                                   <label className="form-control-placeholder" >Job date</label>
                               </div>

                                <div className="col-md-2 form-group">
                                   <input type="text" id="name" className="form-control" name="client" ref="client" value={this.state.JobDetails["Client"]} required />
                                   <label className="form-control-placeholder">Client</label>
                                </div>

                                <div className="col-md-2 form-group">
                                     <Select className="form-control" ref="joblevel" name="joblevel" placeholder="JobLevel"  value={this.state.JobLevel} options={this.state.JobLevels} onChange={this.LevelChanged.bind(this)} />
                                </div>

                                <div className="col-md-2 form-group">
                                   <input type="text" id="name" className="form-control" name="tat" ref="status" autoComplete="off" value={this.state.JobDetails["Status"]} required />
                                   <label className="form-control-placeholder" > Status </label>
                                </div>
                             </div>

                             <div className="col-xs-12">

                                    <div className="col-md-2 form-group">
                                     <input type="number" id="name" className="form-control" name="defaultTAT" ref="defaultTAT" autoComplete="off" min="1" max="18" defaultValue={this.state.JobDetails["DefaultTAT"]} required />
                                      <label className="form-control-placeholder" > Default TAT</label>
                                    </div>
                                       
                                     {
                                       this.state.JobLevel !=null ?
                                         this.state.JobLevel.value  == "L1-L2-L3" ?
                                            <div>
                                              <div className="col-xs-2 form-group">
                                                  <Select className="form-control" name="mraName" ref="mra" placeholder="Select MRA" value={this.state.MRA} options={this.state.Employees} onChange={this.MRAChanged.bind(this)} />
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <Select className="form-control" name="aqaName" ref="aqa" placeholder="Select AQA" value={this.state.AQA} options={this.state.Employees} onChange={this.AQAChanged.bind(this)} />
                                                </div>
                                                <div className="col-md-2 form-group">
                                                    <Select className="form-control" name="qaName" ref="qa" placeholder="Select QA" value={this.state.QA} options={this.state.Employees} onChange={this.QAChanged.bind(this)} />
                                                </div>
                                                </div>
                                                :
                                                this.state.JobLevel.value == "L1-L3" ?
                                                    <div>
                                                    <div className="form-group col-md-2">
                                                        <Select className="form-control" name="mraName" ref="mra" placeholder="Select MRA" value={this.state.MRA} options={this.state.Employees} onChange={this.MRAChanged.bind(this)} />
                                                    </div>
                                                    <div className="form-group col-md-2">
                                                       <Select className="form-control" name="qaName" ref="qa" placeholder="Select QA" value={this.state.QA} options={this.state.Employees} onChange={this.QAChanged.bind(this)} />
                                                    </div>
                                                    </div>
                                                    :
                                                    <div className="form-group col-md-2">
                                                        <Select className="form-control" name="mraName" placeholder="Select MRA" ref="mra" value={this.state.MRA} options={this.state.Employees} onChange={this.MRAChanged.bind(this)} />
                                                    </div>
                                                    :
                                                    <div className="form-group col-md-2">
                                                        <Select className="form-control" name="mraName" placeholder="Select MRA" ref="mra" value={this.state.MRA} options={this.state.Employees} onChange={this.MRAChanged.bind(this)} />
                                                    </div>

                                        }
                             

                             </div>
                       
                                    <div className="col-xs-12">
                                        <div className="col-sm-3">
                                           <div className="loader loaderActivity docSubmit" ></div>
                                            <button type="submit" name="submit" className="btn btn-success" style={{ marginLeft: '180%' }} > Submit </button>
                                        </div> 
                                    </div>
                                    </div>
                       
                </form>
            </div>
        )
    }

    CloseClick() {
        $("#closeModal").click();
        this.props.history.push("../JobAllocations");

    }
    LevelChanged(val) {
        if(val!=null){
            this.setState({ JobLevel: val,MRA:null, AQA:null, QA:null },()=>{
                 showErrorsForInput(this.refs.mra.wrapper, null);
                 if(val.value== "L1-L3"){
                     showErrorsForInput(this.refs.qa.wrapper, null);
                 }
                 else{
                    showErrorsForInput(this.refs.qa.wrapper, null);
                    showErrorsForInput(this.refs.aqa.wrapper, null);
                 }

            });
            showErrorsForInput(this.refs.joblevel.wrapper, null);
        }
        else{
            this.setState({MRA:null, AQA:null, QA:null},()=>{
                showErrorsForInput(this.refs.joblevel.wrapper, ["Please select Job Level"]);
            })
           
        }
       
      
    }

    MRAChanged(val) {

        var employees = [];

        if (val != null) {

            if (this.state.AQA != null) {
                employees.push(this.state.AQA.value);
            }

            if (this.state.QA != null) {
                employees.push(this.state.QA.value);
            }

            var i = employees.indexOf(val.value);

            if (i == -1) {
                this.setState({ MRA: val });
                showErrorsForInput(this.refs.mra.wrapper, null);
            }
        }
        else {
            this.setState({ MRA: '' })
        }

    }

    AQAChanged(val) {

        var employees = [];

        if (val != null) {

            if (this.state.MRA != null) {
                employees.push(this.state.MRA.value);
            }

            if (this.state.QA != null) {
                employees.push(this.state.QA.value);
            }

            var i = employees.indexOf(val.value);

            if (i == -1) {
                this.setState({ AQA: val });
                showErrorsForInput(this.refs.aqa.wrapper, null);
            }
        }
        else {
            this.setState({ AQA: '' })
        }
    }

    QAChanged(val) {

        var employees = [];

        if (val != null) {

            if (this.state.MRA != null) {
                employees.push(this.state.MRA.value);
            }
            if (this.state.AQA != null) {
                employees.push(this.state.AQA.value);
            }

            var i = employees.indexOf(val.value);

            if (i == -1) {
                this.setState({ QA: val })
                showErrorsForInput(this.refs.qa.wrapper, null);
            }

        }
        else {
            this.setState({ QA: '' })
        }
    }

    handleSubmit(e) {

        e.preventDefault();

        if (!this.validate(e)) {
            $(".loaderActivity").hide();
            $("button[name='submit']").show();
            return;
        }
        let data = {};

        data["JobId"] = this.state.JobDetails["JobId"];
        data["JobNumber"] = this.state.JobNumber;
        data["JobLevel"] = this.state.JobLevel.value;
        data["DefaultTAT"] = this.refs.defaultTAT.value;
        data["JobDate"] = this.state.JobDate;
        data["StartPage"] = 1;
        data["EndPage"] = this.refs.totalPages.value;
        data["Status"] = this.state.JobDetails["Status"];

        if (this.state.JobLevel.value == "L1") {
            data["MRAId"] = this.state.MRA.value;
        }

        if (this.state.JobLevel.value == "L1-L3") {
            data["MRAId"] = this.state.MRA.value;
            data["QAId"] = this.state.QA.value;
        }

        if (this.state.JobLevel.value == "L1-L2-L3") {
            data["MRAId"] = this.state.MRA.value;
            data["AQAId"] = this.state.AQA.value;
            data["QAId"] = this.state.QA.value;
        }

        var url = MRSUrl + "/api/Jobs/UpdateJobAllocation"

        try {

            MyAjax(
                url,
                (data) => {
                    toast("Job Allocated Successfully!", {
                        type: toast.TYPE.SUCCESS
                    });
                    $(".loaderActivity").hide();
                    $("button[name='submit']").show();
                   this.props.closeModal();
                    return true;
                },
                (error) => {
                    toast("An error occoured, please try again!", {
                        type: toast.TYPE.ERROR,
                        autoClose: false
                    });

                    $(".loaderActivity").hide();
                    $("button[name='submit']").show();
                    return false;
                },
                "POST",
                data
            )
        }

        catch (e) {
            toast("An error occoured, please try again!", {
                type: toast.TYPE.ERROR
            });

            $("button[name='submit']").show();
            return false;
        }
    }

    validate(e) {

        var success = ValidateForm(e);

        if(!this.state.JobLevel || !this.state.JobLevel.value){
            success= false;
            showErrorsForInput(this.refs.joblevel.wrapper, ["Please select jobLevel"])
        }

        if (!this.state.MRA || !this.state.MRA.value) {
                success = false;
                showErrorsForInput(this.refs.mra.wrapper, ["Please select MRA"]);
            }
       
        else if (this.state.JobLevel.value == "L1-L3") {

            if (!this.state.QA || !this.state.QA.value) {
                success = false;
                showErrorsForInput(this.refs.qa.wrapper, ["Please Select QA"]);
            }
        }

        else if (this.state.JobLevel.value == "L1-L2-L3") {

            if (!this.state.AQA || !this.state.AQA.value) {
                success = false;
                showErrorsForInput(this.refs.aqa.wrapper, ["Please select AQA"]);
            }
            if (!this.state.QA || !this.state.QA.value) {
                success = false;
                showErrorsForInput(this.refs.qa.wrapper, ["Please select QA"]);
            }
        }

        return success;
    }

}

export default EmployeeJobAllocation;
