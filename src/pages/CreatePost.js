import React, { useEffect, useContext}from 'react';
import "../styles/CreatePost.css";
import { useNavigate } from 'react-router-dom';
//formik is a library for creating forms easily
import {Formik, Form, Field, ErrorMessage} from "formik";
//yup is a library that hanles validation
import * as Yup from 'yup';
import axios from 'axios';
import { AuthContext } from "../helpers/AuthContext"

function CreatePost() {
//putting the context into a 
  const { authState } = useContext( AuthContext );

  useEffect(()=>{
    if(!localStorage.getItem("accessToken")){
      navigate("/login")
    }
  }, [])

  //creating initial values of the form
  const initialValues = {
    title: "",
    postText: "",
  }

  //creating validation schema
  const validationSchema = Yup.object().shape({
    title: Yup.string().required(),
    postText: Yup.string().required("You must enter a post text"),
  });

  let navigate = useNavigate();

  //submit function
  const onSubmit = (data)=>{
    //sending data to the server01(backend)
    axios.post("http://localhost:3001/posts", data, { headers:{
      accessToken: localStorage.getItem("accessToken")
    }}).then((response)=>{
      console.log("Data sent successfully");
      navigate('/');
    })
  };

  return (
    <div className='createPostContainer'>
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            <Form className='createpostform'>
                {/* name should be same as the one in database column */}
                <label>Title:</label>
                {/*component could be a div or span etc*/}
                <ErrorMessage name='title' component="span" className='error'/>
                <Field id="inputCreatePost" name="title" placeholder=" Example Loki Sn 2..."/>
                <label>Post text:</label>
                <ErrorMessage name='postText' component="span" className='error'/>
                <Field id="inputCreatePost" name="postText" placeholder=" Example ugwugyfuwuy..."/>
                <button type='submit'>Create a Post</button>
            </Form>
        </Formik>
    </div>
  )
}

export default CreatePost;