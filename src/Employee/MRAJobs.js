import React, {Component} from 'react';
import $ from 'jquery';
import {MRSUrl} from '../Config';


var moment= require('moment');
var ReactBSTable= require('react-bootstrap-table');
var BootstrapTable= ReactBSTable.BootstrapTable;
var TableHeaderColumn= ReactBSTable.TableHeaderColumn;


class MRAJobs extends Component{
    
    constructor(props){
        super(props);
        this.state={
            MRAJobs:[], IsDataAvailable: true, dataTotalSize:1, currentPage:1, sizePerPage:10,
            JobDetails:{JobWorkId:null,JobNumber:'', JobLevel: '', JobWorkLevel: ''}
        }
    }
   
    componentWillMount(){
        this.GetMRAJobs();
    }

    GetMRAJobs(){
        // $.ajax({
        //     url: MRSUrl + "/api/Jobs/GetMRAJobs?empNum=" + sessionStorage.getItem("userName"),
        //     type: "get",
        //     success: (data) => { this.setState({ MRAJobs: data["MRAJobs"] }) }
        // });
    }

    render(){
        return(
            <div className="empJobsHeader">
            <div className="row">
                <div className="col-md-12">
                    <strong className="empJobsHeader">  MRA Jobs  </strong>
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
             
             <div key={this.state.MRAJobs}>
                   <BootstrapTable striped hover remote={true} data={this.state.MRAJobs} >
                        <TableHeaderColumn dataField="JobDate" isKey={true} width="20" dataAlign="left" dataFormat={this.JobDateFormat.bind(this)} > Date </TableHeaderColumn>
                        <TableHeaderColumn dataField="JobNumber" dataAlign="center" width="25" dataFormat={this.getOriginalFile.bind(this)} > Job Number</TableHeaderColumn>
                        <TableHeaderColumn dataField="Pages" width="20" dataAlign="center" >No.of pages </TableHeaderColumn>
                        <TableHeaderColumn dataField="ShortName" width="25" dataAlign="left" > Client </TableHeaderColumn>
                        <TableHeaderColumn dataField="DoctorName" width="35" dataAlign="left" > Doctor </TableHeaderColumn>
                        <TableHeaderColumn dataField="AQA" width="20" dataAlign="left" >AQA </TableHeaderColumn>
                        <TableHeaderColumn dataField="QA" width="20" dataAlign="left"  > QA </TableHeaderColumn>
                        <TableHeaderColumn dataField="DefaultTAT" width="20" dataAlign="center"> TAT </TableHeaderColumn>
                        <TableHeaderColumn columnClassName="download" dataField="Download" width='10' dataFormat={this.uploadFormatter.bind(this)}></TableHeaderColumn>
                        <TableHeaderColumn dataField="DT" width="20" dataAlign="center" dataFormat={this.DTFormatter.bind(this)}  > DT </TableHeaderColumn>
                        <TableHeaderColumn dataField="UT" width="20" dataAlign="center" dataFormat={this.UTFormatter.bind(this)} > UT </TableHeaderColumn>
                        <TableHeaderColumn dataField="Lines" dataAlign="center" width="20"> Lines </TableHeaderColumn>
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

    DTFormatter(cell,row){
        if(row["DT"]!=null)
        {
            return(
                <p> {moment(row["DT"]).format("h:mm a")}</p>
            )
        }
    }

    UTFormatter(cell,row){
        if(row["UT"]!=null)
        {
            return(
                <p>{moment(row["UT"]).format("h:mm a")}</p>
            )
        }
    }


    AQADataFormatter(cell, row){
        if(row["AQAUrl"] !==null){
            return(
                <a onClick={()=>{this.DownloadFile(row["AQAUrl"])}}> {row["AQA"]}</a>
            )
        }
    }

    getOriginalFile(cell, row)
    {
        return(
            <a  target="_blank" style={{cursor: 'pointer'}} title={row["OriginalFileName"]} onClick={()=>{this.DownloadFile(row["OriginalFileName"], row["JobWorkId"], row["DT"])}}> {row["JobNumber"]}</a>
        )
    }

    DownloadFile(path, jobworkId, DT){
        var url= MRSUrl+ "/api/MasterData/DownloadFile?url=" + path
        window.open(url);
        if(DT==null)
        {
            this.updateDT(jobworkId);
        }
    }

    updateDT(jobworkId){
        $.ajax({
            url: MRSUrl + "/api/Jobs/UpdateJobWork?jobWorkId=" + jobworkId,
            type: "post",
            success: (data) => {
                var jobWorks = this.state.MRAJobs;
                var jobWork= jobWorks.findIndex((job)=>job.JobWorkId== jobworkId);
                if(jobWork!==-1){
                    jobWorks[jobWork]["DT"] = moment().format("h:mm a");
                    this.setState({MRAJobs: jobWorks});
                }
            }
        })
    }
    

    uploadFormatter(cell, row) {
        if (row.DT != null) {
            return (
                <a data-toggle="tooltip" className="tooltipLink" title="Upload File" data-original-title="Upload File" data-toggle="modal" 
                    data-target="#uploadFileOrFolder"  onClick={()=>{this.UploadFileClick(row["JobWorkId"], row["JobWorkLevel"], row["JobLevel"], row["JobNumber"])}}  >
                    <i className='glyphicon glyphicon-cloud-upload' headerText='Upload File' style={{ cursor: 'pointer', fontSize: '17px' }}>
                    </i>
                </a>
            )
        }
        return "";
    }

    UploadFileClick( jobWorkId, JobWorkLevel, JobLevel, JobNumber){
  //  var jobDetails={JobId:jobId, JobLevel: JobLevel, JobWorkLevel: JobWorkLevel};
      var jobDetails= this.state.JobDetails;
      jobDetails.JobWorkId = jobWorkId;
      jobDetails.JobLevel = JobLevel;
      jobDetails.JobWorkLevel= JobWorkLevel;
      jobDetails.JobNumber= JobNumber;

      this.setState({JobDetails: jobDetails},()=>{
        this.props.selectedJob(jobDetails);
      })
     
    }

    DTFormatter(cell,row){
        if(row["DT"]!==null){
            return(
                <p> {moment(row["DT"]).format("h:mm a")} </p>
            )
        }
    }
}

export default MRAJobs;

// onClick={() => { this.uplaodJobClick(row["JobNumber"]) }}