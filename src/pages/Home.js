import React from 'react';
import '../styles/Home.css'
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Home() {
    //navigating through the pages
    const navigate = useNavigate();

    const [ listOfPosts, setlistOfPost ] = useState([]);
    const { authState } = useContext(AuthContext)

    //fetching data from server
      useEffect(()=>{
        if(!localStorage.getItem("accessToken")){
          navigate("/login")
        } else{
          axios.get("http://localhost:3001/posts").then((response)=>{
          // console.log(response.data);
          //putting response data to the setlistOfPost
          setlistOfPost(response.data);
        });
        }
      }, []);

      //like post function
      const likePost = (postId)=> {
        axios.post("http://localhost:3001/like", {PostId: postId}, { headers: {
          accessToken: localStorage.getItem("accessToken")
        }}).then((response)=>{
          alert(response.data.message);
          //making like appear automatically after clicking a button
          setlistOfPost(listOfPosts.map((post)=>{
            //changing only the like of post that is cghanged
            if(post.id === postId){
              //checking for liked boolean value
                
              if(response.data.liked){
                return {
                  //destructure post because we want to change likings
                  //destructure Likings because we want to add another element
                  ...post, Likings: [...post.Likings, 0]
                };
              }else{
                //creating a constant that will store the likings array
                const likingsArray = post.Likings;
                const deletedArray = likingsArray.pop();
                //deleting the last value array 
                // likingsArray.pop();
                return {
                  //destructure post because we want to change likings
                  //destructure Likings because we want to remove another element
                  ...post, Likings: [...post.Likings, deletedArray]
                };
              }
            }else {
              return post;
            }
          }))
        })
      }
  return (
    <div>
        {listOfPosts.map((value, key)=>{
        return(
          //retrieving data from database
        <div className='homepost'>
          <div className='title' key={key}> {value.title} </div>
          <div className='body' onClick={()=>{navigate(`/post/${value.id}`)}} key={key}>
               {value.postText} </div>
          <div className='footer' key={key}><Link to={`/profile/${value.UserId}`}>{"@"}{value.username}</Link>
            <button onClick={()=>{likePost(value.id)}}>Like</button>
            <label>Likes: {value.Likings.length}</label>
          </div>
        </div>
        )
      })}
    </div>
  )
}

export default Home;