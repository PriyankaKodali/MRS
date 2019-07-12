import React, { Component } from 'react';
import $ from 'jquery';
import './JobAllocations.css';
import { MRSUrl } from '../Config';
import { MyAjaxForAttachments } from '../MyAjax';
import { toast } from 'react-toastify';
import { showErrorsForInput } from '../Validation';

class Upload extends Component {
    constructor(props) {

        super(props);
        this.state = {
            JobNumber: this.props.JobNumber, ClientId: this.props.ClientId, IsFolderUpload: false, IsFileUpload: false,
            JobName: this.props.JobName, Client: this.props.Client
        }
    }
    render() {
        return (
            <div key={this.props.JobNumber}>

                <form onSubmit={this.handleSubmit.bind(this)}>

                    <div className="col-xs-12">
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <td><b>Job Name</b></td><td>{this.props.JobName}</td>
                                </tr>
                                <tr>
                                    <td><b>Client</b></td><td>{this.props.Client}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="col-xs-12">
                            <div className="form-group" >
                                <div className="input-group col-xs-12">
                                    <input type="file" className="form-control" name="fileupload" ref="fileupload" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-12">
                        <div className="col-sm-3">
                            <div className="loader loaderActivity docSubmit" style={{ marginLeft: '180%' }}></div>
                            <button type="submit" name="submit" className="btn btn-success" style={{ marginLeft: '180%' }} > Submit </button>
                        </div>
                    </div>

                </form>
            </div>
        )
    }

    FileUploadClick() {
        this.setState({ IsFileUpload: true, IsFolderUpload: false })
    }
    FolderUploadClick() {
        this.setState({ IsFolderUpload: true, IsFileUpload: false })
    }

    handleSubmit(e) {
        e.preventDefault();

        $(".loader").show();
        $("button[name='submit']").hide();

        var data = new FormData();
        var files = this.refs.fileupload.files;

        if (files.length != 0) {
            if ($.inArray(files[0].name.split('.').pop().toLowerCase(), ["pdf", "doc", "docx", "xlsx", "csv", "txt", "jpg", "jpeg", "png"]) == -1) {
                showErrorsForInput(this.refs.fileupload, ["Supported formats : pdf|doc|docx|xlsx|txt|jpg | jpeg | png"]);
                $(".loader").hide();
                $("button[name='submit']").show();
                return;
            }
            // if(files[0].name.split('.').pop() !== this.props.JobNumber)
            // {
            //     showErrorsForInput(this.refs.fileupload,["File name should match job number"]);
            //     $(".loader").hide();
            //     $("button[name='submit']").show();
            //     return;
            // }
        }
        else {
            showErrorsForInput(this.refs.fileupload, ["Please select a file for upload"]);
            $(".loader").hide();
            $("button[name='submit']").show();
            return;
        }

        data.append("clientId", this.props.ClientId);
        data.append("file", this.refs.fileupload.files[0]);

        let url = MRSUrl + "/api/Jobs/UpdateJob?jobNumber=" + this.props.JobNumber

        try {
            MyAjaxForAttachments(url,
                (data) => {
                    toast("File Uploaded Successfully", {
                        type: toast.TYPE.SUCCESS
                    });
                    //  $(".loader").hide();
                    //  $("button[name='submit']").show();
                    this.props.closeUploadModal();
                },
                (error) => {
                    toast("An error occoured, please try again!", {
                        type: toast.TYPE.ERROR,
                        autoClose: false
                    });
                    $(".loader").hide();
                    $("button[name='submit']").show();
                },
                "POST",
                data
            );
        }
        catch (e) {
            toast("An error occoured, please try again!", {
                type: toast.TYPE.ERROR
            });
            $(".loader").hide();
            $("button[name='submit']").show();
            return false;
        }
    }
}

export default Upload;

{/*<div className="col-xs-8">
                        <div className="col-md-4 form-group" >
                            <label className="radiocontainer" >
                                <label className="radiolabel"> File Upload</label>
                                <input type="radio" name="uploadType" className="form-control folderChecked" defaultChecked={this.state.IsFileUpload} onClick={this.FileUploadClick.bind(this)} />
                                <span className="checkmark"></span>
                            </label>
                        </div>
                         <div className="col-md-4 form-group">
                            <label className="radiocontainer" >
                                <label className="radiolabel">  Folder Upload </label>
                                <input type="radio" name="uploadType" className="form-control fileChecked form-control" defaultChecked={this.state.IsFolderUpload} onClick={this.FolderUploadClick.bind(this)} />
                                <span className="checkmark"></span>
                            </label>
                         </div>
                  </div>*/}

{/* <div className="col-xs-12" key={this.state.IsFileUpload}>
                {
                    this.state.IsFileUpload ?
                    <div className="col-xs-4">
                    <input type="file" ref="file"   />

                    </div>
                    :
                    <div className="col-xs-4">
                    <input type="file" multiple  ref="file"   />
                    </div>
                }
  </div> */}