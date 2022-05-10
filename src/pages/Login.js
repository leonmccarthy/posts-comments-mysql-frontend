import React, { useState , useContext } from 'react';
import "../styles/Login.css"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from "../helpers/AuthContext"

function Login() {
  const navigate = useNavigate();
  const [ username, setUserName ] = useState("");
  const [ password, setPassword ] = useState("");
  const { authState, setAuthState } = useContext(AuthContext);

  const login = ()=>{
      const data = {username: username, password: password}
      axios.post("https://react-nodejs-mysql-post-app.herokuapp.com/auth/login", data).then((response)=>{
          //checking for errors
          if(response.data.error){
            //   passing errors in alert boxes
              alert(response.data.error);
          }
          else{
              //storing access token in session storage
              localStorage.setItem("accessToken", response.data.token);
              setAuthState({username: response.data.username, id: response.data.id, status: true});
              navigate("/");
          }
        //   console.log(response.data);
      });
  };
  return (
    <div className='loginContainer'>
        <div className='loginform'>
            <label>Username:</label>
            <input type="text" required placeholder=" Example user@gmail.com" onChange={(event)=>{
                setUserName(event.target.value)
            }}/>
            <label>Password:</label>
            <input type="password" min={4} required placeholder=" min length(4)..max length(20)" onChange={(event)=>{
                setPassword(event.target.value)
            }}/>
            <button onClick={login}>Login</button>
        </div>
    </div>
  )
}

export default Login