import React from 'react';
import "../styles/Register.css";
import { useNavigate } from 'react-router-dom';
//formik is a library for creating forms easily
import {Formik, Form, Field, ErrorMessage} from "formik";
//yup is a library that handles validation
import * as Yup from 'yup';
import axios from 'axios';

function Register() {
       //creating initial values of the form
       const initialValues = {
        password: "",
        username: ""
      }
    
      //creating validation schema
      const validationSchema = Yup.object().shape({
        password: Yup.string().min(4).max(20).required(),
        username: Yup.string().min(3).max(15).required(),
      });
    
      let navigate = useNavigate();
    
      //submit function
      const onSubmit = (data)=>{
        //sending data to the server01(backend)
        axios.post("http://localhost:3001/auth/", data).then((response)=>{
          console.log("User successfully registered!");
          navigate('/login');
        })
      };
      return (
        <div className='registerContainer'>
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form className='registerform'>
                    {/* name should be same as the one in database column */}
                    <label>Username:</label>
                    {/*component could be a div or span etc*/}
                    <ErrorMessage name='username' component="span" className='error'/>
                    <Field id="inputregister" name="username" type='email' placeholder=" Example user@gmail.com" />
                    <label>Password:</label>
                    <ErrorMessage name='password' component="span" className='error'/>
                    <Field id="inputregister" name="password" type='password' placeholder=" min length(4)..max length(20)"/>
                    
                    <button type='submit'>Register</button>
                </Form>
            </Formik>
        </div>
      )
}

export default Register