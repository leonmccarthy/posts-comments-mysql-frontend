import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from "../helpers/AuthContext"

function Profile() {
    //grabbing id from the route
    let { id } = useParams();
    const navigate = useNavigate();
    const { authState } = useContext( AuthContext );

    const [ username, setUsername ] = useState("");
    const [ listOfPosts, setListOfPosts ] = useState([]);

    useEffect(()=>{
        //getting basic information
        axios.get(`https://react-nodejs-mysql-post-app.herokuapp.com/auth/basicinfo/${id}`).then((response)=>{
            setUsername(response.data.username)
        });
        //getting post by user id
        axios.get(`https://react-nodejs-mysql-post-app.herokuapp.com/posts/byUserId/${id}`).then((response)=>{
            setListOfPosts(response.data);
        });
    }, []);

    //like post function
    const likePost = (postId)=> {
        axios.post("https://react-nodejs-mysql-post-app.herokuapp.com/like", {PostId: postId}, { headers: {
          accessToken: localStorage.getItem("accessToken")
        }}).then((response)=>{
          alert(response.data.message);
          //making like appear automatically after clicking a button
          setListOfPosts(listOfPosts.map((post)=>{
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
    <div className='profile page container'>
        <div className='basicInfo'>
            <h1>Username: {username}</h1>
            {authState.username === username &&(<button onClick={()=>{
              navigate("/changepassword")
            }}>Change my password</button>)}
        </div>
        <div className='listOfPosts'>
        {listOfPosts.map((value, key)=>{
        return(
          //retrieving data from database
        <div className='homepost'>
          <div className='title' key={key}> {value.title} </div>
          <div className='body' onClick={()=>{navigate(`/post/${value.id}`)}} key={key}>
               {value.postText} </div>
          <div className='footer' key={key}> {"@"}{value.username}
            <button onClick={()=>{likePost(value.id)}}>Like</button>
            <label>Likes: {value.Likings.length}</label>
          </div>
        </div>
        )
      })}
        </div>     
    </div>
  )
}

export default Profile;