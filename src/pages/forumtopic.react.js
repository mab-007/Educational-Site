import React, { useContext } from 'react';
import queryString from "query-string";
import { withRouter } from "react-router-dom";
import { UserOutlined } from '@ant-design/icons';
import { Table, Button, Avatar, Card, Row, Col, Divider } from 'antd';
import s from "./forumtopic.module.css"
import { AuthContext } from "../App";

const { Column  } = Table;

const Forumtopic = props => {

    const [Topic, setTopic] = React.useState({});
    const [comm, setComm] = React.useState("");
    const [commPost, setCommPost] = React.useState();

    const authData = useContext(AuthContext);

    React.useEffect(() => {
        const qParams = queryString.parse(props.location.search);
        if (authData && authData.accessToken) {
            fetch(`http://localhost:5000/topics/${qParams.id}`, {
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
                //console.log(data.comm);
                setCommPost(data.comm);
                setTopic(data);
            })
            
            .catch(err => console.error(err));
        }
    });

        const data = [
            {
                key: '1',
                author: Topic.author,
                message: Topic.title,
            },
            {
                key: Topic.id,
                author: Topic.date,
                message: Topic.content
            },
        ];

        const handleSubmit = () => {
            //console.log(comm);
            const qParams = queryString.parse(props.location.search);
            if (authData && authData.accessToken) {
                fetch(`http://localhost:5000/topics/${qParams.id}`, {
                    method: "POST",
                    withCredentials: true,
                    mode:"cors",
                    credentials:"include",
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `JWT ${authData.accessToken}`
                    },
                    body: JSON.stringify({
                        author: authData.user,
                        comm,
                    })
                })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    allComment();
                    setComm("");
                })
                .catch(err => console.log(err));
            }
        };
        
        const allComment = () => {
            const qParams = queryString.parse(props.location.search);
            fetch(`http://localhost:5000/topics/${qParams.id}`, {
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
                setCommPost(data.comm);
                setTopic(data);
            })
            
            .catch(err => console.error(err));
        
        }

        return(
            <React.Fragment>
            <div>
            <div className="container my-3">
                {/*<nav className="breadcrumb">
                    <Link to="/forum" className="breadcrumb-item text-secondary">Board index</Link>
                    <span className="breadcrumb-item active">{Topic.title}</span>
                </nav>*/}
                <Card bodyStyle={{ padding: 15 }} style={{width:"75vw"}} style={{ margin:"45px auto"}} className={s.bodyCard}>
                    <div className={s.header}>Forum </div>
                    <div className={s.subHeader}>
                        Welcome,{authData && authData.user &&  authData.user.firstName}
                    </div>
                    <Divider />
                
                <div className="row bg-light">
                    <div className="col-12">
                        <h2 className="h4 text-white bg-secondary mb-0 p-4 rounded-top">{Topic.title}</h2>
                        <Table className="table table-striped table-bordered table-responsive-lg" dataSource = { data }>
                        <Column scope="col" className="thead-light" title="Author" dataIndex="author" key="author"/>
                        <Column scope="col" className="thead-light" title="message" dataIndex="message" key="message"/>
                        </Table>
                    </div>
                </div>
                <br/>
                <form className="mb-3">
                    <div className="form-group">
                        <label htmlFor="comment">Reply to this post:</label>
                        <textarea className="form-control" id="comment" rows="3"  placeholder="Write your comment here." value={comm} onChange={e =>setComm(e.target.value)}></textarea>
                    </div>
                    <Button className="btn btn-primary" onClick={handleSubmit}>Reply</Button>
                </form>
                
                <div>
                    {commPost && 
                    commPost.map((c)=> {
                        return (
                            <Card className={s.comment}>
                                <Row>
                                <Col className={s.usericon}>
                                    <Avatar size={34} icon={<UserOutlined />} />
                                </Col>
                                <Col className={s.commentinfo}>
                                    <Row className={s.row}>
                                        <div className={s.name}>{c.author}</div>
                                    </Row>
                                    <Row className={s.row}>
                                        <div className={s.text}>{c.comm}</div>
                                    </Row>
                                </Col>
                                </Row>
                            </Card>
                        )
                    })}
                </div>
                </Card>
            </div> 
            </div>
            </React.Fragment>
        );

}

export default withRouter(Forumtopic);