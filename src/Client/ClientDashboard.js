import React, { Component } from 'react';
import $ from 'jquery';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import './ClientDashboard.css';
import { ApiUrl, MRSUrl } from '.././Config';

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
            "&count=" + count +
            "&sortCol=" + this.state.sortCol +
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
                            // fetchInfo={{ dataTotalSize: this.state.dataTotalSize }}
                            //  options={{
                            //     sizePerPage: this.state.sizePerPage,
                            //     onPageChange: this.onPageChange.bind(this),
                            //     sizePerPageList: [{ text: '10', value: 10 },
                            //     { text: '25', value: 25 },
                            //     { text: 'ALL', value: this.state.dataTotalSize }],
                            //     page: this.state.currentPage,
                            //     onSizePerPageList: this.onSizePerPageList.bind(this),
                            //     paginationPosition: 'bottom',
                            //     onSortChange: this.onSortChange.bind(this)
                            // }}
                            >
                                <TableHeaderColumn dataField="UploadedDate" isKey={true} width="20" dataAlign="center" dataSort={true} dataFormat={this.JobDateFormat.bind(this)} > Date </TableHeaderColumn>
                                <TableHeaderColumn dataField="JobNumber" dataSort={true} width="23" dataFormat={this.getUploadedFile.bind(this)} > Job Number</TableHeaderColumn>
                                <TableHeaderColumn dataField="DoctorName" dataSort={true} width="23" > Doctor </TableHeaderColumn>
                                <TableHeaderColumn dataField="JobType" dataAlign="center" dataSort={true} width="22" dataFormat={this.JobTypeFormatter.bind(this)} >Job Type</TableHeaderColumn>
                                <TableHeaderColumn dataField="TotalPages" width="15" dataAlign="center" dataSort={true}>No. of pages </TableHeaderColumn>
                                <TableHeaderColumn dataField="Status" width="30" dataSort={true} > Status </TableHeaderColumn>
                                <TableHeaderColumn columnClassName="download" dataField='Download' dataFormat={this.downloadFormatter.bind(this)} width='5'></TableHeaderColumn>
                            </BootstrapTable>
                        </div>
                        :
                        < div className="loader visible" ></div >

                }
            </div>
        );
    }

    JobTypeFormatter(cell, row) {
        var filelements = row["FileName"].split(",").length - 1;
        return (
            <p> {row["JobType"] + '(' + filelements + ')'}</p>
        )
    }

    getUploadedFile(cell, row) {
        var filePath = row["ClientFilePath"].split("/").pop();
        var filenames = row["FileName"].slice(0, -1);
        return (
            <a style={{ cursor: 'pointer' }} target="_blank" className="my-tooltip" data-toggle="popover" data-trigger="hover" data-content={filenames} onClick={() => { this.GetFile(row["ClientFilePath"]) }}>{row["JobNumber"]} </a>
        )
    }

    GetFile(path) {
        var url = MRSUrl + "/api/MasterData/DownloadFile?url=" + path
        window.open(url);
    }

    JobDateFormat(cell, row) {
        return (
            <p>  {moment(row["UploadedDate"]).format("MM-DD-YYYY h:mm a")} </p>
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

}

export default ClientDashboard