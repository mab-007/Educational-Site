import React, { useState, useContext } from "react";
import { Editor } from "react-draft-wysiwyg";
import s from "./EditArticle.module.css";
import { Card, Button, Input, Divider, Select } from "antd";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Typography } from "antd";
import draftToHtml from "draftjs-to-html";
import writeIcon from "../../images/write.svg";

import { convertFromRaw } from "draft-js";
import { AuthContext } from "../../App";
import { Redirect } from "react-router-dom";

const { Title } = Typography;

const EditArticleView = props => {

  const authData = useContext(AuthContext);
  const fakeContent = {
    entityMap: {},
    blocks: [
      {
        key: "637gr",
        text: "Initialized from content state.",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
    ],
  };

  const [contentState, setContentState] = React.useState();
  const [title, setTitle] = React.useState();
  const [tags, setTags] = useState(null);

  const handleArticleSubmit = e => {
    console.log("POSTING.....");
    fetch("http://localhost:5000/article", {
      method: "POST",
      mode: "cors",
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": `JWT ${authData.accessToken}`
      },
      credentials: 'include',
      body: JSON.stringify({
        title,
        content: contentState,
        author: authData.user.firstName+" "+authData.user.lastName,
        tags
      }),
    })
      .then(res => res.json())
      .then(data => {
        window.location.reload();
      })
      .catch(err => console.error(err));

    console.log(draftToHtml(contentState));
  };
  const contentStateChangeHandler = contentState => {
    setContentState(contentState);
  };
  const handleTitleChange = e => {
    setTitle(e.target.value);
  };
  const handleTagChange = e => {
    setTags(e);
  }
  const { Option } = Select;
  React.useEffect(() => {
    console.log("whoosh");
  }, []);

  return (
    authData.user && authData.user.educatorStatus!=="approved" ?<Redirect to="/dashboard" />
    :
    <Card className={s.wrapper} bodyStyle={{ padding: 45 }}>
       <div style={{ position: "absolute", top: "-100px", left: "-50px" }}>
          <img style={{ height: "250px", width: "250px" }} src={writeIcon} />
        </div>
      <div className={s.cardHeader}>Create or edit articles</div>
      <div className={s.cardSubHeader}>
        Use this editor to crate your new masterpiece.It will be visible to the
        public
      </div>

      <Input
        onChange={handleTitleChange}
        value={title}
        placeholder="Title..."
      />

      <Divider />
      <Editor
        wrapperClassName={s.editorWrapper}
        editorClassName={s.textAreaWrapper}
        onContentStateChange={contentStateChangeHandler}
        defaultContentState={fakeContent}
      />
      <Select
        mode="multiple"
        placeholder="Add tags (optional)"
        defaultValue={null}
        value={tags || []}
        style={{ width: "100%",margin:"30px auto" }}
        onChange={handleTagChange}
      >
        <Option value="Dynamic Programming">Dynamic Programming</Option>
        <Option value="DFS">DFS</Option>
        <Option value="BFS" >
          BFS
      </Option>
        <Option value="Linked List">Linked List</Option>
        <Option value="Stack">Stack</Option>
        <Option value="Queue">Queue</Option>
        <Option value="Binary Search">Binary Search</Option>
        <Option value="Data Structures And Algorithms">Data Structures And Algorithms</Option>
        <Option value="Development">Development</Option>

      </Select>
      <Button
        style={{ float: "right", marginTop: "20px" }}
        size="large"
        type="primary"
        onClick={handleArticleSubmit}
      >
        Submit article
      </Button>
    </Card>
  );
};

export default EditArticleView;
