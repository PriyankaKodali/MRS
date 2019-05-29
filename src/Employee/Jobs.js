import React, { Component } from "react";
import $ from "jquery";
import "./Employee.css";
import { MRSUrl } from "../Config";
import { MyAjaxForAttachments } from "../MyAjax";
import QAJobs from "./QAJobs";
import AQAJobs from "./AQAJobs";
import MRAJobs from "./MRAJobs";
import {showErrorsForInput} from '../Validation.js';
import {toast} from 'react-toastify';

var moment = require("moment");
// var ReactBSTable = require("react-bootstrap-table");
// var BootstrapTable = ReactBSTable.BootstrapTable;
// var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

class Jobs extends Component {
  constructor(props) {
    super(props);
    var details={};
    var jobDetails={JobWorkId:null,JobNumber:'', JobLevel:'', JobWorkLevel: ''}
    this.state = {
      currentPage: 1,
      sizePerPage: 10,
      dataTotalSize: 0,
      dowloadFileClick: false,
      IsDataAvailable: false,
      fileUpload: false,
      JobDetails:jobDetails,
    }
  }

  handleJobSelected(jobDetails){
    var jobWorkDetails= this.state.JobDetails;

      jobWorkDetails["JobWorkId"] = jobDetails["JobWorkId"];
      jobWorkDetails["JobNumber"] = jobDetails["JobNumber"];
      jobWorkDetails["JobLevel"] = jobDetails["JobLevel"]
      jobWorkDetails["JobWorkLevel"] = jobDetails["JobWorkLevel"];
   
      this.refs.fileupload.value = "";
      showErrorsForInput(this.refs.fileupload, null);

      this.setState({JobDetails: jobWorkDetails},()=>{
           $("#uploadJob").modal('show');
      })
  }

  render() {
    return (
      <div>
        <MRAJobs  selectedJob={this.handleJobSelected.bind(this)} />
        <AQAJobs selectedJob={this.handleJobSelected.bind(this)} />
        <QAJobs selectedJob={this.handleJobSelected.bind(this)} />

        <div className="modal fade"  id="uploadJob" role="dialog" data-keyboard="false" data-backdrop="static" key={this.state.JobDetails} >
            <div className="modal-dialog modal-lg" style={{ width: '1080px' }} >
              <div className="modal-content">
                 <div className="modal-header " style={{ background: '#f5f3f3', borderBottom: '0px solid' }}>
                      <button type="button" className="modelClose btnClose" data-dismiss="modal" id="closeModal"> &times; </button>
                       <h4 className="modal-title">
                        <p className="modalHeading">Upload File </p>  </h4>
                  </div>

                   <div className="modal-body col-xs-12" key={this.state.AddNewModel}>
                            <div className="col-xs-12">
                                 <div className="col-xs-3"> <label>Job Number</label>
                                     <input className="form-control" ref="jobNUmber" type="text" placeholder="Job Number" value={this.state.JobDetails["JobNumber"]} />
                                   </div>
                                  <div className="col-xs-4">
                                     <label>File</label>
                                      <div className="form-group">
                                        <div className="input-group">
                                           <input  type="file" className="form-control" name="fileupload" ref="fileupload" />
                                         </div>
                                       </div>
                                  </div>
                             </div>
                            <div className="col-xs-12" style={{ marginTop: "2%" }}>
                               <div className="col-sm-3">
                                   <div className="loader loaderActivity docSubmit"  style={{ marginLeft: "180%" }} />
                                      <button type="button" name="submit" className="btn btn-success" style={{ marginLeft: "180%" }} onClick={this.handleSubmit.bind(this)} > Submit  </button>
                                     </div>
                            </div>
                        
                     </div>
                       <div className="modal-footer"> </div>
                 </div>
               </div>
              </div>
          </div>
    );
  }

  handleSubmit(){
    $(".loader").show();
    $("button[name='submit']").hide();

   var files= this.refs.fileupload.files;

   if(files.length!=0)
   {
      if($.inArray(files[0].name.split('.').pop().toLowerCase(),["pdf","doc","docx", "xlsx","csv","txt","jpg", "jpeg", "png"])==-1){
          showErrorsForInput(this.refs.fileupload, ["Supported formats : pdf|doc|docx|xlsx|txt|jpg | jpeg | png"]);
          $(".loader").hide();
          $("button[name='submit']").show();
          return;
      }
      
      if(files[0].name.split('.')[0] !== this.state.JobDetails["JobNumber"])
      {
          showErrorsForInput(this.refs.fileupload,["File name should match job number"]);
          $(".loader").hide();
          $("button[name='submit']").show();
          return;
      }
   }
   else{
       showErrorsForInput(this.refs.fileupload, ["Please select a file for upload"]);
       $(".loader").hide();
       $("button[name='submit']").show();
       return;
   } 
  
   var jobLevel= this.state.JobDetails.JobLevel;
   var jobWorkLevel= this.state.JobDetails.JobWorkLevel;

   var data= new FormData();
   
   if(jobLevel== "L1-L3")
   {
     if(jobWorkLevel=="QA"){
      data.append("IsFinalUpload", true);
     }
     else{
      data.append("IsFinalUpload", false);
     }
   }
   else if(jobLevel== "L1-L2-L3")
   {
    if(jobWorkLevel=="QA"){
     data.append("IsFinalUpload", true);
    }
    else{
     data.append("IsFinalUpload", false);
    }
   }
   else{
    data.append("IsFinalUpload", true);
   }

   data.append("file", this.refs.fileupload.files[0]); 
   data.append("JobDetails", JSON.stringify(this.state.JobDetails));

   let url=MRSUrl + "/api/Jobs/UploadTranscriptFile"

   try{
   MyAjaxForAttachments(
     url,
      (data)=>{
         toast("You have uploaded file successfully",{
          type:toast.TYPE.SUCCESS
         });
         $(".loader").hide();
         $("button[name='submit']").show();
      },
      (error)=>{
        toast("An error occoured, please try again!", {
            type: toast.TYPE.ERROR,
            autoClose: false
        });
        $(".loader").hide();
        $("button[name='submit']").show();
    },
     "POST",
     data
    )
   }
   catch(error){
    toast("An error occured, please try again!",{
      type: toast.TYPE.ERROR,
      autoClose: false
    })
   }

  }
}

export default Jobs;
