import React, { Component, useState, useContext, useEffect } from 'react';
import { BrowserRouter, Switch, Route, NavLink, Redirect } from 'react-router-dom';
import SignUp from '../SignUp/SignUp';
import { AuthContext } from '../../App';
import { Card, Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import s from "./SignIn.module.css";
import codeIcon from "../../images/code_3.svg";

const SignIn = (props) => {
    //static authData = AuthContext;

    // componentDidMount(){
    //     const authData = this.context
    //     console.log(authData)
    // }

    const authData = useContext(AuthContext)


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [designation, setDesignation] = useState("");
    const [emailErr, setEmailErr] = useState("");
    const [passwordErr, setPasswordErr] = useState("");


    const validate = () => {
        let emailErr = "";
        let passwordErr = "";

        const regex = {
            email: new RegExp('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'),
            //password:new RegExp('^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{8,}$')
        };

        if (!(email !== "" && regex.email.test(email))) {
            emailErr = "Enter your email in the form character@character.domain";
        }

        setEmailErr(emailErr)


        if (!(password !== "")) {
            passwordErr = "Enter your password as stated ";
        }

        setPasswordErr(passwordErr)

        if (!emailErr && !passwordErr) {
            return true;
        } else {
            return false;
        }

    }
    const submitHandler = (event) => {
        event.preventDefault();
        if (!validate()) {
            return;
        }
        fetch("http://avab-restapi.herokuapp.com/user/signin", {
            method: "POST",
            mode: "cors",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
            .then(res => res.json())
            .then(data => {

                if (data.statusCode === 404) {
                    setEmailErr(data.message);
                    setPasswordErr("");
                    //this.signupError="email_id already registered";
                    //console.log(this.signupError);
                } else if (data.statusCode === 450) {
                    setPasswordErr(data.message);
                    setEmailErr("");

                } else {
                    setEmailErr("");
                    setPasswordErr("");
                    props.loginHandler(data);
                }
            })
            .catch(err => console.error(err));


    }

    const style = {
        "margin": "2% auto",
        "padding": "5%",
        "textAlign": "center",
        "boxSizing": "border-box",
        "maxWidth": "35%",
    };
    const passStyle = {
        "fontSize": "12px"
    };
    const invalidStyle = {
        "color": "red",
        "fontWeight": "bold"
    };
    return (
        // authData && authData.accessToken? <Redirect to = "/dashboard"/>
        // :
        authData && authData.accessToken && !authData.isLoading ? <Redirect to="/" />
            : authData.isLoading ? <div /> :
                <div>
                    <Card hoverable style={style}>
                    <div style={{position:"absolute", top:"-100px", right:"-85px"}}>
                        <img style={{height:"300px", width:"300px"}} src={codeIcon}/>
                    </div>
                        <div className={s.header}>Welcome Back</div>
                        <div className={s.subHeader}>Sign in to resume where you left off.</div><br />

                        <p className={`dummy ${s.dummy}`}>
                            <label >Email address</label>
                            <Input placeholder="Enter email" name="email"
                                prefix={<UserOutlined />}
                                value={email}
                                onChange={e => setEmail(e.target.value)} />
                        </p>


                        {emailErr !== "" ? (<div style={invalidStyle}>{emailErr}</div>) : null}

                        <p className={`dummy ${s.dummy}`}>
                            <label >Password</label>
                            <Input.Password placeholder="Enter password"
                                name="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)} />
                        </p>



                        <p className="forgot-password text-right" style={passStyle}>
                            *Password must contain Minimum eight characters, at least one letter and one number
                    	</p>

                        {passwordErr !== "" ? (<div style={invalidStyle}>{passwordErr}</div>) : null}


                        <Button type="primary" htmlType="submit" style={{ width: "250px", height: "45px" }} onClick={submitHandler}>Sign In</Button>
                        <br />
                        <br />
                        <div className="forgot-password text-center">
                            Don't have an account?
	                        <NavLink className='nav-NavLink' to='/signup'>&nbsp;Sign Up </NavLink>
                        </div>


                    </Card>
                    <div className="auth-wrapper">
                        <div className="auth-inner">
                            <Switch>
                                <Route path='/signup' component={SignUp} />
                            </Switch>
                        </div>
                    </div>

                </div>
    );
}


export default SignIn;