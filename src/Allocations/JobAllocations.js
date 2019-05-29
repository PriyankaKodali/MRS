import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import $ from 'jquery';
import './JobAllocations.css';
// import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import { MRSUrl } from '../Config';
import EmployeeJobAllocation  from './EmployeeJobAllocation';
import SplitJob from '../Employee/SplitJob';
import Upload from './Upload';

var moment = require('moment');
var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

function trClassFormat(row, rowIdx) {
    if (row["Status"] == "Completed") {
        return "JobCompleted";
    }
    else {
        return "";
    }

}

class JobAllocations extends Component {

    constructor(props) {
        super(props);
        var jobDetails={JobId:'', JobNumber:'',JobDate:'',Client:'',JobLevel:'',Doctor:'', DefaultTAT:'',TAT:'',TotalPages:'', Status:'',MRA:null,AQA:null,QA:null}
        this.state = {
            fromDate: moment(),
            Client: {},
            Clients: [],
            Jobs: [], IsDataAvailable: false,
            TotalPages: '',AllocateJobClick: false,
            SplitJobClick:false,
            JobDetails:jobDetails
        }
    }

    componentWillMount() {
       this.GetTeamJobs();

    }
    GetTeamJobs(){
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
                            <BootstrapTable striped hover remote={true} pagination={true}
                                data={this.state.Jobs}  trClassName={trClassFormat}
                            >
                                <TableHeaderColumn dataField="JobDate" isKey={true} dataAlign="left" dataSort={true} width="20" dataFormat={this.DateFormatter.bind(this)} > Date </TableHeaderColumn>
                                <TableHeaderColumn dataField="JobNumber" dataAlign="left" width="30" dataFormat={this.DownloadActualFile.bind(this)} > Job Number </TableHeaderColumn>
                                <TableHeaderColumn dataField="ShortName" dataAlign="left" width="20" > Client </TableHeaderColumn>
                                <TableHeaderColumn dataField="DoctorName" dataAlign="left" width="40" >Doctor</TableHeaderColumn>
                                <TableHeaderColumn dataField="JobLevel" dataAlign="left" width="25" > Job Level </TableHeaderColumn>
                                <TableHeaderColumn dataField="Pages" dataAlign="left" width="25" headerText='Number of pages'  > No.of pages </TableHeaderColumn>
                                <TableHeaderColumn dataField="MRA" dataAlign="left" width="30" dataFormat={this.MRADataFormater.bind(this)} > MRA </TableHeaderColumn>
                                <TableHeaderColumn dataField="AQA" dataAlign="left" width="30" dataFormat={this.AQADataFormater.bind(this)} > AQA </TableHeaderColumn>
                                <TableHeaderColumn dataField="QA" dataAlign="left" width="30" dataFormat={this.QADataFormater.bind(this)} > QA </TableHeaderColumn>
                                <TableHeaderColumn dataField="TAT" dataAlign="left" width="30" > TAT </TableHeaderColumn>
                                <TableHeaderColumn dataField="Status" dataAlign="left" width="25" > Status </TableHeaderColumn>
                                {/* <TableHeaderColumn columnClassName="AllocateJob" width="10" dataAlign="center" headerText="Update Job allocation" dataFormat={this.AllocateJobFormatter.bind(this)} > </TableHeaderColumn>
                                <TableHeaderColumn columnClassName="SplitJob" width="10" dataAlign="center"  dataFormat={this.SplitJobFormatter.bind(this)} > </TableHeaderColumn> */}
                                <TableHeaderColumn columnClassName="UploadFile" width="10" dataAlign="center" dataFormat={this.UploadFile.bind(this)} > </TableHeaderColumn>
                            </BootstrapTable>
                        </div>
                }

                {
                    this.state.AllocateJobClick ?
                        <div className="modal fade"  id="AllocateJob" role="dialog" data-keyboard="false" data-backdrop="static" key={this.state.UploadFileClick}>
                            <div className="modal-dialog modal-lg" style={{ width: '1080px' }} >
                                <div className="modal-content">
                                    <div className="modal-header " style={{ background: '#f5f3f3', borderBottom: '0px solid' }}>
                                        <button type="button" className="modelClose btnClose" data-dismiss="modal" id="closeModal"> &times; </button>
                                        <h4 className="modal-title">
                                            <p className="modalHeading">Allocate Job </p>
                                        </h4>
                                    </div>

                                    <div className="modal-body col-xs-12" key={this.state.JobDetails}>
                                        <EmployeeJobAllocation  JobDetails={this.state.JobDetails} closeModal={this.CloseModel.bind(this)} ref={(ref) => "allocateJob"}   />
                                    </div>

                                    <div className="modal-footer"> </div>

                                </div>
                            </div>
                        </div>
                    :
                    ""
                }

                {
                    this.state.UploadFileClick?
                     <div className="modal fade"  id="uploadFile" role="dialog" data-keyboard="false" data-backdrop="static" key={this.state.UploadFileClick}>
                            <div className="modal-dialog modal-lg" style={{ width: '1080px' }} >
                                <div className="modal-content">
                                    <div className="modal-header " style={{ background: '#f5f3f3', borderBottom: '0px solid' }}>
                                        <button type="button" className="modelClose btnClose" data-dismiss="modal" id="closeModal"> &times; </button>
                                        <h4 className="modal-title">
                                            <p className="modalHeading"> Upload Job </p>
                                        </h4>
                                    </div>

                                    <div className="modal-body col-xs-12" key={this.state.AddNewModel}>
                                        <Upload JobNumber={this.state.JobNumber} ClientId={this.state.ClientId}  closeUploadModal={this.CloseModel.bind(this)} ref={(ref) => "uploadJob"} />
                                    </div>

                                    <div className="modal-footer"> </div>

                                </div>
                            </div>
                        </div>                
                    :
                    ""
                }
            </div>
        )
    }

    CloseModel(){
    $("#closeModal").click();
    this.setState({UploadFileClick: false},()=>{
        this.GetTeamJobs();
    })
   
    }

    DownloadActualFile(cell, row) {
        return (
            <a  style={{ cursor: 'pointer' }} title={row["OriginalFileName"]}  onClick={()=>{this.GetFile(row["OriginalFileName"])}} target="blank"> {row["JobNumber"]} </a>
        )
    }

    MRADataFormater(cell,row){
        if(row["MRAUrl"]!=null){
            return(
                <a style={{cursor:'pointer'}}   onClick={()=>{this.GetFile(row["MRAUrl"])}}>{row["MRA"]} </a>
            )
        }
        else{
           return(
               <p>{row["MRA"]}</p>
           )
        }
    }

    AQADataFormater(cell,row){
        if(row["AQAUrl"]!=null){
             return(
                 <a style={{cursor:'pointer'}} title={row["AQAUrl"]}  onClick={()=>{this.GetFile(row["AQAUrl"])}}>{row["AQA"]} </a>
             )
        }
        else{
            return(
                <p>{row["AQA"]}</p>
            )
        }
    }

    QADataFormater(cell,row){
        if(row["QAUrl"]!=null){
            return(
                <a style={{cursor:"pointer"}} onClick={()=>{this.GetFile(row["QAUrl"])}} >{row["QA"]}</a>
            )
        }
        else{
            return (
                <p>{row["QA"]}</p>
            )
        }
    }

    GetFile(path){
        var url= MRSUrl+ "/api/MasterData/DownloadFile?url=" + path
        window.open(url);
    }

    UploadFile(cell, row){
        if(row["Status"]!== "Completed")
        {
            return(
                <a data-toggle="tooltip" className="tooltipLink" title="upload file" data-original-title="">
                <i className='glyphicon glyphicon-cloud-upload' style={{ cursor: 'pointer', fontSize: '17px', color: 'skyblue' }} onClick={()=>{this.UploadFileClick(row["JobNumber"], row["ClientId"])}} ></i>
            </a>
            )
        }
    }

    UploadFileClick(jobnumber, clientId)
    {
        this.setState({UploadFileClick: true, JobNumber: jobnumber, ClientId: clientId},()=>{
            $("#uploadFile").modal('show');
        })
    }

    DateFormatter(cell, row) {
        return (
            <p> {moment(row["JobDate"]).format("MM/DD/YYYY")} </p>
        )
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

      var jobDetails= this.state.JobDetails;
        jobDetails["JobId"] = JobId;
        jobDetails["JobNumber"] = JobNumber;
        jobDetails["JobDate"] = JobDate;
        jobDetails["Client"]= ShortName;
        if(JobLevel == null)
        {
            jobDetails["JobLevel"]= "L1"
        }
        else{
            jobDetails["JobLevel"]= JobLevel;
        }
        jobDetails["Doctor"] =DoctorName;
        jobDetails["DefaultTAT"]= DefaultTAT;
        jobDetails["TAT"]= DefaultTAT;
        jobDetails["TotalPages"]= EndPage;
        jobDetails["Status"] = Status;
         

        this.setState({JobDetails: jobDetails, AllocateJobClick: true},()=>{
           $("#AllocateJob").modal('show');
        })

    }

    SplitJobFormatter(cell, row) {
        if (row["Status"] === "Pending") {
            return (
                <a data-toggle="tooltip" className="tooltipLink" title="Split Job" data-original-title="Split Job">
                    <i className='glyphicon glyphicon-resize-full'  style={{ cursor: 'pointer', fontSize: '17px', color: 'black' }}
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
        this.setState({ searchClick:  false })
    }

    ClientChanged(val) {

    }


}

export default JobAllocations;
