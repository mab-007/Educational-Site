import React, { useContext } from 'react';
import { Card, Divider, Input, Carousel, Row, Button,Tag, Alert } from 'antd';
import {GithubOutlined, MediumOutlined} from "@ant-design/icons";
import s from "./homepage.module.css";
import sliderIcon from "../images/slider-icon.png";
import leftImage from "../images/left-image.png";
import rightImage from "../images/right-image.png";
import { AuthContext } from "../App";
import emailjs from 'emailjs-com';

const { TextArea } = Input;

const HomePage = () =>{
    
    const authData = useContext(AuthContext);
    const [name,setName] = React.useState("");
    const [email,setEmail] = React.useState("");
    const [comment,setComment] = React.useState("");
    const [va,setVar] = React.useState("");

    const changeHandler=(e)=>{
        const name=e.target.name;
        if(name==="name"){
            setName(e.target.value);
        }else if(name==="email"){
            setEmail(e.target.value);
        }else if(name==="comment"){
            setComment(e.target.value);
        }
    }

    const submitHandler=()=>{
        const templateId = 'template_Mm6p1JHv';
        if(authData && authData.accessToken){
             sendFeedback(templateId, {message_html: comment, from_name: name, reply_to: email}) 
             setName("");
             setEmail("");
             setComment("");
        }else{
             setVar(<Alert message="Sign In to Continue" type="warning" showIcon="closable"/>);
        }
    }

    const sendFeedback = (templateId, variables) => {
        emailjs.send(
          'gmail', templateId,
          variables,'user_bChaICqSfq8594c7tyRp8'
          ).then(res => {
            console.log('Email successfully sent!')
          })
          // Handle errors here however you like, or use a React error boundary
          .catch(err => console.error('Oh well, you failed. Here some thoughts on the error that occured:', err))
      }

    return(
        <React.Fragment>
            <Row className="bg-primary">
                <div className="left-text col-lg-6 col-md-6 col-sm-12 col-xs-12" data-scroll-reveal="enter left move 30px over 0.6s after 0.4s">
                    <br/><br/><br/><br/><br/><br/><br/>
                    <h1 style={{'fontFamily': 'Josefin Sans, sans-serif'}}>All In One Learning Portal For Tech Enthusiasts</h1>
                    <br/>
                    {authData && authData.accessToken ? <div/> : <Button style={{color:"white", background:"#ff4d4f"}} shape="round" onClick={e => window.location="/signin"}>SignIn</Button> }
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12" data-scroll-reveal="enter right move 30px over 0.6s after 0.4s">
                    <img src={sliderIcon} class="rounded img-fluid d-block mx-auto" alt="First Vector Graphic"/>
                </div>
            </Row>
            <Card>
            <Row>
                <div class="col-lg-7 col-md-12 col-sm-12" data-scroll-reveal="enter left move 30px over 0.6s after 0.4s">
                    <img src={leftImage} class="rounded img-fluid d-block mx-auto" alt="App" />
                </div>
                <div class="left-text col-lg-5 col-md-12 col-sm-12 mobile-bottom-fix">
                    <br/><br/><br/><br/>
                    <div class="left-heading">
                        <h5>About the Community and Page</h5>
                    </div>
                    <p>This site is built to help tech enthusiast to easily coperate with the digital enviroment. We provide lots of features like Study Planner,Contest page,Dashborad and Forum.
                    <br/><br/> A user can solve diffrent question availabe in Dashborad posted by our verified user. The Contest page allows one to watch live and upcoming contest on diffrent platforms. </p>
                    
                </div>
            </Row>
            <Divider/>
            <Row>
                <div class="left-text col-lg-5 col-md-12 col-sm-12 mobile-bottom-fix">
                    <br/><br/><br/><br/>
                    <div class="left-heading">
                        <h5>Analysis On the Basis of Preformance</h5>
                    </div>
                    <p>We provide anaylasis on each user on the basis of their study plan and submissions </p>
                    <ul>
                        <li>
                            <div className="text">
                                <h6>Study Planner</h6>
                                <p>You can use this study schedule the plan for you study.</p>
                            </div>
                        </li>
                        <li>
                            <div className="text">
                                <h6>Leaderboard System</h6>
                                <p>On the the basis of submissions we provide leaderboard for all users.</p>
                            </div>
                        </li>
                        <li>
                            <div className="text">
                                <h6>Forum</h6>
                                <p>If you have any question or comment, you can learn and interact with the community.</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="right-image col-lg-7 col-md-12 col-sm-12 mobile-bottom-fix-big" data-scroll-reveal="enter right move 30px over 0.6s after 0.4s">
                    <img src={rightImage} class="rounded img-fluid d-block mx-auto" alt="App"/>
                </div>     
            </Row>
            </Card>
                <Carousel autoplay className={s.slide}>
                    <div><h1>An investment in knowledge pays the best interest. –  Benjamin Franklin</h1></div>
                    <div><h1>The roots of education are bitter, but the fruit is sweet. – Aristotle</h1></div>
                    <div><h1>Education is what remains after one has forgotten what one has learned in school. – Albert Einstein</h1></div>
                    <div><h1>Education is the passport to the future, for tomorrow belongs to those who prepare for it today. – Malcolm X</h1></div>
                </Carousel>
                <div id="contact" class="container-fluid bg-white">
                    <h2 class="text-center">CONTACT</h2><br/><br/>
                    <div class="row">
                        <div class="col-sm-5">
                        <p>Contact us and we'll get back to you within 24 hours.</p>
                        <p><span class="glyphicon glyphicon-map-marker"></span> Kolkata, India</p>
                        <p><Tag color="blue" style={{fontSize:"15px"}}>Help!</Tag></p>
                        <p><span class="glyphicon glyphicon-phone" onClick={e=>window.open('https://www.github.com/mab-007/Educational-Site.git','_blank')}> <GithubOutlined/> GitHub</span></p>
                        <p><span class="glyphicon glyphicon-envelope"></span> <MediumOutlined/> Medium</p>
                        </div>
                        <div class="col-sm-7">
                        <div class="row">
                            <div class="col-sm-6 form-group">
                            <Input class="form-control" id="name" name="name" placeholder="Name" type="text" value={name} onChange={changeHandler} required/>
                            </div>
                            <div class="col-sm-6 form-group">
                            <Input class="form-control" id="email" name="email" placeholder="Email" type="email" value={email} onChange={changeHandler} required />
                            </div>
                        </div>
                        <TextArea class="form-control" id="comments" name="comment" placeholder="Comment" value={comment} onChange={changeHandler} rows="5"></TextArea><br/>
                        <br/>
                        <div class="row">
                            <div class="col-sm-12 form-group">
                            <button class="btn btn-primary pull-right" type="submit" onClick={submitHandler}>Send</button>
                            </div>
                        </div>
                        </div>
                    </div>
                    {va}
                    </div>
        </React.Fragment>
    );
}

export default HomePage;