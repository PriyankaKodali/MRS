import React, { Component } from 'react';
import $ from 'jquery';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import './ClientDashboard.css';
import { ApiUrl, MRSUrl } from '.././Config';
import { toast } from 'react-toastify';
import { MyAjaxForAttachments } from '../MyAjax';
import { showErrorsForInput } from '../Validation';

var moment = require('moment');
var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

class ClientDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1, sizePerPage: 10, dataTotalSize: 1,
            fromDate: moment().subtract(7, "days").format("YYYY-MM-DD"),
            searchClick: false,
            toDate: moment().format("YYYY-MM-DD"),
            UploadedJobs: [], Doctors: [], Doctor: null,
            JobNumber: '',
            sortCol: 'Date',
            sortDir: 'asc',
            Status: '',
            format: "YYYY-MM-DD",
            inputFormat: "DD/MM/YYYY", IsDataAvailable: false,
            SelectedJob: null,
            CommentModalShow: false
        }
    }

    componentDidUpdate() {
        $(".my-tooltip").popover();
    }


    componentWillMount() {
        $.ajax({
            url: MRSUrl + "/api/MasterData/GetDoctors?ClientId=" + sessionStorage.getItem("empId"),
            type: "get",
            success: (data) => { this.setState({ Doctors: data["doctors"] }) }
        })
        this.getClientEmployeeUploads(this.state.currentPage, this.state.sizePerPage);
    }

    getClientEmployeeUploads(page, count) {

        var url = MRSUrl + "/api/Jobs/GetUploadedFiles?userName=" + sessionStorage.getItem("userName") +
            "&fromDate=" + moment(this.state.fromDate).format("YYYY-MM-DD") +
            "&toDate=" + moment(this.state.toDate).add(1, "days").format("YYYY-MM-DD") +
            "&doctorId=" + this.state.Doctor +
            "&jobNumber=" + this.state.JobNumber +
            "&status=" + this.state.Status +
            "&page=" + page +
            "&count=500&sortCol=" + this.state.sortCol +
            "&sortDir=" + this.state.sortDir;

        $.ajax({
            url: url,
            type: "get",
            success: (data) => {
                this.setState({
                    UploadedJobs: data["clientUploadsList"],
                    IsDataAvailable: true, dataTotalSize: data["totalcount"]
                })
            }
        })
    }

    render() {
        return (
            <div style={{ marginTop: '50px' }}>

                <div className="text-center">
                    <button type="button" name="submit" className="btn btn-md btn-success uploadFiles" onClick={() => this.props.history.push("/UploadFiles/")}>
                        Upload Files
                    </button>
                </div>

                <div style={{ backgroundColor: "#20b2aa", width: "100%", height: "50px", padding: "0 15px" }}>
                    <h3 className="myformheader pull-left">Uploaded Files</h3>
                    <div className="mybutton pull-right">
                        <button type="button" className="btn btn-default pull-left headerbtn" onClick={() => { this.setState({ searchClick: !this.state.searchClick }) }} >
                            <span className="glyphicon glyphicon-chevron-down"></span>
                        </button>
                    </div>
                </div>

                {
                    this.state.searchClick ?
                        <div className="col-xs-12 mySearch" style={{ paddingLeft: '10px' }}>

                            <div className="col-sm-2 form-group">
                                <label style={{ textAlign: "left" }}> From Date</label>
                                <DatePicker className="form-control col-md-3" name="fromDate" ref="fromDate" defaultValue={moment(this.state.fromDate)} selected={moment(this.state.fromDate)} onChange={(val) => this.setState({ fromDate: moment(val).format("YYYY-MM-DD") }, () => { this.getClientEmployeeUploads(this.state.currentPage, this.state.sizePerPage) })} />
                            </div>

                            <div className="col-sm-2 form-group">
                                <label>To Date</label>
                                <DatePicker className="form-control" name="toDate" ref="toDate" defaultValue={moment(this.state.toDate)} selected={moment(this.state.toDate)} onChange={(val) => this.setState({ toDate: val }, () => { this.getClientEmployeeUploads(this.state.currentPage, this.state.sizePerPage) })} />
                            </div>
                            {/* <div className="col-sm-2 form-group">
                                <label>Job Number</label>
                                <input className="form-control" placeholder="Job Number" name="jobNumber" ref="jobNumber" onChange={this.search.bind(this)} />
                            </div> */}

                            <div className="col-sm-2 form-group">
                                <label>Status</label>
                                <Select className="form-control" name="status" placeholder="Status" value={this.state.Status}
                                    options={[{ value: 'Completed', label: 'Completed' }, { value: 'In Process', label: 'In Process' }]}
                                    onChange={this.StatusChanged.bind(this)}
                                />
                            </div>

                            <div className="col-sm-2 form-group clntEmpButton">
                                <button type="button" name="submit" className="btnLeft btn btn-default" onClick={this.clearClick.bind(this)} > Clear </button>
                            </div>
                        </div>
                        :
                        <div />
                }

                <div className="clearfix"> </div>
                {
                    this.state.IsDataAvailable ?
                        <div className="col-xs-12 btstrap">
                            <BootstrapTable ref="clientEmployeestable" striped hover remote={true}
                                data={this.state.UploadedJobs}
                                trClassName={this.jobColorSetter}>
                                <TableHeaderColumn dataField="UploadedDate" isKey={true} width="12" dataAlign="center" dataSort={true} dataFormat={this.JobDateFormat.bind(this)} > Date </TableHeaderColumn>
                                <TableHeaderColumn dataField="JobNumber" dataSort={true} width="50" dataFormat={this.getUploadedFile.bind(this)} > Job Name</TableHeaderColumn>
                                <TableHeaderColumn dataField="DoctorName" dataSort={true} width="20"> Doctor </TableHeaderColumn>
                                <TableHeaderColumn dataField="JobType" dataAlign="center" dataSort={true} width="15" dataFormat={this.JobTypeFormatter.bind(this)} >Job Type</TableHeaderColumn>
                                <TableHeaderColumn dataField="TotalPages" width="15" dataAlign="center" dataSort={true}>No. of pages </TableHeaderColumn>
                                <TableHeaderColumn dataField="Status" width="15" dataSort={true} > Status </TableHeaderColumn>
                                <TableHeaderColumn columnClassName="Comments" width="10" dataAlign="center" dataFormat={this.CommentFormater.bind(this)} > </TableHeaderColumn>
                                <TableHeaderColumn columnClassName="download" dataField='Download' dataFormat={this.downloadFormatter.bind(this)} width='5'></TableHeaderColumn>
                            </BootstrapTable>
                        </div>
                        :
                        < div className="loader visible" ></div >

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
                                                    <td><b>Job Name</b></td><td>{this.state.SelectedJob["FileName"].split(',')[0]}</td>
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
        );
    }

    jobColorSetter(row, rowInx) {
        if (row) {
            if (row["Status"] == "Completed") {
                return "JobCompleted";
            }
            else {
                return "JobPending";
            }
        }
    }

    JobTypeFormatter(cell, row) {
        var filelements = row["FileName"].split(",").length - 1;
        return (
            <p title={row["JobType"]}> {(row["JobType"] === "Single" ? "S" : "M") + '(' + filelements + ')'}</p>
        )
    }

    getUploadedFile(cell, row) {
        return (
            <a style={{ cursor: 'pointer' }} title={row["FileName"]} onClick={() => { this.GetFile(row["ClientFilePath"]) }}>{row["FileName"]} </a>
        )
    }

    GetFile(path) {
        var url = MRSUrl + "/api/MasterData/DownloadFile?url=" + path
        window.open(url);
    }

    JobDateFormat(cell, row) {
        return (
            <p>  {moment(row["UploadedDate"]).format("MM-DD-YYYY")} </p>
        )
    }

    downloadFormatter(cell, row) {
        if (row["CompletedFileUrl"] != null) {
            return (
                <a data-toggle="tooltip" className="tooltipLink" title="Download file" data-original-title="">
                    <i className='glyphicon glyphicon-cloud-download' title='Download file' style={{ cursor: 'pointer', fontSize: '17px', color: 'green' }} onClick={() => { this.GetFile(row["CompletedFileUrl"]) }} ></i>
                </a>
            )
        }
    }

    DoctorChange(val) {
        if (val != null) {
            this.setState({ Doctor: val.value }, () => {
                this.getClientEmployeeUploads(this.state.currentPage, this.state.sizePerPage);
            })
        }
        else {
            this.setState({ Doctor: '' }, () => {
                this.getClientEmployeeUploads(this.state.currentPage, this.state.sizePerPage);
            })
        }
    }

    StatusChanged(val) {

        if (val != null) {
            this.setState({ Status: val.value }, () => {
                this.getClientEmployeeUploads(this.state.currentPage, this.state.sizePerPage);
            })
        }
        else {
            this.setState({ Status: '' }, () => {
                this.getClientEmployeeUploads(this.state.currentPage, this.state.sizePerPage);
            })
        }
    }

    handleChangeDate(date) {
        this.setState({ fromDate: date });
    }

    search() {

        this.setState({ jobNumber: this.refs.jobNumber.value }, () => {
            this.getClientEmployeeUploads(this.state.currentPage, this.state.sizePerPage);
        })
    }

    clearClick() {

        this.state.fromDate = moment().subtract(7, "days").format("MM-DD-YYYY"),
            this.state.toDate = moment().format("MM-DD-YYYY"),
            this.setState({
                fromDate: this.state.fromDate,
                toDate: this.state.toDate,
                Status: '', jobNumber: '', Doctor: ''
            }, () => this.getClientEmployeeUploads(this.state.currentPage, this.state.sizePerPage))
    }

    onSortChange(sortCol, sortDir) {
        sortDir = this.state.sortCol === sortCol && this.state.sortDir === "asc" ? "desc" : "asc";
        this.setState({
            sortCol: sortCol,
            sortDir: sortDir
        }, () => {
            this.getClientEmployeeUploads(this.state.currentPage, this.state.sizePerPage);
        });
    }

    onPageChange(page, sizePerPage) {
        this.getClientEmployeeUploads(page, sizePerPage);
    }

    onSizePerPageList(sizePerPage) {
        this.getClientEmployeeUploads(this.state.currentPage, sizePerPage);
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
                    this.getClientEmployeeUploads(this.state.currentPage, this.state.sizePerPage);
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

}

export default ClientDashboard