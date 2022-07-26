import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/Alert';

async function loginUser(credentials) {
console.log(credentials.token);
 return fetch('/login', {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify(credentials)
 })
   .then(data => data.json())
}

const Login = ({token, setToken}) => {
	var alert;
	const [badLogin, setBadLogin] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const history = useNavigate()

	const container = {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		height: "100%",
	}

	const right_form = {
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-around",
		height: "100%",
		width: "50%",
		alignItems: "center",
		background: "antiquewhite"
	}

	const handleSubmit = async e => {
	    e.preventDefault();
	    const token = await loginUser({
	      email,
	      password
	    });
	    if (token.token == null){
			setBadLogin(true)
	    }
	    else{
			setBadLogin(false)
	    	setToken(token);
	    	history("/");
	    }
	  }

	const handleEmailChange = (event) => {
		console.log(event.target.value);
		setEmail(event.target.value)
	}

	const handlePasswordChange = (event) => {
		console.log(event.target.value);
		setPassword(event.target.value)
	}

	if(token){
		alert = 1;
	}
	else{
		alert = null;
	}

	// const handleSubmit = (event) => {
	// 	console.log("Logging in with " + email + " and password" + password);
	// 	event.preventDefault();
	// }
	return(
		<div style={{height: "100%"}}>
		{badLogin && <Alert variant='danger'
style={{}}>Bad Login, please check your password or email</Alert>}
		<div style={container}>

		<div style={{width: "50%"}}>
		</div>
		<div class="col-sm-6 text-black" style={{display: "flex", flexDirection: "column",
			 justifyContent: "center", height: "93vh",
			 background: "white"} }>
																								
        <div class="px-5 ms-xl-4">
          <i class="fas fa-crow fa-2x me-3 pt-5 mt-xl-4" style={{color: "#709085"} }></i>
        </div>

        <div class="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5">

          <form style={{width: "23rem"} }>

            <h3 class="fw-normal mb-3 pb-3" style={{letterSpacing: "1px"}}>Log in</h3>

            <div class="form-outline mb-4">
              <input type="email" id="form2Example18" class="form-control form-control-lg" 
              				onChange={handleEmailChange}/>
              <label class="form-label" for="form2Example18">Email address</label>
            </div>

            <div class="form-outline mb-4">
              <input type="password" id="form2Example28" class="form-control form-control-lg" 
              				onChange={handlePasswordChange}/>
              <label class="form-label" for="form2Example28">Password</label>
            </div>

            <div class="pt-1 mb-4">
              <button class="btn btn-info btn-lg btn-block" type="button"
              				onClick={handleSubmit} style={{width: "100%"}}>Login</button>
            </div>

            <p class="small mb-5 pb-lg-2"><a class="text-muted" href="#!">Forgot password?</a></p>
            <p>Don't have an account? <a href="register" class="link-info">Register here</a></p>

          </form>

        </div>
        </div>
      </div>
	  </div>
		)
}

// Login.propTypes = {
//   setToken: PropTypes.func.isRequired
// }

export default Login;
