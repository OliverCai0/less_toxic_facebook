import {useParams} from "react-router-dom";
import { useState, useEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import ReactDOM from 'react-dom';
import { Bar } from "react-chartjs-2";
import { Grid } from 'gridjs-react';
import { html } from 'gridjs';
import Chat from '../components/Chat'

async function addClassToDB(params){
 console.log(params)
 return fetch('/add_classes', {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify(params)
 })
   .then(data => data.json())
}

export const Chart = (gradeData) => {
	const chartData = {
        labels: ['A', 'B', 'C', 'D'],
        datasets: [{
			// data: gradeData,
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(255, 159, 64, 0.8)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    }
	return (
		<div style={{marginLeft: "50%", backgroundColor: 'rgba(61, 12, 2, .8)'}}>
			<h3 style={{textAlign: "center", color: "whitesmoke"}}>Grade Distribution</h3>
			<Bar data={chartData} redraw={true} options={{
				plugins: {
					legend: {
						display: false
					}
				},
				scales: {
					y: {  // not 'yAxes: [{' anymore (not an array anymore)
					  ticks: {
						color: "white",
						font: {
						  size: 15
						},
					  }
					},
					x: {  // not 'xAxes: [{' anymore (not an array anymore)
					  ticks: {
						color: "white",
						font: {
						  size: 30
						},
					  }
					}	
				}			
			}}/>
		</div>
	);
}

export const PeopleTable = props => {
	return(		
		<div style={{ width: "50%", float: "left"}}>
			<Grid 
				data={
					props.people.map(x =>
						[
							html("<a href='/profile/" + x.id + "'>" + x.name + "</Link>"),
							x.graduation_year,
							x.major
						]			
					)
				}
				columns={['Name', 'Graduation Year', 'Major']}
				search={true}
				sort={true}
				pagination={{
					limit: 3,
				}}
			/>
		</div>
	);
}

function showAddClass() {
	document.getElementById('grade').style.display = "block";
	document.getElementById('submitClass').style.display = "block";
 }

const ClassPage = () => {
	let {id} = useParams();
	let class_info;
	let users;
	const [info, setClassInfo] = useState(null);
	//Add in class data for info
	const handleSubmit = async e => {
         e.preventDefault();
         info.id = JSON.parse(sessionStorage.token)
         const result = await addClassToDB({
            info
         });
    };

	useEffect(() => {
		fetch('/class_display', {
			   method: 'POST',
			   headers: {
			     'Content-Type': 'application/json'
			   },body: JSON.stringify({id})
 			}).then((res) => res.json())
      		  .then((data) => setClassInfo(data));
	},[]);

	if(info == null || info.class_info == null){
		//console.log(class_info)
		return <h1>Still Loading</h1>;
	}
	if(sessionStorage.token == null)
    {
        console.log("not logged in");
        console.log("Class Info: " + JSON.stringify(info.class_info) );
		class_info = info.class_info;
		users = info.users;
		console.log(users);
		return (
			<div style={{padding: '2%' }}>
				<div style={{backgroundColor: 'rgba(61, 12, 2, .8)'}}>
				<h1 style={{color:"whitesmoke"}}> {info.class_info.title} </h1>
				<h3 style={{color:"whitesmoke"}}> {info.class_info.fullNameInstructors} </h3>
				<div style={{color:"whitesmoke"}}>{info.class_info.descrip}</div>
				</div>
				<div>
					<h2 style={{color:"whitesmoke"}}>People</h2>
					<PeopleTable people={users} style={{height: '50%'}}/>
					<Chart gradeData={class_info.grades}/>
				</div>
			</div>
		)
    }
	else{
		console.log("Class Info: " + JSON.stringify(info.class_info) );
		class_info = info.class_info;
		users = info.users;
		return (
			<div style={{padding: '2%' }}>
				<div style={{backgroundColor: 'rgba(61, 12, 2, .8)'}}>
				<div style={{}}>
					<h1 style={{color:"whitesmoke", width: '50%'}}> {info.class_info.title} </h1>
					<input class="btn btn-info btn-lg btn-block" type="button" value="Add Class" onClick={showAddClass}/>
				</div>
				<h3 style={{color:"whitesmoke"}}> {info.class_info.fullNameInstructors} </h3>
				<div style={{color:"whitesmoke"}}>{info.class_info.descrip}</div>
				</div>
				<form onSubmit={handleSubmit} method="post">
					<input type="text" id="grade" style={{display:"none"}} placeholder="Grade"/>
                    <input type="submit" id="submitClass" style={{display:"none"}} value="Add"/>
                </form>
				<div>
					<h2 style={{color:"whitesmoke"}}>People</h2>
					<PeopleTable people={users}/>
					<Chart gradeData={class_info.grades}/>
				</div>
			</div>
						
		)
	}
};
export default ClassPage;
