import React, { Component } from 'react';
import $ from 'jquery';
import './ClientDashboard.css';
import { ApiUrl, MRSUrl } from '.././Config';
import { ValidateForm, showErrorsForInput, setUnTouched, showErrors } from '../Validation';
import Select from 'react-select';
import { MyAjaxForAttachments, MyAjax } from '../MyAjax.js';
import { toast } from 'react-toastify';

window.jQuery = window.$ = require("jquery");
var bootstrap = require('bootstrap');
var merge = require('easy-pdf-merge');


class UploadFiles extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Doctors: [],
            Doctor: null,
            UploadType:'',
            
        }
    }

    // job number , job type single or merged, doctor name , status in process by default

    componentWillMount() {
        $.ajax({
            url: MRSUrl + "/api/MasterData/GetDoctors?ClientId=" + sessionStorage.getItem("empId"),
            type: "get",
            success: (data) => { this.setState({ Doctors: data["doctors"] }) }
        })
    }

    componentDidMount() {
     
        $("#input-id").fileinput({
            theme: "explorer",
            hideThumbnailContent: true,
            uploadUrl: ApiUrl + "/api/Task/UploadFiles",
            uploadAsync: true,
            overwriteInitial: false,
            initialPreviewAsData: true,
            showCancel: false,
            showRemove: false,
            showUpload: false,
            minFileCount: 1,
            fileActionSettings: {
                showUpload: false,
                showRemove: true
            }
        }).on("filebatchpreupload", function (event, data) {
                var form = data.form, files = data.files
                this.uploadFile(files)
            }.bind(this))
    }


    render() {
        return (
            <div  style={{ marginTop: '60px' }} >

                <form onSubmit={this.handleSubmit.bind(this)}  id="filesUpload">
                    <div className="col-xs-12">
                     <label>Doctor</label>
                        <div className="form-group">
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <span className="glyphicon glyphicon-user"></span>
                                </span>
                                <Select className="form-control" name="doctor" ref="doctor" placeholder="Select Doctor" value={this.state.Doctor} options={this.state.Doctors} onChange={this.onDoctorChanged.bind(this)} />
                            </div>
                        </div>
                      <br />
        
                        <div className="col-xs-12">
                            <div className="col-xs-12 form-group">
                                <input className="file" name="file[]" id="input-id" type="file" ref="Upldfiles" data-preview-file-type="any"  multiple />
                            </div>
                        </div>

                        {/* <div>
                            <input hidden ref="clubedfile" style={{display:'none'}} type= "file" />
                        </div> */}

                        <div className="col-xs-12 text-center form-group" style={{ marginTop: '1%' }}>
                            <div className="loader" style={{ marginLeft: '50%', marginBottom: '2%' }}></div>
                            <button type="submit" name="submit" className="btn btn-primary">Upload</button>
                            <button className="btn btn-primary" type="button" name="mergefiles" style={{ marginLeft: '0.5%' }} onClick={this.MergeFiles.bind(this)}  > Merge files to a single job </button>
                        </div>

                    </div>

                </form>
            </div>
        );
    }

    onDoctorChanged(val) {
        if(val!=null)
        {
            this.setState({ Doctor: val })
            showErrorsForInput(this.refs.doctor.wrapper,null);
        }
        else{
            this.setState({ Doctor: null})
            showErrorsForInput(this.refs.doctor.wrapper, ["Please select doctor"]);
        }
    }

    MergeFiles(e){
        var files = $("#input-id").fileinput("getFileStack");
       // var fileExtensions= [];
      
        for(var i=0;i<files.length; i++)
        {
           // var extension= files[i].name.split('.').pop().toLowerCase();

            if ($.inArray(files[i].name.split('.').pop().toLowerCase(), ["pdf","doc","docx", "xlsx","csv","txt","jpg", "jpeg", "png"]) === -1) {
                showErrorsForInput(this.refs.file, ["Supported formats : pdf|doc|docx|xlsx|txt|jpg | jpeg | png"]);
              return;
            }
        }

          this.state.UploadType = "folder";

           this.handleSubmit(e);
    }

    handleSubmit(e){

        e.preventDefault();

        $(".loader").show();
        $("button[name='submit']").hide();
        $("button[name='mergefiles']").hide();
        
        var files = $("#input-id").fileinput("getFileStack");

        if(this.state.Doctors.length>0){
            if(!this.state.Doctor || !this.state.Doctor.value)
            {
                showErrorsForInput(this.refs.doctor.wrapper, ["Please select doctor"]);
    
                $(".loader").hide();
                $("button[name='submit']").show();
                $("button[name='mergefiles']").show();
                 return;
            }
        }

     if(files.length==0)
        {
            toast("Select atleast one file to upload!", {
                type: toast.TYPE.INFO
            });
            $(".loader").hide();
            $("button[name='submit']").show();
            $("button[name='mergefiles']").show();
            return;
        }

        var data = new FormData();
        var files = files;
        
        if(this.state.Doctor){
            data.append("Doctor_Id", this.state.Doctor.value);
        }
        data.append("clientId", sessionStorage.getItem("empId"));
        
        if(this.state.UploadType == "folder"){
            data.append("uploadType", "folder");
        }
        else{
            data.append("uploadType", "file");
        }
        for (var i = 0; i < files.length; i++) {
            if (files[i] != undefined) {
                data.append(files[i].filename, files[i]);
            }
        }

        let uploadUrl = MRSUrl + "/api/Jobs/AddFilesFromClientEmp"

        try {
            MyAjaxForAttachments(
                uploadUrl,
                (data) => {
                    toast("Files uploaded successfully!", {
                        type: toast.TYPE.SUCCESS
                    });
                    $(".loader").hide();
                    $("button[name='submit']").show();
                    $("button[name='mergefiles']").show();
                    this.props.history.push("../ClientDashboard");
                    return true;
                },
                (error) => {
                    toast("An error occoured, please try again!", {
                        type: toast.TYPE.ERROR,
                        autoClose: false
                    });
                    $(".loader").hide();
                    $("button[name='submit']").show();
                    $("button[name='mergefiles']").show();

                    this.props.history.push("../ClientDashboard");
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

            $("button[name='submit']").show();
            return false;
        }
    }
}

export default UploadFiles;