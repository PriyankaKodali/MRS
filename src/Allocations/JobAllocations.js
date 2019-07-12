import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import $ from 'jquery';
import './JobAllocations.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import { MRSUrl } from '../Config';
import EmployeeJobAllocation from './EmployeeJobAllocation';
import Upload from './Upload';
import { toast } from 'react-toastify';
import { MyAjaxForAttachments } from '../MyAjax';
import { showErrorsForInput } from '../Validation';

var moment = require('moment');
var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

function trClassFormat(row, rowIdx) {
    if (row["Status"] == "Completed") {
        return "JobCompleted";
    }
    else {
        return "JobPending";
    }

}

class JobAllocations extends Component {

    constructor(props) {
        super(props);
        var jobDetails = { JobId: '', JobNumber: '', JobDate: '', Client: '', JobLevel: '', Doctor: '', DefaultTAT: '', TAT: '', TotalPages: '', Status: '', MRA: null, AQA: null, QA: null }
        this.state = {
            fromDate: moment(),
            Client: {},
            Clients: [],
            Jobs: [], IsDataAvailable: false,
            TotalPages: '', AllocateJobClick: false,
            SplitJobClick: false,
            JobDetails: jobDetails,
            SelectedJob: null,
            PageCountModalShow: false,
            CommentModalShow: false
        }
    }

    componentWillMount() {
        this.GetTeamJobs();

    }
    GetTeamJobs() {
        $.ajax({
            url: MRSUrl + "/api/Jobs/GetTeamJobs",
            type: "get",
            success: (data) => { this.setState({ Jobs: data["Jobs"], IsDataAvailable: true }) }
        })
    }


    render() {
        return (
            <div>
                <div className="coorHeadercon">
                    <div className="row">
                        <div className="col-md-12">
                            <h3 className="col-md-11 formheader"> Job Allocations </h3>
                            <div className="col-md-1 mybutton">
                                <button type="button" className="btn btn-default pull-left headerbtn" onClick={this.search.bind(this)} >
                                    <span className="glyphicon glyphicon-search"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.state.searchClick ?
                        <div>
                            <form className="CodntformSearch">

                                <div className="col-md-2 form-group">
                                    <label> From Date </label>
                                    <DatePicker className="form-control" name="fromDate" ref="fromDate" defaultValue={this.state.fromDate} selected={this.state.fromDate} />
                                </div>

                                <div className="col-md-2 form-group">
                                    <label> To Date </label>
                                    <DatePicker className="form-control" name="fromDate" ref="fromDate" defaultValue={this.state.fromDate} selected={this.state.fromDate} />
                                </div>

                                <div className="col-md-2 form-group">
                                    <label> Client </label>
                                    <Select className="form-control" name="clientname" ref="clientname" placeholder="Select Client" value={this.state.Client} options={this.state.Clients} onChange={this.ClientChanged.bind(this)} />
                                </div>

                                <div className="col-md-2 form-group">
                                    <label> MRA </label>
                                    <input className="form-control" type="text" name="mt" ref="mtName" placeholde="Employee name" />
                                </div>

                                <div className="col-md-2 form-group">
                                    <label> AQA </label>
                                    <input className="form-control" type="text" name="aqa" ref="aqaName" placeholde="Employee name" />
                                </div>

                                <div className="col-md-2 form-group">
                                    <label> QA </label>
                                    <input className="form-control" type="text" name="qa" ref="qaName" placeholde="Employee name" />
                                </div>

                                <div className="col-md-2 form-group">
                                    <label> Status</label>
                                    <input className="form-control" type="text" name="status" ref="status" />
                                </div>

                                <div className="col-md-2 form-group">
                                    <label> Job Number</label>
                                    <input className="form-control" type="text" name="jobNum" ref="jobNum" />
                                </div>
                                <div className="col-md-2 form-group button" >
                                    <button type="button" name="submit" className="btn btn-default" > Search </button>
                                    <button type="button" name="submit" className="btnLeft btn btn-default" > Clear </button>
                                </div>

                            </form>

                        </div>
                        :
                        <div />
                }

                {
                    !this.state.IsDataAvailable ? < div className="loader visible" ></div >
                        :
                        <div style={{ marginTop: '1%' }}>
                            <BootstrapTable striped hover remote={true} 
                                data={this.state.Jobs} trClassName={trClassFormat}
                            >
                                <TableHeaderColumn dataField="JobDate" isKey={true} dataSort={true} width="20" dataFormat={this.DateFormatter.bind(this)} > Date </TableHeaderColumn>
                                <TableHeaderColumn dataField="JobNumber" width="50" dataFormat={this.DownloadActualFile.bind(this)} > Job Name </TableHeaderColumn>
                                <TableHeaderColumn dataField="ShortName" width="20" > Client </TableHeaderColumn>
                                <TableHeaderColumn dataField="DoctorName" width="20">Doctor</TableHeaderColumn>
                                <TableHeaderColumn dataField="Pages" width="15" headerText='Pages' dataFormat={this.PageCountFormatter.bind(this)} > Pages </TableHeaderColumn>
                                <TableHeaderColumn dataField="TAT" width="10" > TAT </TableHeaderColumn>
                                <TableHeaderColumn dataField="Status" width="15" > Status </TableHeaderColumn>
                                <TableHeaderColumn columnClassName="Comments" width="10" dataAlign="center" dataFormat={this.CommentFormater.bind(this)} > </TableHeaderColumn>
                                {/* <TableHeaderColumn dataField="JobLevel"  width="25" > Job Level </TableHeaderColumn> 
                                <TableHeaderColumn dataField="MRA"  width="30" dataFormat={this.MRADataFormater.bind(this)} > MRA </TableHeaderColumn>
                                <TableHeaderColumn dataField="AQA"  width="30" dataFormat={this.AQADataFormater.bind(this)} > AQA </TableHeaderColumn>
                                <TableHeaderColumn dataField="QA"  width="30" dataFormat={this.QADataFormater.bind(this)} > QA </TableHeaderColumn> 
                                <TableHeaderColumn columnClassName="AllocateJob" width="10" dataAlign="center" headerText="Update Job allocation" dataFormat={this.AllocateJobFormatter.bind(this)} > </TableHeaderColumn>
                                <TableHeaderColumn columnClassName="SplitJob" width="10" dataAlign="center"  dataFormat={this.SplitJobFormatter.bind(this)} > </TableHeaderColumn> */}
                                <TableHeaderColumn columnClassName="UploadFile" width="10" dataAlign="center" dataFormat={this.UploadFile.bind(this)} > </TableHeaderColumn>
                            </BootstrapTable>
                        </div>
                }

                {
                    this.state.AllocateJobClick ?
                        <div className="modal fade" id="AllocateJob" role="dialog" data-keyboard="false" data-backdrop="static" key={this.state.UploadFileClick}>
                            <div className="modal-dialog modal-lg" style={{ width: '1080px' }} >
                                <div className="modal-content">
                                    <div className="modal-header " style={{ background: '#f5f3f3', borderBottom: '0px solid' }}>
                                        <button type="button" className="modelClose btnClose" data-dismiss="modal" id="closeModal"> &times; </button>
                                        <h4 className="modal-title">
                                            <p className="modalHeading">Allocate Job </p>
                                        </h4>
                                    </div>

                                    <div className="modal-body col-xs-12" key={this.state.JobDetails}>
                                        <EmployeeJobAllocation JobDetails={this.state.JobDetails} closeModal={this.CloseModel.bind(this)} ref={(ref) => "allocateJob"} />
                                    </div>

                                    <div className="modal-footer"> </div>

                                </div>
                            </div>
                        </div>
                        :
                        ""
                }

                {
                    this.state.UploadFileClick ?
                        <div className="modal fade" id="uploadFile" role="dialog" data-keyboard="false" data-backdrop="static" key={this.state.UploadFileClick}>
                            <div className="modal-dialog modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <button type="button" className="modelClose btnClose" data-dismiss="modal" id="closeModal"> &times; </button>
                                        <h4 className="modal-title">Upload Job</h4>
                                    </div>

                                    <div className="modal-body col-xs-12" key={this.state.AddNewModel}>
                                        <Upload JobNumber={this.state.JobNumber} ClientId={this.state.ClientId} closeUploadModal={this.CloseModel.bind(this)} ref={(ref) => "uploadJob"}
                                            JobName={this.state.JobName} Client={this.state.ClientName} />
                                    </div>

                                    <div className="modal-footer"> </div>

                                </div>
                            </div>
                        </div>
                        :
                        ""
                }
                {
                    this.state.PageCountModalShow ?
                        <div className="modal fade" id="pageCountModal" role="dialog" data-keyboard="false" data-backdrop="static">
                            <div className="modal-dialog modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h4 className="modal-title">Page Count</h4>
                                    </div>

                                    <div className="modal-body">
                                        <table className="table table-bordered">
                                            <tbody>
                                                <tr>
                                                    <td><b>Job Name</b></td><td>{this.state.SelectedJob["Filenames"][0]}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Client</b></td><td>{this.state.SelectedJob["ShortName"]}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="col-xs-12">
                                        <div className="form-group">
                                            <div className="input-group">
                                                <label>Page Count</label>
                                                <input type="number" step="1" className="form-control" defaultValue={this.state.SelectedJob["EndPage"]} ref="pageCountInput" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-xs-12 text-center" style={{ marginBottom: '10px' }}>
                                        <div className="loader pageCountLoader"></div>
                                        <div className="btn-grp">
                                            <div className="btn btn-success" onClick={() => this.SubmitPageCount()}>Submit</div>
                                            <div className="btn btn-danger mleft10" onClick={() => { $("#pageCountModal").modal("hide"); this.setState({ SelectedJob: null, PageCountModalShow: false }); }}>Cancel</div>
                                        </div>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                            </div>
                        </div>
                        :
                        null
                }
                {
                    this.state.CommentModalShow ?
                        <div className="modal fade" id="commentModal" role="dialog" data-keyboard="false" data-backdrop="static">
                            <div className="modal-dialog modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h4 className="modal-title">Comments</h4>
                                    </div>

                                    <div className="modal-body">
                                        <table className="table table-bordered" style={{ marginBottom: 0 }}>
                                            <tbody>
                                                <tr>
                                                    <td><b>Job Name</b></td><td>{this.state.SelectedJob["Filenames"][0]}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Client</b></td><td>{this.state.SelectedJob["ShortName"]}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <hr />
                                    <div className="col-xs-12">
                                        {
                                            this.state.SelectedJob["Comments"].map((comment) => {
                                                var commentHtml = <div>
                                                    <label>{comment["CommentBy"]}</label> <small>{comment["CommentOn"]}</small>
                                                    <br />
                                                    <p>{comment["Comment"]}</p>
                                                    <hr />
                                                </div>;
                                                return commentHtml;
                                            })
                                        }
                                    </div>
                                    <div className="col-xs-12">
                                        <div className="form-group">
                                            <div className="input-group col-xs-12">
                                                <label>Add New Comment</label>
                                                <input type="type" step="1" className="form-control" ref="commentInput" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-xs-12 text-center" style={{ marginBottom: '10px' }}>
                                        <div className="loader pageCountLoader"></div>
                                        <div className="btn-grp">
                                            <div className="btn btn-success" onClick={() => this.SubmitComment()}>Submit</div>
                                            <div className="btn btn-danger mleft10" onClick={() => { $("#commentModal").modal("hide"); this.setState({ SelectedJob: null, CommentModalShow: false }); }}>Cancel</div>
                                        </div>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                            </div>
                        </div>
                        :
                        null
                }
            </div>
        )
    }

    CloseModel() {
        $("#closeModal").click();
        this.setState({ UploadFileClick: false }, () => {
            this.GetTeamJobs();
        })

    }

    PageCountFormatter(cell, row) {
        if (row["Status"] !== "Completed") {
            if (cell) {
                return <div className="text-center">{cell}<span className="fa fa-pencil pointer mleft10" onClick={() => this.OpenPageCountModal(row)}></span></div>;
            }
            else {
                return <div className="text-center"><span className="fa fa-pencil pointer" onClick={() => this.OpenPageCountModal(row)}></span></div>;
            }
        }
        else {
            return <div className="text-center">{cell}</div>;
        }

    }

    OpenPageCountModal(row) {
        this.setState({ SelectedJob: row, PageCountModalShow: true }, () => {
            $("#pageCountModal").modal("show");
        });
    }

    SubmitPageCount() {
        var pageCount = this.refs.pageCountInput.value;
        if (!pageCount) {
            showErrorsForInput(this.refs.pageCountInput, ["Please enter a value"]);
            return;
        }
        else {
            showErrorsForInput(this.refs.pageCountInput, [""]);
        }

        $(".btn-grp").hide();
        $(".pageCountLoader").show();
        var data = new FormData();
        data.append("JobNumber", this.state.SelectedJob["JobNumber"]);
        data.append("PageCount", pageCount);

        let url = MRSUrl + "/api/Jobs/UpdatePageCount";
        try {
            MyAjaxForAttachments(url,
                (data) => {
                    $(".btn-grp").show();
                    $(".pageCountLoader").hide();
                    toast("Page count has been updated!", {
                        type: toast.TYPE.SUCCESS
                    });
                    $("#pageCountModal").modal("hide");
                    this.setState({ SelectedJob: null, PageCountModalShow: false });
                    this.GetTeamJobs();
                },
                (error) => {
                    toast("An error occoured, please try again!", {
                        type: toast.TYPE.ERROR,
                        autoClose: false
                    });
                    $(".btn-grp").show();
                    $(".pageCountLoader").hide();
                },
                "POST",
                data
            );
        }
        catch (e) {
            toast("An error occoured, please try again!", {
                type: toast.TYPE.ERROR
            });
            $(".btn-grp").show();
            $(".pageCountLoader").hide();
            return false;
        }
    }

    DownloadActualFile(cell, row) {
        // var firstFileName = row["Filenames"][0];
        // var jobName = firstFileName.length < 15 ? firstFileName : firstFileName.substring(0, 15) + "...";
        var filenames = row["Filenames"].join();
        return (
            <a style={{ cursor: 'pointer' }} title={filenames} onClick={() => { this.GetFile(row["OriginalFileName"]) }} target="blank"> {filenames} </a>
        )
    }

    MRADataFormater(cell, row) {
        if (row["MRAUrl"] != null) {
            return (
                <a style={{ cursor: 'pointer' }} onClick={() => { this.GetFile(row["MRAUrl"]) }}>{row["MRA"]} </a>
            )
        }
        else {
            return (
                <p>{row["MRA"]}</p>
            )
        }
    }

    AQADataFormater(cell, row) {
        if (row["AQAUrl"] != null) {
            return (
                <a style={{ cursor: 'pointer' }} title={row["AQAUrl"]} onClick={() => { this.GetFile(row["AQAUrl"]) }}>{row["AQA"]} </a>
            )
        }
        else {
            return (
                <p>{row["AQA"]}</p>
            )
        }
    }

    QADataFormater(cell, row) {
        if (row["QAUrl"] != null) {
            return (
                <a style={{ cursor: "pointer" }} onClick={() => { this.GetFile(row["QAUrl"]) }} >{row["QA"]}</a>
            )
        }
        else {
            return (
                <p>{row["QA"]}</p>
            )
        }
    }

    GetFile(path) {
        var url = MRSUrl + "/api/MasterData/DownloadFile?url=" + path
        window.open(url);
    }

    UploadFile(cell, row) {
        if (row["Status"] !== "Completed") {
            return (
                <a data-toggle="tooltip" className="tooltipLink" title="upload file" data-original-title="">
                    <i className='glyphicon glyphicon-cloud-upload' style={{ cursor: 'pointer', fontSize: '17px', color: 'skyblue' }} onClick={() => { this.UploadFileClick(row) }} ></i>
                </a>
            )
        }
    }

    UploadFileClick(row) {
        var firstFileName = row["Filenames"][0];
        this.setState({
            UploadFileClick: true, JobNumber: row["JobNumber"], ClientId: row["ClientId"],
            ClientName: row["ShortName"], JobName: firstFileName
        }, () => {
            $("#uploadFile").modal('show');
        })
    }

    DateFormatter(cell, row) {
        return (
            <p> {moment(row["JobDate"]).format("MM/DD/YYYY")} </p>
        )
    }

    CommentFormater(cell, row) {
        return <span className="fa fa-list pointer" onClick={() => this.OpenCommentsModal(row)}></span>
    }

    OpenCommentsModal(row) {
        this.setState({ SelectedJob: row, CommentModalShow: true }, () => {
            $("#commentModal").modal("show");
        });
    }

    SubmitComment() {
        var comment = this.refs.commentInput.value;
        if (!comment) {
            showErrorsForInput(this.refs.commentInput, ["Please enter a value"]);
            return;
        }
        else {
            showErrorsForInput(this.refs.commentInput, [""]);
        }

        $(".btn-grp").hide();
        $(".pageCountLoader").show();
        var data = new FormData();
        data.append("JobNumber", this.state.SelectedJob["JobNumber"]);
        data.append("Comment", comment);
        data.append("CommentBy", sessionStorage.getItem("displayName"));

        let url = MRSUrl + "/api/Jobs/AddCommentToJob";
        try {
            MyAjaxForAttachments(url,
                (data) => {
                    $(".btn-grp").show();
                    $(".pageCountLoader").hide();
                    toast("Comment has been added!", {
                        type: toast.TYPE.SUCCESS
                    });
                    $("#commentModal").modal("hide");
                    this.setState({ SelectedJob: null, CommentModalShow: false });
                    this.GetTeamJobs();
                },
                (error) => {
                    toast("An error occoured, please try again!", {
                        type: toast.TYPE.ERROR,
                        autoClose: false
                    });
                    $(".btn-grp").show();
                    $(".pageCountLoader").hide();
                },
                "POST",
                data
            );
        }
        catch (e) {
            toast("An error occoured, please try again!", {
                type: toast.TYPE.ERROR
            });
            $(".btn-grp").show();
            $(".pageCountLoader").hide();
            return false;
        }
    }

    AllocateJobFormatter(cell, row) {
        if (row.Status != "Completed") {
            return (

                <a data-toggle="tooltip" className="tooltipLink" title="Allocate Job" data-original-title="Allocate JOb" >
                    <i className='glyphicon glyphicon-pencil' style={{ cursor: 'pointer', fontSize: '17px', color: 'black' }}
                        onClick={() => { this.gotoAllocateJob(row["JobId"], row["JobNumber"], row["EndPage"], row["JobDate"], row["ShortName"], row["DoctorName"], row["JobLevel"], row["DefaultTAT"], row["Status"]) }}
                    ></i>
                </a>
            )
        }
        else {
            return "";
        }
    }

    gotoAllocateJob(JobId, JobNumber, EndPage, JobDate, ShortName, DoctorName, JobLevel, DefaultTAT, Status) {

        var jobDetails = this.state.JobDetails;
        jobDetails["JobId"] = JobId;
        jobDetails["JobNumber"] = JobNumber;
        jobDetails["JobDate"] = JobDate;
        jobDetails["Client"] = ShortName;
        if (JobLevel == null) {
            jobDetails["JobLevel"] = "L1"
        }
        else {
            jobDetails["JobLevel"] = JobLevel;
        }
        jobDetails["Doctor"] = DoctorName;
        jobDetails["DefaultTAT"] = DefaultTAT;
        jobDetails["TAT"] = DefaultTAT;
        jobDetails["TotalPages"] = EndPage;
        jobDetails["Status"] = Status;


        this.setState({ JobDetails: jobDetails, AllocateJobClick: true }, () => {
            $("#AllocateJob").modal('show');
        })

    }

    SplitJobFormatter(cell, row) {
        if (row["Status"] === "Pending") {
            return (
                <a data-toggle="tooltip" className="tooltipLink" title="Split Job" data-original-title="Split Job">
                    <i className='glyphicon glyphicon-resize-full' style={{ cursor: 'pointer', fontSize: '17px', color: 'black' }}
                        onClick={() => { this.gotoSplitJob(row["JobId"], row["JobNumber"], row["EndPage"], row["ShortName"], row["JobLevel"], row["Status"], row["TAT"]) }}
                    ></i>
                </a>
            )
        }
        else {
            return "";
        }
    }

    gotoSplitJob(JobId, JobNumber, EndPage, Client, JobLevel, Status, TAT) {
        this.props.history.push({
            state: {
                JobId: JobId,
                JobNumber: JobNumber,
                TotalPages: EndPage,
                Client: Client,
                JobLevel: JobLevel,
                Status: Status,
                TAT: TAT
            },
            pathname: "/SplitJob"
        })
    }

    search() {
        // this.setState({ searchClick: !this.state.searchClick })]
        this.setState({ searchClick: false })
    }

    ClientChanged(val) {

    }
}

export default JobAllocations;
