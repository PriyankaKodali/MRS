import React, { Component } from 'react';
import $ from 'jquery';
import { MyAjaxForAttachments, MyAjax } from '../MyAjax';
import { ValidateForm, showErrorsForInput, setUnTouched, showErrors } from '../Validation.js';
import { MRSUrl } from '../Config.js';
import { toast } from 'react-toastify';

class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = { userId: "", code: "" };
    }
    componentDidMount() {
        this.setState({ userId: this.props.match.params["userId"], code: this.props.match.params["code"] });
    }

    render() {
        return (
            <div className="container">
                <form action="" method="post" name="Change_Password" className="changePwdForm" onChange={this.validate.bind(this)} onSubmit={this.handleSubmit.bind(this)} >
                    <h3 className="text-center" >
                        <img className="logo" src="Images/logo.png" alt="" />
                    </h3>

                    <div className="form-group" style={{ paddingTop: '10px' }}>
                        <div className="input-group">
                            <span className="input-group-addon">
                                <span className="glyphicon glyphicon-user"></span>
                            </span>
                            <input className="form-control" type="password" placeholder="Password" name="Password" autoComplete="off" ref="password" />
                        </div>
                    </div>

                    <div className="form-group" >
                        <div className="input-group">
                            <span className="input-group-addon">
                                <span className="glyphicon glyphicon-user"></span>
                            </span>
                            <input className="form-control" type="password" placeholder="Confirm Password" name="ConfirmPassword" autoComplete="off" ref="confirmpwd" />
                        </div>
                    </div>

                    <div >
                        <button type="submit" className="btn btn-primary btnChange" name="submit" value="Login" type="submit" >Reset</button>
                        <div className="loader loaderActivity btnSave"></div>
                    </div>
                </form> 
            </div>
        )
    }

    handleSubmit(e) {
        e.preventDefault();
        toast.dismiss();
        if (this.refs.password.value.trim() === "") {
            this.refs.password.focus();
            showErrorsForInput(this.refs.password, ["Please enter a valid password"]);
            return false;
        }
        if (this.refs.password.value.trim().length < 6) {
            showErrorsForInput(this.refs.password, ["Password should contain atleast 6 characters"]);
            return false;
        }
        if (this.refs.confirmpwd.value.trim() === "") {
            showErrorsForInput(this.refs.confirmPassword, ["Please enter a valid password"]);
            return null;
        }
        if (this.refs.confirmpwd.value.trim() !== this.refs.password.value.trim()) {
            showErrorsForInput(this.refs.confirmPassword, ["Password doesnt match"]);
            return false;
        }
        $(".loader").show();
        $("button[name='submit']").hide();
 
        var data = {
            NewPassword: this.refs.password.value.trim(),
            ConfirmPassword: this.refs.confirmpwd.value.trim(),
            UserId: this.state.userId,
            Code: this.state.code
        };

        let url = MRSUrl + "/api/Account/SetPassword";
        $.post(url, data).then(
            (data) => {
                toast("Password updated succesfully!", {
                    type: toast.TYPE.SUCCESS
                });
                this.props.history.push("/login");
            },
            (error) => {
                this.setState({ error: error.responseText.replace(/\[|"|\]/g, '') });
                toast(error.responseText, {
                    type: toast.TYPE.ERROR,
                    autoClose: false
                });
                $(".loader").hide();
                $("button[name='submit']").show();
            }
        );
    }

    validate(e) {
        var success = ValidateForm(e);

        if (!this.refs.password.value) {
            showErrorsForInput(this.refs.password, ["Password should not be empty"]);
            success = false;
        }

        if (!this.refs.confirmpwd.value) {
            showErrorsForInput(this.refs.confirmpwd, ["Confirm password should not be empty"]);
        }

        if (this.refs.password.value != "" && this.refs.confirmpwd.value != "") {
            if (this.refs.password.value != this.refs.confirmpwd.value) {
                showErrorsForInput(this.refs.confirmpwd, ["New password & Confirm password should match"]);
                return false;
            }
        }

        return success;
    }
}

export default ResetPassword;