import React, { useEffect } from "react";
import s from "./App.module.css";
import { BrowserRouter as Router, Switch, Route, useHistory, withRouter} from "react-router-dom";
import EditArticleView from "./routes/editArticle";
import ViewArticleView from "./routes/viewArticle";
import Mainpage from "./pages/index";
import NewTopic from "./pages/new_topic";
import Contest from "./pages/contest/contest";
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp"
import SideBar from "./SideBar";
import ProtectedRoute from "./ProtectedRoute";
import Home from "./pages/homepage"
// import Header from './Containers/Header';


import topic from "./pages/topic";
import Dashboard from "./routes/dashboard";
import MyStudyPlans from "./routes/mystudyplans";
import StudyPlan from "./routes/studyplan";
import "antd/dist/antd.css";
import { Menu, Layout, Dropdown, Card, Row, Divider } from "antd";
import Leaderboard from './components/Leaderboard/Leaderboard';
import { DownOutlined, LogoutOutlined, InstagramOutlined,  FacebookOutlined, LinkedinOutlined, TwitterOutlined } from "@ant-design/icons";

const { Content, Sider } = Layout;

export const AuthContext = React.createContext(null);

function App() {

  const [authData, setAuthData] = React.useState({ isLoading: true });

  const history = useHistory();

  const [user, setUser] = React.useState("");

  const loginHandler = (data) => {
    console.log("Setting", data);
    setAuthData({ accessToken: data.accessToken, user: data.user });
    window.location.reload(true);
  }
  function getCookie(name) {
    var cookies = '; ' + document.cookie;
    var splitCookie = cookies.split('; ' + name + '=');
    if (splitCookie.length == 2) return splitCookie.pop();
  }
  function deleteCookie(name) {
    console.log("Hello");
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.reload(true);
  };
  useEffect(() => {
    if (getCookie("refreshToken")) {
      if (!authData || !authData.accessToken) {
        setAuthData({ ...authData, isLoading: true })
        fetch("http://localhost:5000/auth/refresh/", {
          method: "POST",
          mode: "cors",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        })
          .then(res => res.json())
          .then(data => {
            if (data && data.accessToken && data.user) {
              setAuthData({
                accessToken: data.accessToken, user: data.user, isLoading: false
              })
              setUser(data.user.firstName);
            }
          })
          .catch(e => {
            setAuthData({ isLoading: false })
          })
      }
    } else {
      setAuthData({ ...authData, isLoading: false })
    }
  }, [])
  const menu1 = (
    <Menu>
      <Menu.Item>
        <div onClick={e=>deleteCookie("refreshToken")}>
          Logout <LogoutOutlined/>
        </div>
      </Menu.Item>
    </Menu>
  );

  const menu2 = (
    <Menu>
      <Menu.Item>
        <div onClick={e=>window.location="/leaderboard"}>
          Leaderboard
        </div>
      </Menu.Item>
      <Menu.Item>
        <div onClick={e=>window.location="/edit"}>
          Create
        </div>
      </Menu.Item>
    </Menu>
  );
  return (
    <AuthContext.Provider value={authData}>
      <Layout style={{ minHeight: "100vh" }} >
      <SideBar/>
      <Layout style={{ padding: "0px" }}>
        <Layout.Header className={`site-layout-sub-header-background ${s.navbar}`} style={{ padding: 0, background:"#1890ff", color:"white",
      "-webkit-box-shadow": "0px 2px 16px -2px rgba(122,113,122,1)",
      "-moz-box-shadow": "0px 2px 16px -2px rgba(122,113,122,1)",
      "box-shadow":" 0px 2px 16px -2px rgba(122,113,122,1)" }} fixed>
          <navbar mode="horizontal" defaultSelectedKeys={['2']} style={{ float: "right"}} className="navbar-sticky-top">
            <div>
              {authData && authData.accessToken ? (
              <div>
              <Dropdown overlay={menu1} visible={false}>
                <a className="ant-dropdown-link" onClick={e => window.location="/"}>
                  {'Home'}
                </a>
              </Dropdown>{' '}&nbsp;&nbsp;&nbsp;&nbsp;
              <Dropdown overlay={menu2} >
                <a className="ant-dropdown-link" onClick={e => window.location="/dashboard"}>
                  {'Dashboard'} <DownOutlined />
                </a>
              </Dropdown>{' '}&nbsp;&nbsp;&nbsp;&nbsp;
              <Dropdown overlay={menu1} visible={false}>
                <a className="ant-dropdown-link" onClick={e => window.location="/forum"}>
                  {'Forum'}
                </a>
              </Dropdown>{' '}&nbsp;&nbsp;&nbsp;&nbsp;
              <Dropdown overlay={menu1} visible={false}>
                <a className="ant-dropdown-link" onClick={e => window.location="/contest"}>
                  {'Contests'}
                </a>
              </Dropdown>{' '}&nbsp;&nbsp;&nbsp;&nbsp;
              <Dropdown overlay={menu1}>
              <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                {`Welcome, ${authData.user.firstName}`} <DownOutlined />
              </a>
              </Dropdown>&nbsp;&nbsp;&nbsp;&nbsp;
              </div>) : 
             (<div>
              <Dropdown overlay={menu1} visible={false}>
              <a className="ant-dropdown-link" onClick={e => window.location="/"}>
                {'Home'}
              </a>
            </Dropdown>{' '}&nbsp;&nbsp;&nbsp;&nbsp;
            <Dropdown overlay={menu2} >
              <a className="ant-dropdown-link" onClick={e => window.location="/dashboard"}>
                {'Dashboard'} <DownOutlined />
              </a>
            </Dropdown>{' '}&nbsp;&nbsp;&nbsp;&nbsp;
            <Dropdown overlay={menu1} visible={false}>
              <a className="ant-dropdown-link" onClick={e => window.location="/forum"}>
                {'Forum'}
              </a>
            </Dropdown>{' '}&nbsp;&nbsp;&nbsp;&nbsp;
            <Dropdown overlay={menu1} visible={false}>
              <a className="ant-dropdown-link" onClick={e => window.location="/contest"}>
                {'Contests'}
              </a>
            </Dropdown>{' '}&nbsp;&nbsp;&nbsp;&nbsp;
            <Dropdown  overlay={menu1} visible={false} onClick={e => window.location="/signin"}>
             <a className="ant-dropdown-link" >
             Welcome, Sign In!
            </a>
            </Dropdown>
            </div>)
             
              }
              </div>
          </navbar>
        </Layout.Header>


          {/* <Header userData={user} logoutHandler={deleteCookie}/> */}
          {/*authData && authData.user && <SideBar/>*/}
          <Content
            className={` ${s.appWrapper} site-layout-background`}
            style={{
              padding: "0",
              margin: 0,
              minHeight: 280,
            }}
          >
            <Router>
              
              <Switch>
                <ProtectedRoute path="/edit" component={EditArticleView} />
                <ProtectedRoute path="/view" component={ViewArticleView} />
                <ProtectedRoute path="/dashboard" component={Dashboard} />
                <ProtectedRoute exact path="/forum" component={Mainpage} />
                <ProtectedRoute exact path="/new_topic" component={NewTopic} />
                <ProtectedRoute path="/leaderboard" component={Leaderboard} />
                <ProtectedRoute path='/contest' component={Contest} />
                <ProtectedRoute path="/mystudyplans" component={MyStudyPlans} />
                <ProtectedRoute path="/studyplan" component={StudyPlan} />
                <Route exact path="/" component={Home} />

                <Route exact path="/topic" component={topic} />
                <Route path='/signin' render={(props) => <SignIn loginHandler={loginHandler} {...props} />} />
                <Route path='/signup' component={SignUp} />
              </Switch>
            </Router>
            </Content>
          <Layout.Footer style={{ textAlign: 'center', padding: 0, background: "white",
      "-webkit-box-shadow": "0px 2px 16px -2px rgba(122,113,122,1)",
      "-moz-box-shadow": "0px 2px 16px -2px rgba(122,113,122,1)",
      "box-shadow":" 0px 2px 16px -2px rgba(122,113,122,1)" }}>
            <Card>
              <div>
                <h2>Learning is like rowing upstream: not to advance is to drop back.</h2>
                Our website aims to provide students a layout where they can study and organize their way of learning.
                <br/>
                We allow students for an allround development by allowing them to interact with other fellow students and tutors.
              </div>
              <Divider/>
              <h4>
                CONTACT US
              </h4>
              <br/>
              <Row>
                <div className="left-text col-lg-6 col-md-6 col-sm-12 col-xs-12" data-scroll-reveal="enter left move 30px over 0.6s after 0.4s">
                  <h4>
                    Anmol Verma
                  </h4>
                  <h5>
                    Email: avstyles1999@gmail.com <br/>
                    Phone: +91 8777542219
                  </h5>
                  <span onClick={e=>window.open("https://www.instagram.com/avstyles1999/", "_blank")}><InstagramOutlined style={{ fontSize: '30px'}}/></span>
                  {' '}
                  <span onClick={e=>window.open("https://www.facebook.com/anmol.verma.587606", "_blank")}><FacebookOutlined style={{ fontSize: '30px'}}/></span>
                  {' '}
                  <span onClick={e=>window.open("https://www.linkedin.com/in/anmol-verma-966955170/", "_blank")}><LinkedinOutlined style={{ fontSize: '30px'}}/></span>
                  {' '}
                  <span onClick={e=>window.open("https://www.twitter.com/avstyles1999", "_blank")}><TwitterOutlined style={{ fontSize: '30px'}}/></span>
                </div>
                <div className="left-text col-lg-6 col-md-6 col-sm-12 col-xs-12" data-scroll-reveal="enter left move 30px over 0.6s after 0.4s">
                  <h4>
                    Amarnath Bhakat
                  </h4>
                  <h5>
                    Email: ambhakat1999@gmail.com <br/>
                    Phone: +91 8918074172
                  </h5>
                  <span onClick={e=>window.open("https://www.instagram.com/mab.31/", "_blank")}><InstagramOutlined style={{ fontSize: '30px'}}/></span>
                  {' '}
                  <span onClick={e=>window.open("https://www.facebook.com/amarnath.bhakat.31", "_blank")}><FacebookOutlined style={{ fontSize: '30px'}}/></span>
                  {' '}
                  <span onClick={e=>window.open("https://www.linkedin.com/in/amarnath-bhakat-158723170/", "_blank")}><LinkedinOutlined style={{ fontSize: '30px'}}/></span>
                  {' '}
                  <span><TwitterOutlined style={{ fontSize: '30px'}}/></span>
                </div>
              </Row>
            </Card>
          </Layout.Footer>
        </Layout>
      </Layout>
    </AuthContext.Provider>

  );
}

export default (App);
