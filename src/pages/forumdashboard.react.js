import React, { useContext } from "react";
import s from "./ForumDashboard.module.css";
import { Row, Col, Card, Tag, Select, Button, Avatar, Divider, Input, Breadcrumb, message, Empty } from "antd";
import { UserOutlined } from '@ant-design/icons';
import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { withRouter, Redirect } from "react-router-dom";
import { AuthContext } from "../App";
import BreadcrumbItem from "antd/lib/breadcrumb/BreadcrumbItem";
import articleIcon from "../images/article.svg"

const tags = [
  <Tag color="green">Genral</Tag>,
  <Tag color="red">Contest</Tag>,
  <Tag color="volcano">Query</Tag>,

  <Tag color="orange">Announcement</Tag>,
  <Tag color="gold">Challenge</Tag>,
  <Tag color="magenta">Cook Off</Tag>,
];

const ForumDashboard = props => {
  const [posts, setPosts] = React.useState();

  const authData = useContext(AuthContext);

  React.useEffect(() => {
    console.log("FETCHING");
    //if (authData && authData.accessToken) {
      fetch("http://avab-restapi.herokuapp.com/topics", {
        method:"GET",
        withCredentials: true,
        mode:"cors",
        credentials:"include",
        headers: {
            "Authorization": `JWT ${authData.accessToken}`
        },
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          setPosts(
            data
              .map(post => {
                return {
                  ...post,
                  ratings: (Math.random() * (5 - 1) + 1).toFixed(1),
                  date: post.date.split("T")[0],
                };
              })
              .sort((a, b) => b.date.localeCompare(a.date)),
          );
        })
        .catch(err => console.error(err));
    //}
  }, []);

  const [filterText, setFilterText] = React.useState();

  const handleFilter = e => {
    setFilterText(e.target.value);
  };

  const handleSort = value => {
    const sortedPosts = [...posts].sort((a, b) =>
      b[value].localeCompare(a[value]),
    );
    setPosts(sortedPosts);
  };

  const [Current,setCurrent] = React.useState(3);

  const onChange = page => {
      console.log(page);
      setCurrent({
        Current: page,
      });
    };
  

  const submithandler = () =>{
    if(authData && authData.accessToken) {
      window.location.assign("/new_topic");
    }else {message.info("Please signin !")}
  }
  const { Option } = Select;
  return (
    <React.Fragment>
      <div className="container my-3">
      <div className="row">
      <div className="col-12 col-xl">
        <Card bodyStyle={{ padding: 15 }} style={{width:"75vw"}} style={{ margin:"45px auto"}} className={s.bodyCard}>
          <div style={{ position: "absolute", top: "-100px", left: "-50px" }}>
            <img style={{ height: "250px", width: "250px" }} src={articleIcon} />
          </div>
          <div className={s.header}>Forum </div>
          <div className={s.subHeader}>
            Welcome,{authData && authData.user &&  authData.user.firstName}, use this forum to talk to and learn from the community!
          </div>
          <Breadcrumb>
          <BreadcrumbItem>Board Index</BreadcrumbItem>
          </Breadcrumb>
          {/*<nav className="breadcrumb">
          <span className="breadcrumb-item active">Board index</span>
          </nav>*/}
          <Divider />
          <div className={`dashboardButtonsWrapper ${s.buttonsWrapper}`}>
            <Row>
              <Col sm={{ span: 10, offset: 0 }} xs={{ span: 24, offset: 0 }}>
                <div className={s.filterInput}>
                  <Input
                    className={s.filterInput}
                    placeholder="Filter by artice title..."
                    value={filterText || ""}
                    onChange={e => handleFilter(e)}
                    style={{ border: "none !important" }}
                  />
                </div>
              </Col>
            </Row>
          </div>
          {posts &&
            posts 
              .filter(post =>
                post.title
                  .toLowerCase()
                  .includes((filterText || "").toLowerCase()),
              )
              .map((post, idx) => {
                //const avatarIdx = post.id % avatars.length;
                return (
                  <div
                    className={s.postContainer}
                    onClick={e => props.history.push(`/topic?id=${post._id}`)}
                  >
                    <Row className={s.postRow}>
                    <Col
                      sm={{ span: 2, offset: 0 }}
                      xs={{ span: 24, offset: 0 }}
                    >
                      <Avatar size={64} icon={<UserOutlined />} />
                    </Col>

                      <Col
                        sm={{ span: 9, offset: 1 }}
                        xs={{ span: 24, offset: 0 }}
                      >
                        <div className={s.titleWrapper}>{post.title}</div>
                        <div
                          style={{
                            color: "#b4acac",
                            fontSize: "12px",
                            marginBottom: 5,
                          }}
                        >
                          {post.author || "Cormen Stein"}
                        </div>
                          <span style={{ fontWeight: 500 }}>Tags : </span>
                          <span>
                          <span className={s.tagSpan}>
                            {tags[(idx + 2) % tags.length]}
                        </span>
                          <span className={s.tagSpan}>{tags[idx]}</span>
                        </span>
                      </Col>

                      <Col
                        sm={{ span: 2, offset: 1 }}
                        xs={{ span: 24, offset: 0 }}
                        style={{ marginTop: 10 }}
                      >
                      <div className={s.metaDataWrapper}>
                          <div className={s.ratingsWrapper}>
                            <span >{post.author}</span>
                          </div>
                        </div>
                      </Col>

                      <Col
                        sm={{ span: 3, offset: 1 }}
                        xs={{ span: 24, offset: 0 }}
                      >
                        <div className={s.metaDataWrapper}>
                          <div className={s.ratingsWrapper}>
                            <span className={s.ratingsText}>{post.comm.length} Replies</span>
                          </div>
                        </div>
                      </Col>

                      <Col
                        sm={{ span: 4, offset: 1 }}
                        xs={{ span: 24, offset: 0 }}
                      >
                        <div className={s.dateWrapper}>
                          <div className={s.createdText}>Created :</div>
                          <span style={{ width: "7.5px" }}></span>
                          {post.date}
                        </div>
                      </Col>                      
                    </Row>
                  </div>
                );
              })}
              
        </Card><br/>       
        <br/>

        <Button onClick={submithandler} className="btn btn-lg btn-primary">New topic</Button>
        </div>         
        </div>
      </div>
    </React.Fragment>
  );
};

export default withRouter(ForumDashboard);
