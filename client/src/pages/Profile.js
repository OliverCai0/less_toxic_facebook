import { useState, useEffect  } from 'react';
import {useParams} from "react-router-dom";
import { Grid } from 'gridjs-react';
import { Outlet, Link } from "react-router-dom";


const Profile = () => {
	let {id} = useParams();
	let class_info;
	let users;
	const [info, setProfileInfo] = useState(null);

	useEffect(() => {
		fetch('/profile', {
			   method: 'POST',
			   headers: {
			     'Content-Type': 'application/json'
			   },body: JSON.stringify({id})
 			}).then((res) => res.json())
      		  .then((data) => setProfileInfo(data));
	},[]);

	if(info == null){
		//console.log(class_info)
		return <h1>Still Loading</h1>;
	}
	else{
      console.log(info)
      const classes = [];
      for(var i = 0; i < info.classes.length; i++){
          classes[i] = info.classes[i];
      }
      console.log(classes)
      return (
            <div style={{ padding: '2%'}}>
              <div style={{backgroundColor: 'rgba(61, 12, 2, .8)', borderRadius: '25px'}}>
                  <h1 style={{color:"whitesmoke"}}>{info.name}</h1>
                  <h2 style={{color:"whitesmoke"}}>Graduation Year: {info.graduation_year}</h2>
                  <h2 style={{color:"whitesmoke"}}>Major: {info.major}</h2>
                  <h2 style={{color:"whitesmoke"}}>Email: {info.email}</h2>

              </div>
              <div style={{display: "flex", width: "100%", flexDirection: "column", alignItems: "center",
                                       justifyContent: "space-around"}}>
                          {classes.map(x =>
                              <div key={x.sectionID} style={{margin: "1%", minWidth: "75%"}}
                                       class="container-md card">
                                  <Link to={"/class/" + x.sectionID}>
                                  {"CMSC " + x.num + " "+ x.title}</Link>
                                  <p>
                                  {"Instructors: " + x.instructors}
                                  </p>
                                  {(x.crossListings != 'None') &&
                                  <p> {"Cross Listed as: " + x.crossListings}
                                  </p>
                                 }
                              </div>
                              )}
              </div>
           </div>

      );	
    }
}

export default Profile;
