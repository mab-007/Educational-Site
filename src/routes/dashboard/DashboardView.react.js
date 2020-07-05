import React, { useContext } from "react";
import s from "./DashboardView.module.css";
import { Row, Col, Card, Input, Badge, Select, Divider } from "antd";
import Icon, { StarFilled } from "@ant-design/icons";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import BookmarkIcon from "../../bookmark.png";
import avatar1 from "../../avatars/avatar1.png";
import avatar2 from "../../avatars/avatar2.png";
import avatar3 from "../../avatars/avatar3.png";
import avatar4 from "../../avatars/avatar4.png";
import avatar5 from "../../avatars/avatar5.png";
import avatar6 from "../../avatars/avatar6.png";
import articleIcon from "../../images/article.svg"

import { withRouter } from "react-router-dom";
import { AuthContext } from "../../App";

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];
const tags = [
  "Arrays",
  "Stack",
  "Trie",

  "Dynamic Programming",
  "Sorting",
  "Segment Tree",
];

const DashboardView = props => {
  const [posts, setPosts] = React.useState();

  const authData = useContext(AuthContext);


  React.useEffect(() => {
    if (authData && authData.accessToken) {
      fetch("http://localhost:5000/article/", {
        method: "GET",
        withCredentials: true,
        mode: "cors",
        credentials: "include",
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
                  ratings: (Number(post.avgRating || 0.0)).toFixed(1),
                  date: post.date.split("T")[0],
                };
              })
              .sort((a, b) => b.ratings.localeCompare(a.ratings)),
          );
        })
        .catch(err => console.error(err));
    }
  }, []);

  const Bookmark = () => (
    <img src={BookmarkIcon} alt="bookmark" style={{ height: "30px" }} />
  );

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

  const { Option } = Select;
  return (
    <React.Fragment>
      <Card bodyStyle={{ padding: 15 }} className={s.bodyCard}>
        <div style={{ position: "absolute", top: "-100px", left: "-50px" }}>
          <img style={{ height: "250px", width: "250px" }} src={articleIcon} />
        </div>
        <div className={s.header}>Articles </div>
        <div className={s.subHeader}>
          {authData && authData.user && authData.user.firstName}, browse a curated catalogue of technical articles
        </div>
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
            <Col sm={{ span: 10, offset: 4 }} xs={{ span: 24, offset: 0 }}>
              <div style={{ float: "right" }}>
                Sort by : &nbsp;
                <Select
                  defaultValue="ratings"
                  style={{ width: 200 }}
                  onChange={handleSort}
                >
                  <Option value="ratings">Ratings</Option>
                  <Option value="title">Title</Option>
                  <Option value="date">Date Created</Option>
                </Select>
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
              const avatarIdx = post.id % avatars.length;
              return (
                <div
                  className={s.postContainer}
                  onClick={e => props.history.push(`/view?id=${post._id}`)}
                >
                  <Row className={s.postRow}>
                    <Col
                      sm={{ span: 2, offset: 0 }}
                      xs={{ span: 24, offset: 0 }}
                    >
                      <div
                        style={{
                          textAlign: "center",
                          alignItems: "center",
                          display: "flex",
                          justifyContent: "center",
                          height: "100%",
                          wdith: "100%",
                        }}
                      >
                        <div
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                            objectFit: "contain",
                            background: `url(${avatars[idx % avatars.length]})`,
                          }}
                          alt="avatar"
                        />
                      </div>
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

                      {post.tags && post.tags.length ? <span style={{ fontWeight: 500 }}>Topics : </span> : null}
                      <span>
                        {
                          post.tags && post.tags.map(
                            tag => {
                              return (
                                <span className={s.tagSpan}>
                                  {tag}
                                </span>
                              )
                            }
                          )
                        }

                      </span>
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
                    <Col
                      sm={{ span: 3, offset: 1 }}
                      xs={{ span: 24, offset: 0 }}
                    >
                      <div className={s.metaDataWrapper}>
                        <div className={s.ratingsWrapper}>
                          <span className={s.ratingsText}>{post.ratings}</span>
                          <span style={{ color: "#f9e26e" }}>
                            <StarFilled />
                          </span>
                        </div>
                      </div>
                    </Col>

                    <Col
                      sm={{ span: 2, offset: 1 }}
                      xs={{ span: 24, offset: 0 }}
                      style={{ marginTop: 10 }}
                    >
                      <Icon component={Bookmark} />
                    </Col>
                  </Row>
                </div>
              );
            })}
      </Card>
    </React.Fragment>
  );
};

export default withRouter(DashboardView);
