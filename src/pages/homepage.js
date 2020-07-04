import React, { useContext } from 'react';
import { Card, Divider, Input, Carousel, Row, Col, Button } from 'antd';
import s from "./homepage.module.css";
import writeIcon from "../images/write.svg";
import sliderIcon from "../images/slider-icon.png";
import leftImage from "../images/left-image.png";
import rightImage from "../images/right-image.png";
import { AuthContext } from "../App";

const HomePage = () =>{
    
    const authData = useContext(AuthContext);

    return(
        <React.Fragment>
            <Row className="bg-primary">
                <div className="left-text col-lg-6 col-md-6 col-sm-12 col-xs-12" data-scroll-reveal="enter left move 30px over 0.6s after 0.4s">
                    <br/><br/><br/><br/><br/><br/><br/>
                    <h1>All In One Learning Portal For Tech Enthusiasts</h1>
                    <br/>
                    {authData && authData.accessToken ? <div/> : <Button style={{color:"white", background:"#ff4d4f"}} shape="round" onClick={e => window.location="/signin"}>SignUp</Button> }
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
                        <h5>About the community and page</h5>
                    </div>
                    <p>This site is built to help tech enthusiast to easily coperate with the digital enviroment. We porvide lots of features like Study Planner,Contest page,Dashborad and Forum.
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
                    <div><h1>Hello Mab 1</h1></div>
                    <div><h1>Hello Mab 2</h1></div>
                    <div><img style={{ height: "250px", width: "250px" }} src={writeIcon} /></div>
                    <div><h1>Hello Mab 4</h1></div>
                    <div><h1>Hello Mab 5</h1></div>
                </Carousel>
                <div id="contact" class="container-fluid bg-white">
                    <h2 class="text-center">CONTACT</h2><br/><br/>
                    <div class="row">
                        <div class="col-sm-5">
                        <p>Contact us and we'll get back to you within 24 hours.</p>
                        <p><span class="glyphicon glyphicon-map-marker"></span> Chicago, US</p>
                        <p><span class="glyphicon glyphicon-phone"></span> +00 1515151515</p>
                        <p><span class="glyphicon glyphicon-envelope"></span> myemail@something.com</p>
                        </div>
                        <div class="col-sm-7">
                        <div class="row">
                            <div class="col-sm-6 form-group">
                            <Input class="form-control" id="name" name="name" placeholder="Name" type="text" required/>
                            </div>
                            <div class="col-sm-6 form-group">
                            <Input class="form-control" id="email" name="email" placeholder="Email" type="email" required />
                            </div>
                        </div>
                        <textarea class="form-control" id="comments" name="comments" placeholder="Comment" rows="5"></textarea><br/>
                        <div class="row">
                            <div class="col-sm-12 form-group">
                            <button class="btn btn-default pull-right" type="submit">Send</button>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
        </React.Fragment>
    );
}

export default HomePage;