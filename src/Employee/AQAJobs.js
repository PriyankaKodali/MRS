import React, {Component} from 'react';
import $ from 'jquery';
import {MRSUrl} from '../Config';


var moment= require('moment');
var ReactBSTable= require('react-bootstrap-table');
var BootstrapTable= ReactBSTable.BootstrapTable;
var TableHeaderColumn= ReactBSTable.TableHeaderColumn;


class AQAJobs extends Component{
    
    constructor(props){
        super(props);
        this.state={
            AQAJobs:[], IsDataAvailable: true, dataTotalSize:1, currentPage:1, sizePerPage:10
        }
    }
   
    componentWillMount(){
        this.GetQAJobs();
    }

    GetQAJobs(){
        // $.ajax({
        //     url: MRSUrl + "/api/Jobs/GetAQAJobs?empNum=" + sessionStorage.getItem("userName"),
        //     type: "get",
        //     success: (data) => { this.setState({ AQAJobs: data["AQAJobs"] }) }
        // });

    }

    render(){
        return(
            <div className="empJobsHeader">
            <div className="row">
                <div className="col-md-12">
                    <strong className="empJobsHeader">  AQA Jobs  </strong>
                    <span className="job-summary-strip teal500">
                        <span >Pending  |   </span>
                        <span>Completed  | </span>
                        <span>Total   | </span>
                    </span>

                    <span className="job-summary-strip pink">
                        <span> {'<'} 18 |</span>
                        <span> > 18 </span>
                    </span>
                </div>
            </div>
             
             <div key={this.state.QAJobs}>
                   <BootstrapTable striped hover remote={true} data={this.state.QAJobs} >
                        <TableHeaderColumn dataField="JobDate" isKey={true} width="20" dataAlign="center" dataFormat={this.JobDateFormat.bind(this)} > Date </TableHeaderColumn>
                        <TableHeaderColumn dataField="JobNumber" dataAlign="center" width="25" dataFormat={this.getOriginalFile.bind(this)} > Job Number</TableHeaderColumn>
                        <TableHeaderColumn dataField="Pages" width="20" dataAlign="center">No.of pages </TableHeaderColumn>
                        <TableHeaderColumn dataField="ShortName" width="25" > Client </TableHeaderColumn>
                        <TableHeaderColumn dataField="DoctorName" width="35" > Doctor </TableHeaderColumn>
                        <TableHeaderColumn dataField="MRA" width="20" dataFormat={this.MRADataFormatter.bind(this)} >MRA</TableHeaderColumn>
                        <TableHeaderColumn dataField="QA" width="20" dataFormat={this.QADataFormatter.bind(this)}> AQA </TableHeaderColumn>
                        <TableHeaderColumn dataField="DefaultTAT" dataAlign="center" width="20" >TAT </TableHeaderColumn>
                        <TableHeaderColumn columnClassName="download" dataField="Download" width='10' dataFormat={this.uploadFormatter.bind(this)}></TableHeaderColumn>
                        <TableHeaderColumn dataField="DT" width="20" dataAlign="center" dataFormat={this.DTFormatter.bind(this)} > DT </TableHeaderColumn>
                        <TableHeaderColumn dataField="UT" width="20" dataAlign="center" > UT </TableHeaderColumn>
                        <TableHeaderColumn dataField="Lines" width="20"  > Lines </TableHeaderColumn>
                    </BootstrapTable>

             </div>


        </div>
        )
    }
    JobDateFormat(cell, row) {
        return (
            <p>  {moment(row["JobDate"]).format("MM-DD-YYYY")} </p>
        )
    }

    MRADataFormatter(cell, row){
        if(row["MRAUrl"]!==null)
        {
            return (
                <a  onClick={()=>{this.DownloadFile(row["MRAUrl"]),()=>{
                    if(row["DT"] == null){
                        this.updateDT(row["JobWorkId"])
                    }
                }}} > {row["MRA"]}</a>
            )
        }
        else{
            return(
                <p>{row["MRA"]}</p>
            )
        }
    }

    QADataFormatter(cell, row){
        if(row["AQAUrl"] !==null){
            return(
                <a onClick={()=>{this.DownloadFile(row["AQAUrl"])}}> {row["AQA"]}</a>
            )
        }
    }

    getOriginalFile(cell, row)
    {
        return(
            <a  target="_blank" style={{cursor: 'pointer'}} title={row["OriginalFileName"]} onClick={()=>{this.DownloadFile(row["OriginalFileName"])}}> {row["JobNumber"]}</a>
        )
    }

    DownloadFile(fileurl){
        var url= MRSUrl+ "/api/MasterData/DownloadFile?url=" + fileurl
        window.open(url);
    }

    updateDT(jobworkId){
        $.ajax({
            url: MRSUrl + "/api/Jobs/UpdateJobWork?jobWorkId=" + jobworkId,
            type: "post",
            success: (data) => {
                var jobWorks = this.state.MRAJobs;
                var jobWork= jobWorks.findIndex((job)=>job.JobWorkId== jobworkId);
                if(jobWork!==-1){
                    jobWorks[jobWork]["DT"] == moment().format("h:mm a")
                    this.setState({QAJobs: jobWorks});
                }
            }
        })
    }

    uploadFormatter(cell, row) {
        if (row.DT != null) {
            return (
                <a data-toggle="tooltip" className="tooltipLink" title="Upload File" data-original-title="Upload File" data-toggle="modal" data-target="#uploadFileOrFolder" >
                    <i className='glyphicon glyphicon-cloud-upload' headerText='Upload File' style={{ cursor: 'pointer', fontSize: '17px' }}
                    ></i>
                </a>
            )
        }
        return "";
    }

    DTFormatter(cell,row){
        if(row["DT"]!==null){
            return(
                <p> {moment(row["DT"]).format("h:mm a")} </p>
            )
        }
    }
}

export default AQAJobs;

// onClick={() => { this.uplaodJobClick(row["JobNumber"]) }}