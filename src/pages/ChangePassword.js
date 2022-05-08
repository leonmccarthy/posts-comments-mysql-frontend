import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"
import axios from 'axios';

function ChangePassword() {
    const [ oldPassword, setOldPassword ] = useState("");
    const [ newPassword, setNewPassword ] = useState("");
    const navigate = useNavigate();

    const ChangePassword = ()=>{
        axios.put("http://localhost:3001/auth/changepassword", 
        { oldPassword: oldPassword , newPassword: newPassword},
        {headers: { accessToken: localStorage.getItem("accessToken")}}).then((response)=>{
            if(response.data.error){
                alert(response.data.error)
            }else{
                alert(response.data);
                navigate("/")
            }
        })
    }

  return (
    <div className='changePasswordContainer'>
        <h1>Change My Password</h1>
        <label>Old Password</label>
        <input type="text" placeholder='Old Password' onChange={(event)=>{
            setOldPassword(event.target.value)
        }}/>
        <label>New Password</label>
        <input type="text" placeholder='New Password' onChange={(event)=>{
            setNewPassword(event.target.value)
        }}/>
        <button onClick={()=>{
            ChangePassword()
        }}>Change password</button>
    </div>
  )
}

export default ChangePassword