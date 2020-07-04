import React, { useContext, useState, useEffect, useMemo } from "react";
import s from "./MyStudyPlan.module.css";
import { Card, Button, Input, Divider, Avatar, List } from "antd";
import { Typography } from "antd";
import { AuthContext } from "../../App";
import { PlusCircleOutlined } from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";
import groupStudyIcon from "../../images/group_study_2.svg";
import scrumIcom from "../../images/scrum.svg";

const { Title } = Typography;

const MyStudyPlanView = props => {

    const authData = useContext(AuthContext);
    const [studyPlans, setStudyPlans] = useState([]);
    const [searchText, setSearchText] = useState("");


    const hadnleSearchTextChange = (e) => {
        setSearchText(e.target.value);
    }

    const filteredItems = useMemo(() => {
        if (!searchText) return studyPlans;
        return studyPlans.filter(e => e.title.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));
    }, [searchText, studyPlans])

    useEffect(() => {
        if (authData && authData.user)
            fetch(`http://localhost:5000/studyplan/user/${authData.user.email}`, {
                mode: "cors",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": `JWT ${authData.accessToken}`
                },
                credentials: 'include',
            })
                .then(res => res.json())
                .then(data => { console.log(data); setStudyPlans(data) })
    }, [authData])

    const [isOpenCreationModal, setIsOpenCreationModal] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setNewDescription] = useState("");

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }
    const handleDescriptionChange = (e) => {
        setNewDescription(e.target.value);
    }
    const handleOpenCreateNewItemModal = () => {
        setIsOpenCreationModal(!isOpenCreationModal);
    }

    const handleCreateNewItem = async () => {

        const data = await fetch(fetch(`http://localhost:5000/studyplan/`, {
            method: "POST",
            mode: "cors",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": `JWT ${authData.accessToken}`
            },
            credentials: 'include',
            body: JSON.stringify({
                createdBy: authData.user.email,
                title,
                members : [authData.user.email],
                description: description
            })
        }))
        const _ = await fetch(`http://localhost:5000/studyplan/user/${authData.user.email}`, {
            mode: "cors",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": `JWT ${authData.accessToken}`
            },
            credentials: 'include',
        })
        const response = await _.json();
        console.log(response)
        setStudyPlans(response);
        handleOpenCreateNewItemModal();
    }
    return (
        studyPlans && studyPlans.length ?
            <>
                <Card style={{width:"75vw",margin:"45px auto"}}>
                    <div style={{position:"absolute", top:"-100px", left:"-50px"}}>
                        <img style={{height:"360px", width:"360px"}} src={groupStudyIcon}/>
                    </div>
                    <div className={s.header}>Your Study Plans</div>
                    <div className={s.subHeader}>Find all study plans that you created or were added to.</div>
                    <br />
                    <div className={s.newItemInput} style={{ width: "30%", margin: "10px auto", display:"flex", justifyContent:"center", alignItems:"flex-start" }}>
                       <span className={s.smallerHeader}>Search &nbsp;</span> 
                        
                        <Input placeholder="Search for a study plan" onChange={hadnleSearchTextChange} value={searchText} />
                          
                    </div>
                    <br />
                    <br />
                    <div>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", width: "100%" }}>

                            {
                                studyPlans && filteredItems.map(
                                    item => {
                                        return (
                                            <Card hoverable={true} style={{ width: "500px", height: "250px", margin: "15px" }}>
                                                <Card.Meta
                                                    avatar={<Avatar size="large" src={scrumIcom}/>}
                                                    title={<a href={`/studyplan?id=${item._id}`} target="_blank">{item.title}</a>}
                                                    description={
                                                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                            <div className={s.smallerText} style={{ textAlign: "left !important" }}>
                                                                Created by : {item.createdBy}
                                                            </div>
                                                            <div>
                                                                {item.description}
                                                            </div>
                                                        </div>}
                                                />
                                            </Card>
                                        )
                                    }
                                )
                            }
                            <Button type="dashed" style={{ width: "500px", height: "250px", margin: "15px", background: "#f8f9fb" }}
                                onClick={handleOpenCreateNewItemModal}
                            >
                                <div style={{ fontSize: "32px", color: "rgb(94, 147, 173)" }}>
                                    <PlusCircleOutlined />
                                </div>
                                <br />
                                <div className={s.smallerHeader}>
                                    Add a new Study Plan
                            </div>
                            </Button>
                        </div>
                    </div>
                </Card>

                <Modal
                    title="Add a new study item!"
                    visible={isOpenCreationModal}
                    centered
                    onOk={handleOpenCreateNewItemModal}
                    onCancel={handleOpenCreateNewItemModal}
                    footer={null}
                    destroyOnClose={true}
                >
                    <div className={s.paraStyle}>
                        Create a new group study plan. After creation, add your friends and set common goals and deadlines and work together to achieve them!
                </div>
                    <br />
                    <div className={`inputFieldWrapper ${s.inputFieldWrapper}`}>
                        <div className={s.inputLabel}>
                            Title
                    </div>
                        <div className={s.newItemInput}>
                            <Input
                                className={s.newItemInput} onChange={handleTitleChange} value={title} />
                        </div>
                    </div>
                    <div className={`inputFieldWrapper ${s.inputFieldWrapper}`}>
                        <div className={s.inputLabel}>
                            Description
                    </div>
                        <div className={s.newItemInput}>
                            <Input
                                className={s.newItemInput} onChange={handleDescriptionChange} value={description} />
                        </div>
                    </div>
                    <br />
                    <Button type="primary" centered onClick={handleCreateNewItem}>Create new Group Study Plan!</Button>
                </Modal>
            </>
            :
            <div>
                Nothing found
        </div>
    )
}
export default MyStudyPlanView;