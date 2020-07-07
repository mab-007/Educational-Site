import React, { useContext, useState } from 'react';
import { Popconfirm, Alert, Button, Form, Input, Card, Divider } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { AuthContext } from "../App";
import s from "./ForumDashboard.module.css";
import writeIcon from "../images/write.svg";

const { TextArea } = Input;
const NewTopic = (props) => {
    
    const authData = useContext(AuthContext);

    const [title, setTitle] = useState("");
    const [context, setContext] = useState("");
    const [titleErr, setTitileErr] = useState("");
    const [contextErr, setContextErr] = useState("");

    const validate = () => {
        let titleErr = "";
        let contextErr = "";

        if(!(title !== "")) {
            titleErr = <Alert message="The Above field cannot be left empty" type="warning" closable showIcon />;
        }

        setTitileErr(titleErr)

        if(context === "") {
            contextErr = <Alert message="The Above field cannot be left empty" type="warning" closable showIcon />;
        }

        setContextErr(contextErr)

        if(!titleErr && !contextErr) {
            return true;
        }else {
            return false;
        }
    }

    const submitHandler = (event) => {
        event.preventDefault();
        if(!validate()) {
            return;
        }
        
        console.log({title, context});
        if (authData && authData.accessToken) {
            fetch(`http://localhost:5000/topics`, {
                method: "POST",
                withCredentials: true,
                mode:"cors",
                credentials:"include",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `JWT ${authData.accessToken}`
                },
                body: JSON.stringify({
                    title,
                    content: context,
                    author: authData.user.firstName,
                })
                })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                })
                .catch(err => console.error(err));
            
        }
    };

    const onConfirm= () => {
        if(titleErr || contextErr){
            return;
        }
        window.location.assign("/forum");
    }

    return (
        <React.Fragment>
            <Card bodyStyle={{ padding: 15 }} style={{width:"75vw",  margin:"45px auto"}} className={s.bodyCard}>
            <div style={{ position: "absolute", top: "-100px", left: "-50px" }}>
            <img style={{ height: "250px", width: "250px" }} src={writeIcon} />
            </div>
                <div className={s.header}>Forum </div>
                <div className={s.subHeader}>
                    Welcome,{authData && authData.user &&  authData.user.firstName}
                </div>
                <Divider />
            <div className="container my-3">
                {/*<nav className="breadcrumb">
                    <Link to="/forum" className="breadcrumb-item text-secondary">Board index</Link>
                    <span className="breadcrumb-item active">Create new topic</span>
                </nav>*/}
                <div className={s.header} style={{textAlign:"left"}}>Create a new topic</div>
                <Form>
                    <label htmlFor="topic">Topic</label>
                    <TextArea row={2} onChange={e=>setTitle(e.target.value)} placeholder="Give your topic a title." allowClear/>
                    {titleErr}
                    <br/>
                    <br/>
                    <label htmlFor="content">Content:</label>
                    <TextArea rows={10} onChange={e=>setContext(e.target.value)} placeholder="Write your content here." allowClear/>
                    {contextErr}
                    <br/><br/>
                    <Popconfirm title="Are you sure？" icon={<QuestionCircleOutlined style={{ color: 'red' }} />} onConfirm={onConfirm}>
                    <Button type="submit" className="btn btn-primary" onClick={submitHandler} >Post</Button>
                    </Popconfirm>
                    
                </Form>
            </div>
            </Card>
            
        </React.Fragment>
    )
}

export default NewTopic;