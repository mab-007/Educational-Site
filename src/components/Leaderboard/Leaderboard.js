import React, { Component, useEffect, useState, useContext } from 'react';
import s from './Leaderboard.module.css';
import groupBy from 'lodash/groupBy';
import { AuthContext } from '../../App';
import { Table, Card } from 'antd';
import { CrownOutlined } from '@ant-design/icons';
import winnerIcon from "../../images/winner.svg";

const Leaderboard = (props) => {
	const authData = useContext(AuthContext);
	const [article, setArticles] = useState(null);
	const [rows, setRows] = useState(null);

	// componentDidMount(){
	// 	this.renderTable();
	// }
	const printTable = () => {
		let arr = groupBy(article, "author");
		let m = [];
		console.log(arr);
		for (let group in arr) {
			let name = "";
			let avgRating = 0, c = 0;
			for (let prop in arr[group]) {
				console.log(arr[group][prop]);
				name = arr[group][prop].author;
				//console.log(name);
				if (arr[group][prop].avgRating !== undefined) {
					avgRating = avgRating + arr[group][prop].avgRating;
				}
				c = c + 1;

			}
			console.log(avgRating / c);
			let a = [(avgRating / c).toFixed(2), name];
			m.push(a);
			//console.log(this.state.rows);
		}
		m.sort();
		m.reverse();
		let i = 0;
		const newRows = m.map(() => {
			i = i + 1;
			return (
				{
					rank: i,
					name: m[i - 1][1],
					avgRating: m[i - 1][0]
				}
			);
		})
		setRows(newRows);

	}
	useEffect(() => {
		//const qParams=queryString.parse(this.location.search);
		let x = null;
		if (!article)
			fetch("http://localhost:5000/article", {
				mode: "cors",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					"Authorization": `JWT ${authData.accessToken}`
				},
				credentials: 'include',
			})
				.then(res => res.json())
				.then(data => {
					console.log(data);
					x = data;
					setArticles(x);
				})
				.catch(err => console.error(err));

	}, [article])
	useEffect(() => {
		if (article) {
			printTable();
		}
	}, [article])

	const columns = [
		{
			title: "Rank",
			dataIndex: "rank",
			ley: "rank"
		},
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			render: (name, _, idx) => {
				return (
					<>
						{name} &nbsp;
						{idx === 0 && <div style={{
							position: "absolute", zIndex: "999", color: "yellow", fontSize: "32px", top: "-20px",
							left: "-20px",
							transform: "rotateY(0deg) rotate(-45deg)"
						}}><CrownOutlined /> &nbsp;</div>}
					</>
				)
			}
		}, {
			title: "Average Rating",
			dataIndex: "avgRating",
			key: "avgRating"
		}
	]
	//this.renderTable();
	//console.log(this.state.rows);
	return (
		<Card style={{width:"75vw", margin:"45px auto"}}>
			<div style={{ position: "absolute", top: "-100px", left: "-50px" }}>
				<img style={{ height: "300px", width: "300px" }} src={winnerIcon} />
			</div>
			<div className={s.header} style={{ textAlign: "center" }}>Creator Leaderboard</div>
			<div className={s.subHeader} style={{ textAlign: "center" }}>See how the best and brightest of our creators are performing!.</div>
			{/* <table className={classes.Table}>
					<tbody>
						<tr className={classes.Tr}>
							<th className={classes.Th}>SL. NO.</th>
						    <th className={classes.Th}>TUTOR</th>
						    <th className={classes.Th}>AVERAGE RATING</th>
						</tr>
					
						
						{rows}
					</tbody>
				</table> */}

			<Table
				style={{ width: "75%", margin: "0 auto" }}
				columns={columns}
				dataSource={rows}
			/>
		</Card>
	);

}

export default Leaderboard;