import React, { useContext, useState, useEffect, useMemo } from "react";
import s from "./StudyPlan.module.css";
import { Card, Button, Input, Divider, Avatar, List, Modal, Row, Col, Tag, Select, message } from "antd";
import { Typography } from "antd";
import { AuthContext } from "../../App";
import queryString from "query-string";
import Search from "antd/lib/input/Search";


const { Title } = Typography;
const colors = ["rgb(62, 141, 120)", "yellow", "orange", "rgb(45, 145, 247)", "red"]

const StudyPlanView = props => {
    const authData = useContext(AuthContext);
    const [studyPlan, setStudyPlan] = useState(null);
    const [studyPlanItems, setStudyPlanItems] = useState([])
    const [isMemberAdditionModalOpen, setIsMemberAdditionModalOpen] = useState(false);
    const [isOpenCreationModal, setIsOpenCreationModal] = useState(false);


    useEffect(() => {
        const qParams = queryString.parse(props.location.search);
        const studyPlanID = qParams.id;
        if (authData && authData.accessToken) {
            fetch(`http://localhost:5000/studyplan/${studyPlanID}`, {
                mode: "cors",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": `JWT ${authData.accessToken}`
                },
                credentials: 'include',
            })
                .then(res => res.json())
                .then(async data => {
                    if (data.members.indexOf(authData.user.email) == -1) window.location = "/dashboard";
                    setStudyPlan(data);
                    const studyPlanItems = await fetch(`http://localhost:5000/studyplan/${studyPlanID}/studyPlanItems`, {
                        mode: "cors",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            "Authorization": `JWT ${authData.accessToken}`
                        },
                        credentials: 'include',
                    });

                    if (studyPlanItems.ok && studyPlanItems.status === 200)
                        return studyPlanItems.json()
                })
                .then(studyPlanItemsData => setStudyPlanItems(studyPlanItemsData))
        }
    }, [authData])

    const openMemberAdditionModal = () => {
        setIsMemberAdditionModalOpen(!isMemberAdditionModalOpen);
    }

    const handleMemberAddition = (email) => {
        fetch(`http://localhost:5000/student/${email}`, {
            mode: "cors",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": `JWT ${authData.accessToken}`
            },
            credentials: 'include',
        })
            .then(res => {
                if (res.ok && res.status === 200) return res.json();
                else throw new Error("User does not exist")
            })
            .then(async data => {
                const newMemberList = studyPlan.members;
                if (newMemberList.indexOf(data.email) == -1) newMemberList.push(data.email)
                const newStudyPlan = { ...studyPlan, members: newMemberList }
                const result = await fetch(`http://localhost:5000/studyplan/`, {
                    method: "PUT",
                    mode: "cors",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        "Authorization": `JWT ${authData.accessToken}`
                    },
                    credentials: 'include',
                    body: JSON.stringify(newStudyPlan)
                })
                if (result.ok && result.status === 200)
                    return newStudyPlan;
            })
            .then(newStudyPlan => { console.log(newStudyPlan); setStudyPlan(newStudyPlan); openMemberAdditionModal() })
            .catch(err => {
                console.error(err)
                message.error('This user does not exist. Please make sure you have used the correct user name.');
            })
    }

    const handleProgress = (nextList, currentList, studyPlanItem) => {
        let inProgressList = studyPlanItem.inProgressList;
        let completedList = studyPlanItem.completedList;
        let notStartedList = studyPlanItem.notStartedList;

        switch (nextList) {
            case "in progress":
                inProgressList.push(authData.user.email);
                break;
            case "completed":
                completedList.push(authData.user.email);

        }

        switch (currentList) {
            case "in progress":
                inProgressList = inProgressList.filter(email => email != authData.user.email);
                break;
            case "not started":
                notStartedList = notStartedList.filter(email => email != authData.user.email);

        }

        const newStudyPlanItem = {
            ...studyPlanItem,
            notStartedList,
            completedList,
            inProgressList
        }

        fetch(`http://localhost:5000/studyplanitem/`, {
            method: "PUT",
            mode: "cors",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": `JWT ${authData.accessToken}`
            },
            body: JSON.stringify(newStudyPlanItem),
            credentials: 'include',
        })
            .then(res => res.text())
            .then(async (data) => {

                console.log("FETCHING NEW STUDY ITEMS");

                const qParams = queryString.parse(props.location.search);
                const studyPlanID = qParams.id;

                const studyPlanItems = await fetch(`http://localhost:5000/studyplan/${studyPlanID}/studyPlanItems`, {
                    mode: "cors",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        "Authorization": `JWT ${authData.accessToken}`
                    },
                    credentials: 'include',
                });
                console.log(studyPlanItems)
                if (studyPlanItems.ok && studyPlanItems.status === 200)
                    return studyPlanItems.json()
            })
            .then(studyPlanItemsData => setStudyPlanItems(studyPlanItemsData))
            .catch(err => console.error(err))


    }




    /*-----------------------------------------------------------------------------------------------*/

    const [newStudyItemTitle, setNewStudyItemTitle] = useState("");
    const [newStudyItemDescription, setNewStudyItemDescription] = useState("");
    const [newStudyItemDeadline, setNewStudyItemDeadline] = useState("");
    const [newStudyItemTags, setNewStudyItemTags] = useState("");
    const [searchText, setSearchText] = useState("");
    const [sortCondition, setSortCondition] = useState(null);

    const filterBySearchText = (list) => {
        if (searchText === "") return list;
        return list.filter(item => item.title.includes(searchText));

    }

    const filteredStudyPlanItems = useMemo(() => {
        const temp =  sortCondition?[...studyPlanItems].sort((a, b) =>
        b[sortCondition].localeCompare(a[sortCondition]),
      ):studyPlanItems;
        return filterBySearchText(temp)
    }, [searchText, studyPlanItems, sortCondition])

    const handleCreateNewItem = () => {
        const newStudyPlanItem = {
            title: newStudyItemTitle,
            description: newStudyItemDescription,
            completeBy: newStudyItemDeadline,
            tags: newStudyItemTags,
            notStartedList: studyPlan.members,
            inProgressList: [],
            completedList: [],
            status: "not started",
            studyPlanID: studyPlan._id
        }
        fetch(`http://localhost:5000/studyplanitem/`, {
            method: "POST",
            mode: "cors",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": `JWT ${authData.accessToken}`
            },
            body: JSON.stringify(newStudyPlanItem),
            credentials: 'include',
        })
            .then(res => res.json())
            .then(async (data) => {

                console.log("FETCHING NEW STUDY ITEMS");

                const qParams = queryString.parse(props.location.search);
                const studyPlanID = qParams.id;

                const studyPlanItems = await fetch(`http://localhost:5000/studyplan/${studyPlanID}/studyPlanItems`, {
                    mode: "cors",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        "Authorization": `JWT ${authData.accessToken}`
                    },
                    credentials: 'include',
                });
                console.log(studyPlanItems)
                if (studyPlanItems.ok && studyPlanItems.status === 200)
                    return studyPlanItems.json()
            })
            .then(studyPlanItemsData => {setStudyPlanItems(studyPlanItemsData);setIsOpenCreationModal(false)})
            .catch(err => console.error(err))
    }
    const handleTitleChange = (e) => {
        setNewStudyItemTitle(e.target.value);
    }
    const handleDescriptionChange = (e) => {
        setNewStudyItemDescription(e.target.value);
    }
    const handleCommpleteByChange = (e) => {
        setNewStudyItemDeadline(e.target.value);
    }

    const handleNewTagsChange = (e) => {
        const values = e.target.value || "";
        const tags = values.split(",");
        setNewStudyItemTags(tags.length === 0 ? [] : tags);
    }
    const handleOpenCreateNewItemModal = () => {
        setIsOpenCreationModal(!isOpenCreationModal)
    }

    const handleSearchTextChange = (e) => {
        setSearchText(e.target.value);
    }

    const handleSort = (value) => {
        setSortCondition(value);
    }
    return (
        <div>

            <Card
                title={null}
                style={{ width: "100%", padding: 50 }}
            //  hoverable={true}
            >
                <div className={s.header}>
                    {studyPlan && studyPlan.title}
                </div>


                <div className={s.descriptionArea}>
                    <div className={s.subHeader}>
                        {studyPlan && studyPlan.description}
                    </div>
                </div>

                {studyPlan && <div className={s.membersArea}>
                    <div className={s.smallHeader}>
                        Members <Button style={{ marginLeft: 200 }} onClick={openMemberAdditionModal}>Add new member</Button>
                    </div>
                    {
                        studyPlan.members.map(
                            member => {
                                return (
                                    <div style={{ margin: "10px 0" }}>
                                        <Avatar style={{ backgroundColor: colors[member.toUpperCase().charCodeAt(0) % colors.length], verticalAlign: 'middle' }} size="large" gap={4}>
                                            {member.toUpperCase().charAt(0)}
                                        </Avatar>
                                        <span style={{ marginLeft: 35 }}>{member}</span>
                                    </div>

                                )
                            }
                        )
                    }
                </div>
                }


                <div style={{ margin: "30px 0", display: "flex", width: "100%", justifyContent: "space-between" }}>
                    <div className={s.newItemInput} style={{ width: "30%" }}>
                        <Input placeholder="Filter study plan items by name" onChange={handleSearchTextChange} value={searchText} />
                    </div>
                    <div style={{ width: "30%" }}>
                        Sort By : &nbsp;  
                        <Select
                            defaultValue={null}
                            style={{ width: 200 }}
                            onChange={handleSort}
                        >
                            <Select.Option value={null}>None</Select.Option>
                            <Select.Option value="completeBy">Deadline</Select.Option>
                            <Select.Option value="title">Title</Select.Option>
                        </Select>
                    </div>

                </div>
                <Divider > Study Plan Items </Divider>

                <div className={s.studyPlanItemsWrapper}>

                    <div className={s.studyPlanItemsSectionWrapper}>

                        <Row>
                            <Col xs={20} sm={20} md={8} lg={8}>
                                <div className={s.smallHeader} style={{ width: "90%" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
                                        <Tag color="red" style={{ fontSize: "16px" }}>
                                            Not Started
                                    </Tag>
                                        <div onClick={handleOpenCreateNewItemModal} style={{ cursor: "pointer", color: "grey", fontSize: "18px", fontWeight: "bold" }}>
                                            +
                                    </div>
                                    </div>

                                    {
                                        studyPlan && filteredStudyPlanItems.filter(studyPlanItem => studyPlanItem.status === "not started").map(
                                            studyPlanItem => {
                                                return (
                                                    <Card
                                                        title={null}
                                                        style={{ width: "100%", padding: 15, margin: "20px  0" }}
                                                        hoverable={true}
                                                        actions={[
                                                            studyPlanItem.notStartedList && studyPlanItem.notStartedList.indexOf(authData.user.email) != -1 ?
                                                                <div onClick={e => handleProgress("in progress", "not started", studyPlanItem)}>
                                                                    <Button>Mark In Progress ✔</Button>
                                                                </div> :
                                                                studyPlanItem.inProgressList && studyPlanItem.inProgressList.indexOf(authData.user.email) != -1 ?
                                                                    <div onClick={e => handleProgress("completed", "in progress", studyPlanItem)}>
                                                                        <Button>Mark Completed 🔥</Button>
                                                                    </div> : <span />,
                                                            <Button>
                                                                <a
                                                                    target="_blank"
                                                                    style={{ textDecoration: "none" }}
                                                                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${studyPlanItem.title.replace(/[^a-zA-Z0-9 ]/g, "")}&dates=${studyPlanItem.completeBy.replace(/[-:]/g, "")}/${(studyPlanItem.completeBy.replace(/[-:]/g, ""))}&ctz=India&details=${studyPlanItem.description.replace(/[^a-zA-Z ]/g, "")}`}>
                                                                    Add to Calender 📅
                                                               </a>
                                                            </Button>
                                                        ]}
                                                    >

                                                        <span style={{ fontSize: "18px" }}>
                                                            {studyPlanItem.title}
                                                        </span>
                                                        <div>
                                                            Deadline : {new Date(studyPlanItem.completeBy).toLocaleString()} &nbsp;⏰
                                                        </div>
                                                        <br />
                                                        <div className={s.paraStyle}>
                                                            {studyPlanItem.description}
                                                        </div>
                                                        <br />
                                                        <div>
                                                            {
                                                                studyPlanItem.tags && studyPlanItem.tags.map(
                                                                    tag => {
                                                                        return (
                                                                            <Tag color="green">
                                                                                {tag}
                                                                            </Tag>
                                                                        )
                                                                    }
                                                                )
                                                            }
                                                        </div>
                                                        <br />
                                                        <br />
                                                        <div className={s.smallerHeader}>
                                                            Status
                                                        </div>
                                                        <div className={s.notStartedList}>
                                                            {
                                                                studyPlanItem.notStartedList.map(
                                                                    inProgressMember => {
                                                                        return (
                                                                            <div>
                                                                                {inProgressMember} has not started yet &nbsp;<span style={{ color: "red" }}>‼</span>.
                                                                            </div>
                                                                        )
                                                                    }
                                                                )
                                                            }
                                                        </div>
                                                        <div className={s.inProgressList}>
                                                            {
                                                                studyPlanItem.inProgressList.map(
                                                                    inProgressMember => {
                                                                        return (
                                                                            <div>
                                                                                {inProgressMember} has started working on this &nbsp;<span style={{ color: "green" }}>✔</span>.
                                                                            </div>
                                                                        )
                                                                    }
                                                                )
                                                            }
                                                        </div>

                                                        <div className={s.completedList}>
                                                            {
                                                                studyPlanItem.completedList.map(
                                                                    completedMember => {
                                                                        return (
                                                                            <div>
                                                                                {completedMember} has completed this task! &nbsp;<span>🔥</span>
                                                                            </div>
                                                                        )
                                                                    }
                                                                )
                                                            }
                                                        </div>
                                                    </Card>
                                                )
                                            }
                                        )
                                    }
                                </div>
                            </Col>
                            <Col xs={20} sm={20} md={8} lg={8}>
                                <div className={s.smallHeader} style={{ width: "90%" }}>
                                    <Tag color="orange" style={{ fontSize: "16px" }}>
                                        In Progress
                                    </Tag>
                                    {
                                        studyPlan && filteredStudyPlanItems.filter(studyPlanItem => studyPlanItem.status === "in progress").map(
                                            studyPlanItem => {
                                                return (
                                                    <Card
                                                        title={
                                                            null
                                                        }
                                                        style={{ width: "100%", padding: 15, margin: "20px  0" }}
                                                        hoverable={true}

                                                        actions={[
                                                            studyPlanItem.inProgressList && studyPlanItem.inProgressList.indexOf(authData.user.email) != -1 ?
                                                                <div onClick={e => handleProgress("completed", "in progress", studyPlanItem)}>
                                                                    <Button>Mark Completed 🔥</Button>
                                                                </div> : <span />,

                                                            <Button>
                                                                <a
                                                                    target="_blank"
                                                                    style={{ textDecoration: "none" }}
                                                                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${studyPlanItem.title.replace(/[^a-zA-Z0-9 ]/g, "")}&dates=${studyPlanItem.completeBy.replace(/[-:]/g, "")}/${(studyPlanItem.completeBy.replace(/[-:]/g, ""))}&ctz=India&details=${studyPlanItem.description.replace(/[^a-zA-Z ]/g, "")}`}>
                                                                    Add to Calender 📅
                                                                </a>
                                                            </Button>
                                                        ]}
                                                    >

                                                        <div style={{ fontSize: "18px" }}>
                                                            {studyPlanItem.title}
                                                        </div>
                                                        <div>
                                                            Deadline : {new Date(studyPlanItem.completeBy).toLocaleString()} &nbsp;⏰
                                                        </div>
                                                        <br />
                                                        <div className={s.paraStyle}>
                                                            {studyPlanItem.description}
                                                        </div>
                                                        <br />
                                                        <div>
                                                            {
                                                                studyPlanItem.tags && studyPlanItem.tags.map(
                                                                    tag => {
                                                                        return (
                                                                            <Tag color="green">
                                                                                {tag}
                                                                            </Tag>
                                                                        )
                                                                    }
                                                                )
                                                            }
                                                        </div>
                                                        <br />
                                                        <br />
                                                        <div className={s.smallerHeader}>
                                                            Status
                                                        </div>

                                                        <div className={s.inProgressList}>
                                                            {
                                                                studyPlanItem.inProgressList.map(
                                                                    inProgressMember => {
                                                                        return (
                                                                            <div>
                                                                                {inProgressMember} has started working on this &nbsp;<span style={{ color: "green" }}>✔</span>.
                                                                            </div>
                                                                        )
                                                                    }
                                                                )
                                                            }
                                                        </div>

                                                        <div className={s.completedList}>
                                                            {
                                                                studyPlanItem.completedList.map(
                                                                    completedMember => {
                                                                        return (
                                                                            <div>
                                                                                {completedMember} has completed this task! &nbsp;<span>🔥</span>
                                                                            </div>
                                                                        )
                                                                    }
                                                                )
                                                            }
                                                        </div>
                                                    </Card>
                                                )
                                            }
                                        )
                                    }
                                </div>
                            </Col>
                            <Col xs={20} sm={20} md={8} lg={8}>
                                <div className={s.smallHeader}>
                                    <Tag color="green" style={{ fontSize: "16px" }}>
                                        Completed! 🙌
                                    </Tag>
                                    {
                                        studyPlan && filteredStudyPlanItems.filter(studyPlanItem => studyPlanItem.status === "completed").map(
                                            studyPlanItem => {
                                                return (
                                                    <Card
                                                        title={
                                                            null
                                                        }
                                                        style={{ width: "100%", padding: 15, margin: "20px  0" }}
                                                        hoverable={true}
                                                    >

                                                        <div style={{ fontSize: "18px" }}>
                                                            {studyPlanItem.title}
                                                        </div>
                                                        <div>
                                                            Deadline : {new Date(studyPlanItem.completeBy).toLocaleString()} &nbsp;⏰
                                                        </div>
                                                        <br />
                                                        <div className={s.paraStyle}>
                                                            {studyPlanItem.description}
                                                        </div>
                                                        <br />
                                                        <div>
                                                            {
                                                                studyPlanItem.tags && studyPlanItem.tags.map(
                                                                    tag => {
                                                                        return (
                                                                            <Tag color="green">
                                                                                {tag}
                                                                            </Tag>
                                                                        )
                                                                    }
                                                                )
                                                            }
                                                        </div>
                                                        <br />
                                                        <br />
                                                        <div className={s.smallerHeader}>
                                                            Status
                                                        </div>

                                                        <div className={s.completedList}>
                                                            {
                                                                studyPlanItem.completedList.map(
                                                                    completedMember => {
                                                                        return (
                                                                            <div>
                                                                                {completedMember} has completed this task! &nbsp;<span>🔥</span>
                                                                            </div>
                                                                        )
                                                                    }
                                                                )
                                                            }
                                                        </div>
                                                    </Card>
                                                )
                                            }
                                        )
                                    }
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Card>

            <Modal
                title="Add a friend!"
                visible={isMemberAdditionModalOpen}
                centered
                onOk={openMemberAdditionModal}
                onCancel={openMemberAdditionModal}
                footer={null}
            >
                <div className={s.paraStyle}>
                    Use this to add a new member to your study group!
                    Members added to this group will be able to add new study items, add comments and set deadlines.
                </div>
                <br />
                <Search
                    placeholder="Enter your friend's user id/email"
                    onSearch={handleMemberAddition}
                    enterButton="Add"
                    size="large"
                    style={{ fontSize: "11px" }}
                />

            </Modal>

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
                    Create a new study plan item. Specify a deadline and add the item to your google calender to get a reminder before the deadline!
                    Use this feature to keep track of where all your groupmates are with regards to the study plan.
                </div>
                <br />
                <div className={`inputFieldWrapper ${s.inputFieldWrapper}`}>
                    <div className={s.inputLabel}>
                        Specify a title
                    </div>
                    <div className={s.newItemInput}>
                        <Input
                            className={s.newItemInput}
                            placeholder="Study Item Title" onChange={handleTitleChange} value={newStudyItemTitle} />
                    </div>
                </div>
                <div className={`inputFieldWrapper ${s.inputFieldWrapper}`}>
                    <div className={s.inputLabel}>
                        Specify a description
                    </div>
                    <div className={s.newItemInput}>
                        <Input
                            className={s.newItemInput}
                            placeholder="Study Item Description" onChange={handleDescriptionChange} value={newStudyItemDescription} />
                    </div>
                </div>

                <div className={`inputFieldWrapper ${s.inputFieldWrapper}`}>
                    <div className={s.inputLabel}>
                        Specify a deadline
                    </div>
                    <div className={s.newItemInput}>
                        <Input
                            className={s.newItemInput}
                            placeholder="Study Item Deadline with format : yyyy-mm-ddThh:mm:ss" onChange={handleCommpleteByChange} value={newStudyItemDeadline} />
                    </div>
                </div>
                <div className={`inputFieldWrapper ${s.inputFieldWrapper}`}>
                    <div className={s.inputLabel}>
                        Specify optional tags
                    </div>
                    <div className={s.newItemInput}>
                        <Input
                            className={s.newItemInput}
                            placeholder="Add tags, separated by commas" onChange={handleNewTagsChange} value={newStudyItemTags} />
                    </div>
                </div>
                <br />
                <Button type="primary" centered onClick={handleCreateNewItem}>Create new Study Plan Item!</Button>
            </Modal>
        </div>
    )
}

export default StudyPlanView;