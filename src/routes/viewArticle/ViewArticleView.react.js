import React, { useContext, useEffect, useState } from "react";
import Editor from "../../components/Editor";
import s from "./ViewArticleView.module.css";
import { articles } from "../../testArticles";
import showdown from "showdown";
import { Divider, Card, Button, Input, Rate, Modal, Row, Col } from "antd";
import marked from "marked";
import { withRouter } from "react-router-dom";
import sampleMarkdownText from "../../testArticles/sampleMarkDown.md";
import queryString from "query-string";
import draftToHtml from "draftjs-to-html";
import { AuthContext } from "../../App";
import { StarOutlined } from "@ant-design/icons";

const ViewArticleView = props => {
  const authData = useContext(AuthContext);

  const onSubmit = async () => {
    try {
      console.log("Posting code");
      const response = await fetch("http://localhost:5000/compile", {
        method: "POST",
        body: JSON.stringify({ code: codeValue }),
      });

      const data = await response.text();
      console.log(data);

      document.getElementById("outputArea").innerHTML = data;

      const finalResponse = await fetch("http://localhost:5000/run");
      const answer = await finalResponse.text();
      console.log(answer, " ", finalResponse);
      document.getElementById("outputArea").innerHTML = answer;
    } catch (e) {
      console.error(e);
    }
  };
  const [codeValue, setCode] = React.useState("");
  const [isOpenFeedbackModal, setIsOpenFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(null);
  const [feedbackContent, setFeedbackContent] = useState(null);
  const [youtubeContent, setYoutubeContent] = useState([]);

  const memoizedEditor = React.useMemo(() => {
    return (
      <Editor
        onChange={value => setCode(value)}
        containerId={"editorWrapper"}
      />
    );
  }, []);
  const [article, setArticle] = React.useState({});

  React.useEffect(() => {
    const qParams = queryString.parse(props.location.search);
    if (authData && authData.accessToken) {
      fetch(`http://localhost:5000/article/${qParams.id}`, {
        method: "GET",
        withCredentials: true,
        mode: "cors",
        credentials: "include",
        headers: {
          "Authorization": `JWT ${authData.accessToken}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setArticle(data);
        })
        .catch(err => console.error(err));
    }
  }, []);

  const handleYoutubeDataInit = async () => {
    if (article && article.content) {
      const searchTerm = article.title;
      console.log(article)
      const data = await fetch(`http://localhost:5000/youtube?search=${searchTerm}`, {
        method: "GET",
        withCredentials: true,
        mode: "cors",
        credentials: "include",
        headers: {
          "Authorization": `JWT ${authData.accessToken}`
        }
      });
      const youtubeData = await data.json();
      console.log(youtubeData)
      setYoutubeContent(youtubeData);
    }
  }
  useEffect(() => {
    handleYoutubeDataInit();
  }, [article])
  useEffect(() => {
    if (article && article.content)
      document.getElementById("articleContent").innerHTML = draftToHtml(
        article.content,
      );
  }, [article])
  const handleOpenFeedbackModal = () => {
    setIsOpenFeedbackModal(!isOpenFeedbackModal);
  }
  const handleFeedbackRatingChange = (value) => {
    setFeedbackRating(value)
  }
  const handleFeedbackContentChange = e => setFeedbackContent(e.target.value);


  const handleFeedbackSubmission = () => {
    fetch(`http://localhost:5000/feedback/`, {
      method: "POST",
      mode: "cors",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "Authorization": `JWT ${authData.accessToken}`
      },
      body: JSON.stringify({
        articleID: article._id,
        userID: authData.user.email,
        content: feedbackContent,
        rating: feedbackRating
      }),
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => handleOpenFeedbackModal());
  }
  const [videoPlayerURL, setVideoPlayerURL] = useState("");
  const [isOpenPlayerModal, setIsOpenPlayerModal] = useState(false);
  const handleOpenPlayerModal = (url) => {
    console.log("Here",url)
    setVideoPlayerURL(url);
  }
  useEffect(() => {
    if (videoPlayerURL) {
      console.log("Should open...")
      setIsOpenPlayerModal(!isOpenPlayerModal);
    }
  }, [videoPlayerURL])
  const { TextArea } = Input;

  return (
    <>
      <Card bodyStyle={{ padding: "25px" }} style={{ borderRadius: "5px" }}>
        <div className={s.pageWrapper}>
          <div className={s.resultsWrapper}>
            <div className={s.articleWrapper}>
              <div className={s.articleHeader}>{article.title}</div>
              <div className={s.articleMetadata}>
                <div className={s.articleAuthor}>{article.author}</div>
                <div className={s.articleDate}>{article.date}</div>
              </div>
              <Divider />

              <div className={s.articleContent} id="articleContent"></div>
            </div>
            <div className={s.submitButton} onClick={onSubmit}>
              {" "}
            Run Code{" "}
            </div>
            <div className={s.outputArea} id="outputArea"></div>
          </div>

          <div className={s.editorWrapper} id="editorWrapper">
            {memoizedEditor}
          </div>
        </div>
      </Card>
      <Button
        onClick={handleOpenFeedbackModal}
        type="primary"
        shape="circle"
        style={{ position: "fixed", right: " 30px", bottom: " 25px", zIndex: "999", height: "50px", width: "50px", color: "white" }}>
        <StarOutlined />
      </Button>

      <Modal
        title="Leave a review!"
        visible={isOpenFeedbackModal}
        centered
        onOk={handleOpenFeedbackModal}
        onCancel={handleOpenFeedbackModal}
        footer={null}
        destroyOnClose={true}
      >
        <div className={s.paraStyle}>
          Leave some feedback and a rating. It will help us provide you with better quality content!
        </div>
        <br />
        <Rate onChange={handleFeedbackRatingChange} />
        <br />
        <br />
        <TextArea rows={4} onChange={handleFeedbackContentChange} />
        <br />
        <br />
        <Button type="primary" onClick={handleFeedbackSubmission}>
          Submit
              </Button>
      </Modal>


      <Card style={{ margin: "35px auto" }}>
        <div className={s.header} style={{ textAlign: "center" }}>Related Videos</div>
        <div className={s.subHeader} style={{ textAlign: "center" }}>Browse some popular youtube videos relevant to this topic.</div>
        <br />
        {
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", flexWrap: "wrap" }}>
            {
              youtubeContent && youtubeContent.map(video => {
                return (
                  <Card hoverable style={{ width: "320px", margin: "10px 15px", padding: "0px", height: "415px" }} bodyStyle={{ padding: "0px" }}
                    onClick={e => handleOpenPlayerModal(video.videoID)}>
                    <div>
                      <img src={video.thumbnails.medium.url} />
                    </div>

                    <div style={{ padding: "20px" }}>
                      <div className={s.smallerHeader}>

                        <a href={video.link} target="_blank" style={{ textDecoration: "none !important" }}>{video.title}</a>
                      </div>
                      <div className={s.paraStyle} style={{ fontWeight: "bold", fontSize: "12px" }}>
                        {video.channelTitle} &nbsp; at {new Date(video.publishedAt).toLocaleString()}
                      </div>
                      <div className={s.paraStyle} style={{ wordBreak: "break-all" }}>
                        {video.description}
                      </div>

                    </div>



                  </Card>
                )
              })
            }
          </div>

        }

      </Card>
      <Modal
        centered={true}
        visible={isOpenPlayerModal}
        onCancel={handleOpenPlayerModal}
        width={1280}
        destroyOnClose={true}
        footer={null}
        closable={false}
        style={{textAlign:"center",width:1280,height:720}}
        bodyStyle={{padding:"0px",width:1280,height:720,}}
      >
        {/* <div className={s.subHeader}>
          Watch popular youtube tutorials
        </div> */}

        <iframe id="ytplayer" type="text/html" width="1280" height="720"
          src={`https://www.youtube.com/embed/${videoPlayerURL}?autoplay=1&mute=1`}
          frameborder="0"></iframe>
      </Modal>
    </>
  );
};
export default withRouter(ViewArticleView);
