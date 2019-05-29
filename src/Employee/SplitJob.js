import React, { Component } from 'react';
import $ from 'jquery';
import './Employee.css';
import Select from 'react-select';
import { showErrorsForInput, setUnTouched, ValidateForm } from '.././Validation';
import { MRSUrl } from '../Config';
import { MyAjaxForAttachments, MyAjax } from '../MyAjax.js';
import { toast } from 'react-toastify';

var validate = require('validate.js');

class SplitJob extends Component {

    constructor(props) {
        super(props);
        var L1 = [{ jobNumber: "", startPage: null, endPage: null, MRA: '' }];
        var L1_L3 = [{ jobNumber: "", startPage: null, endPage: null, MRA: '', AQA: '' }];
        var L1_L2_L3 = [{ jobNumber: "", startPage: null, endPage: null, MRA: '', AQA: '', QA: '' }];

        var JobAlloc = [{ jobNumber: "", startPage: null, endPage: null, MRA: null, AQA: null, QA: null }];

        this.state = {
            splitJob: false, NoOfSplits: 1, Employees: [], selectLevel: 1,
            selectedLevel: {}, uiItems: [], count: 0, startPage: 1, endPage: 1,
            result: 0, uiItemRefs: [], MRA: '', AQA: '', QA: '', L1: L1,
            L1_L3: L1_L3,
            L1_L2_L3: L1_L2_L3,
            result: 0, JobAlloc: JobAlloc

        }
    }

    componentWillMount() {

        if (this.props.location.state) {
            this.setState({
                JobNumber: this.props.location.state["JobNumber"],
                TotalPages: this.props.location.state["TotalPages"],
                Client: this.props.location.state["Client"],
                JobLevel: this.props.location.state["JobLevel"],
                Status: this.props.location.state["Status"],
                TAT: this.props.location.state["TAT"],
                JobId: this.props.location.state["JobId"]
            }, () => {
                $.ajax({
                    url: MRSUrl + "/api/Jobs/GetAllocatedJob?jobId=" + this.state.JobId,
                    type: "get",
                    success: (data) => {
                        this.setState({
                            AllocatedJob: data["allocatedJob"], JobLevel: data["jobLevel"],
                            allocatedCount: data["alloctdJobcount"]
                        }, () => {
                            if (data["allocatedJob"]["previouslyAllocated"] == true) {
                                if (this.state.JobLevel == "L1") {
                                    this.setState({ MRA: { value: data["allocatedJob"]["MRAId"], label: data["allocatedJob"]["MRA"] } })
                                }
                                else if ((this.state.JobLevel == "L1-L3")) {
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
                        })
                    }
                })
            })
        }

        $.ajax({
            url: MRSUrl + "/api/Jobs/GetEmployeesForAllocation",
            type: "get",
            success: (data) => { this.setState({ Employees: data["employees"] }) }
        })
    }

    componentDidMount() {
        setUnTouched(document);
        $('[data-toggle="popover"]').popover();
    }

    componentDidUpdate() {
        $('[data-toggle="popover"]').popover();
    }

    render() {
        return (
            <div className="container" style={{ fontSize: '12px', paddingLeft: '0px' }} key={this.state.JobNumber}>
                <div className="modalExample" tabIndex="-1" role="dialog" id="myModal" aria-hidden="true" >
                    <div className="modal-dialog modaldialogueCss">
                        <div className="modal-content">
                            <div className="modal-header formheader" >
                                <button type="button" className="close modelBtnClose" data-dismiss="modal" id="closeModal" onClick={this.CloseClick.bind(this)}> &times; </button>
                                <h4 className="modal-title">Split Job</h4>
                            </div>

                            <div>
                                <div className="modal-body col-sm-12 mx-auto">

                                    <div className="col-xs-2 form-group">
                                        <input type="text" id="name" className="form-control" name="JobNumber" ref="jobnumber" value={this.state.JobNumber} required />
                                        <label className="form-control-placeholder" for="name">Job Number</label>
                                    </div>

                                    <div className="col-xs-2 form-group">
                                        <input type="text" id="noofPages" className="form-control" name="noofPages" ref="noofpages" value={this.state.TotalPages} required />
                                        <label className="form-control-placeholder" for="noofPages">No.of Pages</label>
                                    </div>

                                    <div className="col-xs-2 form-group">
                                        <input type="text" id="client" className="form-control" name="client" ref="client" value={this.state.Client} required />
                                        <label className="form-control-placeholder" for="client">Client</label>
                                    </div>

                                    <div className="col-xs-2 form-group">
                                        <input type="text" id="joblevel" className="form-control" name="joblevel" ref="joblevel" value={this.state.JobLevel} required />
                                        <label className="form-control-placeholder" for="joblevel">Job Level</label>
                                    </div>

                                    <div className="col-xs-1 form-group">
                                        <input type="text" id="tat" className="form-control" name="tat" ref="tat" required value={this.state.TAT} />
                                        <label className="form-control-placeholder" for="tat">TAT</label>
                                    </div>

                                    <div className="col-md-2 form-group">
                                        <input className="form-control" type="text" name="status" ref="status" defaultValue={this.state.Status} required />
                                        <label for="status" className="form-control-placeholder">Status </label>
                                    </div>

                                    <div className="col-xs-1 form-group">
                                        <input className="form-control" id="noofsplits" type="text" name="noofsplits" ref="noofsplits" onChange={this.noOfSplitsChanged.bind(this)} required />
                                        <label for="noofsplits" className="form-control-placeholder">Splits</label>
                                    </div>

                                    {
                                        this.state.splitJob ?

                                            this.refs.joblevel.value == "L1" ?
                                                this.state.L1.map((ele, e) => {
                                                    return (
                                                        <div key={ele + "" + e} className="col-xs-12">
                                                            <div className="col-xs-2">
                                                                <label>Job Number</label>
                                                                <input className="form-control" name="jobNum" type="text" ref="jobNum" value={ele["JobNumber"]} />
                                                            </div>

                                                            <div className="col-xs-1">
                                                                <label>Start Page</label>
                                                                <input className="form-control" name="startPage" type="text" ref="startPage" defaultValue={ele["startPage"]} />
                                                            </div>

                                                            <div className="col-xs-1">
                                                                <label>End Page</label>
                                                                <input className="form-control" name="endPage" type="text" ref="endPage" defaultValue={ele["endPage"]} />
                                                            </div>

                                                            <div className="col-md-2">
                                                                <label>MRA</label>
                                                                <Select className="form-control" name="MRA" ref="mra" placeholder="Select MRA" value={ele["MRA"]} options={this.state.Employees} onChange={this.MRAChanged.bind(this, e)} />
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                                :
                                                this.refs.joblevel.value == "L1-L3" ?

                                                    this.state.L1_L3.map((ele, e) => {
                                                        return (
                                                            <div key={ele + "" + e} className="col-xs-12">

                                                                <div className="col-xs-2">
                                                                    <label>Job Number</label>
                                                                    <input className="form-control" name="jobNum" type="text" ref="jobNum" value={ele["JobNumber"]} />
                                                                </div>

                                                                <div className="col-xs-1">
                                                                    <label>Start Page</label>
                                                                    <input className="form-control" name="startPage" type="text" ref="startPage" defaultValue={ele["startPage"]} />
                                                                </div>

                                                                <div className="col-xs-1">
                                                                    <label>End Page</label>
                                                                    <input className="form-control" name="endPage" type="text" ref="endPage" defaultValue={ele["endPage"]} />
                                                                </div>

                                                                <div className="col-md-2">
                                                                    <label>MRA</label>
                                                                    <Select className="form-control" name="MRA" ref="mra" placeholder="Select MRA" value={ele["MRA"]} options={this.state.Employees} onChange={this.MRAChanged.bind(this, e)} />
                                                                </div>
                                                                <div className="col-md-2">
                                                                    <label>QA</label>
                                                                    <Select className="form-control" name="qa" ref="qa" placeholder="Select QA" value={ele["QA"]} options={this.state.Employees} onChange={this.QAChanged.bind(this, e)} />
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                    :

                                                    this.state.L1_L2_L3.map((ele, e) => {
                                                        return (
                                                            <div key={ele + "" + e} className="col-xs-12">
                                                                <div className="col-xs-2">
                                                                    <label>Job Number</label>
                                                                    <input className="form-control" name="jobNum" type="text" ref="jobNum" value={ele["JobNumber"]} />
                                                                </div>

                                                                <div className="col-xs-1">
                                                                    <label>Start Page</label>
                                                                    <input className="form-control" name="startPage" type="text" ref="startPage" defaultValue={ele["startPage"]} />
                                                                </div>

                                                                <div className="col-xs-1">
                                                                    <label>End Page</label>
                                                                    <input className="form-control" name="endPage" type="text" ref="endPage" defaultValue={ele["endPage"]} />
                                                                </div>

                                                                <div className="col-md-2">
                                                                    <label>MRA</label>
                                                                    <Select className="form-control" name="MRA" ref="mra" placeholder="Select MRA" value={ele["MRA"]} options={this.state.Employees} onChange={this.MRAChanged.bind(this, e)} />
                                                                </div>

                                                                <div className="col-md-2">
                                                                    <label>AQA</label>
                                                                    <Select className="form-control" name="aqa" ref="aqa" placeholder="Select AQA" value={ele["AQA"]} options={this.state.Employees} onChange={this.AQAChanged.bind(this, e)} />
                                                                </div>

                                                                <div className="col-md-2">
                                                                    <label>QA</label>
                                                                    <Select className="form-control" name="qa" ref="qa" placeholder="Select QA" value={ele["QA"]} options={this.state.Employees} onChange={this.QAChanged.bind(this, e)} />
                                                                </div>

                                                            </div>
                                                        )
                                                    })

                                            : <div />
                                    }

                                </div>

                                <div className="col-md-12">
                                    <div className="loader jobsplitbtn" ></div>
                                    <button className="btn btn-success jobsplitbtn" type="submit" name="submit" onClick={this.handleSubmit.bind(this)} > submit</button>
                                </div>

                                <div className="modal-footer">
                                    {/* <button type="button" className="btn btn-default" data-dismiss="modal">Close</button> */}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        );
    }


    CloseClick() {
        $("#closeModal").click();
        this.props.history.push("/JobAllocations")

    }

    noOfSplitsChanged() {

        var numberOfSplits = this.refs.noofsplits.value;
        var noOfPages = this.props.location.state["TotalPages"];
        var l1 = []; var l1l3 = []; var l1l2l3 = []; var JobAlloc = [];
        var result = 0;

        var startpage = 1; var endpage = this.refs.noofpages.value;

        if (numberOfSplits > 1 && numberOfSplits <= noOfPages) {

            this.setState({ splitJob: true })

            for (var i = 0; i < this.refs.noofsplits.value; i++) {

                if (i + 1 != numberOfSplits) {
                    startpage = result + startpage;
                    result = Math.round(this.refs.noofpages.value / this.refs.noofsplits.value);
                    endpage = startpage + result - 1;

                    this.setState({ startPage: startpage, endPage: endpage, result: result });
                }

                else {
                    startpage = endpage + 1;
                    endpage = noOfPages;
                    this.setState({ startPage: startpage, endPage: endpage });
                }

                var count = "jobNum " + i;
                var jobNum = i + 1;

                if (i == 0) {

                    if (this.refs.joblevel.value == "L1") {
                        l1.push({ JobNumber: this.refs.jobnumber.value + '_' + jobNum, startPage: startpage, endPage: endpage, MRA: this.state.MRA.value })
                        this.setState({ L1: l1 });
                    }

                    else if (this.refs.joblevel.value == "L1-L3") {
                        l1l3.push({ JobNumber: this.refs.jobnumber.value + '_' + jobNum, startPage: startpage, endPage: endpage, MRA: this.state.MRA.value, QA: this.state.QA.value })
                        this.setState({ L1_L3: l1l3 });
                    }

                    else {
                        l1l2l3.push({ JobNumber: this.refs.jobnumber.value + '_' + jobNum, startPage: startpage, endPage: endpage, MRA: this.state.MRA.value, AQA: this.state.AQA.value, QA: this.state.QA.value })
                        this.setState({ L1_L2_L3: l1l2l3 });
                    }
                }

                else {

                    if (this.refs.joblevel.value == "L1") {
                        l1.push({ JobNumber: this.refs.jobnumber.value + '_' + jobNum, startPage: startpage, endPage: endpage, MRA: '' })
                        this.setState({ L1: l1 });
                    }

                    else if (this.refs.joblevel.value == "L1-L3") {
                        l1l3.push({ JobNumber: this.refs.jobnumber.value + '_' + jobNum, startPage: startpage, endPage: endpage, MRA: '', QA: '' })
                        this.setState({ L1_L3: l1l3 });
                    }

                    else {
                        l1l2l3.push({ JobNumber: this.refs.jobnumber.value + '_' + jobNum, startPage: startpage, endPage: endpage, MRA: '', AQA: '', QA: '' })
                        this.setState({ L1_L2_L3: l1l2l3 });
                    }

                }

                // JobAlloc.push({JobNumber: this.refs.jobnumber.value + '_' + jobNum, startPage: startpage, endPage: endpage, MRA: '', AQA: '', QA: '' });
                // this.setState({JobAlloc: JobAlloc});
            }
        }

        else {
            this.setState({ splitJob: false, startPage: 1, endPage: 1 });
        }

    }


    MRAChanged(e, ele) {

        if (this.refs.joblevel.value == "L1") {
            var l1 = this.state.L1;
            l1[e]["MRA"] = ele.value;
            this.setState({ L1: l1 })
        }

        if (this.refs.joblevel.value == "L1-L3") {
            var l1l3 = this.state.L1_L3;
            l1l3[e]["MRA"] = ele.value;
            this.setState({ L1_L3: l1l3 })
        }

        if (this.refs.joblevel.value == "L1-L2-L3") {
            var l1l2l3 = this.state.L1_L2_L3;
            l1l2l3[e]["MRA"] = ele.value;
            this.setState({ L1_L2_L3: l1l2l3 })
        }

        // var JobAlloc= this.state.JobAlloc;
        // JobAlloc[e]["MRA"]= ele.value;
        // this.setState({JobAlloc: JobAlloc});
    }

    AQAChanged(e, ele) {

        if (this.refs.joblevel.value == "L1-L2-L3") {
            var l1l2l3 = this.state.L1_L2_L3;
            l1l2l3[e]["AQA"] = ele.value;
            this.setState({ L1_L2_L3: l1l2l3 })
        }

        // var JobAlloc= this.state.JobAlloc;
        // JobAlloc[e]["AQA"]= ele.value;
        // this.setState({JobAlloc: JobAlloc});

    }

    QAChanged(e, ele) {

        if (this.refs.joblevel.value == "L1-L3") {
            var l1l3 = this.state.L1_L3;
            l1l3[e]["QA"] = ele.value;
            this.setState({ L1_L3: l1l3 })
        }

        if (this.refs.joblevel.value == "L1-L2-L3") {
            var l1l2l3 = this.state.L1_L2_L3;
            l1l2l3[e]["QA"] = ele.value;
            this.setState({ L1_L2_L3: l1l2l3 })
        }

        // var JobAlloc= this.state.JobAlloc;
        // JobAlloc[e]["QA"]= ele.value;
        // this.setState({JobAlloc: JobAlloc});

    }

    handleSubmit(e) {

        e.preventDefault();

        var data = new FormData();

        data.append("JobId", this.props.location.state["JobId"]);
        data.append("JobNumber", this.props.location.state["JobNumber"]);
        data.append("DefaultTAT", this.props.location.state["TAT"]);
        data.append("Status", this.props.location.state["Status"]);

        if (this.refs.joblevel.value == "L1") {
            data.append("AddJob", JSON.stringify(this.state.L1));
        }

        if (this.refs.joblevel.value == "L1-L3") {
            data.append("AddJob", JSON.stringify(this.state.L1_L3));
        }

        if (this.refs.joblevel.value == "L1-L2-L3") {
            data.append("AddJob", JSON.stringify(this.state.L1_L2_L3));
        }

        // data.append("AddJob", JSON.stringify(this.state.JobAlloc));

        var url = MRSUrl + "/api/Jobs/SplitJob"

        try {

            $(".loader").show();
            $("button[name='submit']").hide();

            MyAjaxForAttachments(
                url,
                (data) => {
                    toast("Job split done successfully!", {
                        type: toast.TYPE.SUCCESS
                    });
                    $("button[name='submit']").show();
                    this.props.history.push("../JobAllocations");
                    return true;
                },
                (error) => {
                    toast(error.responseText, {
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
            toast("An error occured, please try again later", {
                type: toast.TYPE.ERROR
            });

            $("button[name='submit']").show();
            return false;

        }
    }
}




export default SplitJob;


// createUi() {

    //     var uiItems = this.state.uiItems;
    //     var totalpages = this.refs.noofpages.value;
    //     // var startPage = 1;
    //     // var endPage=1;
    //     var result = 0;
    //     var uiItemRefs = this.state.uiItemRefs;

    //     var totalSplits = this.state.NoOfSplits;

    //     if (totalSplits > 1) {

    //         for (let i = 0; i < totalSplits; i++) {

    //             this.state.splitJob = true;

    //             if (i + 1 == totalSplits) {
    //                 this.state.startPage = this.state.endPage + 1;
    //                 this.state.endPage = this.refs.noofpages.value;
    //             }
    //             else {
    //                 this.state.startPage = result + this.state.startPage;
    //                 result = Math.round(this.refs.noofpages.value / this.state.NoOfSplits);
    //                 this.state.endPage = this.state.startPage + result - 1;
    //             }

    //             var count = "jobNum " + i;
    //             var jobNum = i + 1;



    //             uiItems.push(
    //                 <div className="col-xs-12" ref={(count) => uiItemRefs.push(count)} key={i} >

    //                     <div className="col-xs-2">
    //                         <label>Job Number</label>
    //                         <input className="form-control" name="noofpages" type="text" ref="noOfpages" value={this.refs.jobnumber.value + '_' + jobNum} />
    //                     </div>

    //                     {/* <div className="col-xs-2">
    //                         <label>Job Number</label> <br /> {this.refs.jobnumber.value + '_' + jobNum}
    //                     </div> */}

    //                     <div className="col-xs-1">
    //                         <label>Start Page</label>
    //                         <input className="form-control" name="noofpages" type="text" ref="noOfpages" defaultValue={this.state.startPage} />
    //                     </div>

    //                     <div className="col-xs-1">
    //                         <label>End Page</label>
    //                         <input className="form-control" name="noofpages" type="text" ref="noOfpages" defaultValue={this.state.endPage} />
    //                     </div>

    //                     {
    //                         this.refs.joblevel.value == "L1" ?
    //                             <div className="col-md-2">
    //                                 <label>MRA</label>
    //                                 <Select className="form-control" name="MRA" ref="mra" placeholder="Select MRA" value={this.state.MRA[i]} options={this.state.Employees} onChange={this.MRAChanged.bind(this, i)} />
    //                             </div>
    //                             :

    //                             this.refs.joblevel.value == "L1-L3" ?
    //                                 <div key={i}>
    //                                     <div className="col-md-2">
    //                                         <label>MRA</label>
    //                                         <Select className="form-control" name="MRA" ref="mra" placeholder="Select MRA" value={this.state.MRA} options={this.state.Employees} onChange={this.MRAChanged.bind(this, { i })} />
    //                                     </div>

    //                                     <div className="col-md-2">
    //                                         <label>QA</label>
    //                                         <Select className="form-control" name="QA" ref="qa" placeholder="Select QA" value={this.state.QA} options={this.state.Employees} onChange={this.QAChanged.bind(this)} />
    //                                     </div>
    //                                 </div>
    //                                 :

    //                                 <div key={i}>
    //                                     <div className="col-md-2">
    //                                         <label>MRA</label>
    //                                         <Select className="form-control" name="MRA" ref="mra" placeholder="Select MRA" value={this.state.MRA} options={this.state.Employees} onChange={this.MRAChanged.bind(this)} />
    //                                     </div>

    //                                     <div className="col-md-2">
    //                                         <label>AQA</label>
    //                                         <Select className="form-control" name="AQA" ref="aqa" placeholder="Select AQA" value={this.state.AQA} options={this.state.Employees} onChange={this.AQAChanged.bind(this)} />
    //                                     </div>

    //                                     <div className="col-md-2">
    //                                         <label>QA</label>
    //                                         <Select className="form-control" name="QA" ref="qa" placeholder="Select QA" value={this.state.QA} options={this.state.Employees} onChange={this.QAChanged.bind(this)} />
    //                                     </div>
    //                                 </div>
    //                     }
    //                 </div>
    //             )
    //         }
    //         return this.state.uiItems;
    //     }

    //     // else {
    //     //     let uiItems = [];
    //     //     this.state.splitJob = false;
    //     //     uiItems.push(
    //     //         <div>
    //     //         </div>
    //     //     )
    //     //     return uiItems;
    //     // }
// }

 // if (i + 1 == this.refs.noofsplits.value) {


                //     var jobNum = i + 1;
                //     startpage = endpage + 1;
                //     endpage = this.refs.noofpages.value;
                //     this.setState({ startPage: startpage, endPage: endpage });

                //     if (this.refs.joblevel.value == "L1") {
                //         l1.push({ JobNumber: this.refs.jobnumber.value + '_' + jobNum, startPage: startpage, endPage: endpage, MRA: '' })
                //         this.setState({ L1: l1 });
                //     }

                //     else if (this.refs.joblevel.value == "L1-L3") {
                //         l1l3.push({ JobNumber: this.refs.jobnumber.value + '_' + jobNum, startPage: startpage, endPage: endpage, MRA: '', QA: '' })
                //         this.setState({ L1_L3: l1l3 });
                //     }

                //     else {
                //         l1l2l3.push({ JobNumber: this.refs.jobnumber.value + '_' + jobNum, startPage: startpage, endPage: endpage, MRA: '', AQA: '', QA: '' })
                //         this.setState({ L1_L2_L3: l1l2l3 });
                //     }
                //     // JobAlloc.push({JobNumber: this.refs.jobnumber.value + '_' + jobNum, startPage: startpage, endPage: endpage, MRA: '', AQA: '', QA: '' })

                // }

                // else {
 // }
