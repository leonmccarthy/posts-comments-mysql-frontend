import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/Posts.css";
import { AuthContext } from "../helpers/AuthContext"

function Post() {
    //taking id from the url
    let { id } = useParams();

    const navigate = useNavigate();
    const [postObject, setPostObject] = useState({});
    const [comments, setComments] = useState([]);
    const [ newComment, setNewComment ] = useState("");
    const { authState } = useContext(AuthContext)

    useEffect(()=>{
      //getting post from backend using id
        axios.get(`http://localhost:3001/posts/byId/${id}`).then((response)=>{
            setPostObject(response.data)
        });
        //getting comments from backend using id
        axios.get(`http://localhost:3001/comments/${id}`).then((response)=>{
            setComments(response.data)
        });
    }, []);

    const addComment = ()=>{
      //sending comments to the database
      axios.post("http://localhost:3001/comments/", {commentBody: newComment, PostId: id},{
        //passing the accesstoken to backend
        headers: {
          accessToken: localStorage.getItem("accessToken")
        }
      }
      ).then((response)=>{
        if(response.data.error){
          alert(response.data.error)
        } else{
          const commentToAdd = {commentBody: newComment, username: response.data.username}
          //destructuring the array and adding another comment to the list  
          setComments([...comments, commentToAdd])
          setNewComment("")
        }
      });
    };

    const deleteComment =(id)=> {
      axios.delete(`http://localhost:3001/comments/${id}`, {headers:{
        accessToken: localStorage.getItem("accessToken")
      }}).then(()=>{
        //remove the item from the list
        setComments(comments.filter((value)=>{
            return value.id!=id;
        }))
      })
    }

    const deletePost = (id)=>{
      axios.delete(`http://localhost:3001/posts/${id}`, {headers: {
        accessToken: localStorage.getItem("accessToken")
      }}).then((response)=>{
        alert(response.data)
        navigate("/")
      })
    };

    const editPost = (option) => {
      if(option === "title"){
        let newTitle = prompt("Enter new title!");
        axios.put("http://localhost:3001/posts/title",{ newTitle: newTitle , id: id}, {headers: {
          accessToken: localStorage.getItem("accessToken")
        }}).then(
          alert("Title successfully changed")
        );
        setPostObject({...postObject, title: newTitle})
      }else{
        let newPostText = prompt("Enter new post text!");
        axios.put("http://localhost:3001/posts/postText", { newPostText: newPostText, id: id }, {headers: {
          accessToken: localStorage.getItem("accessToken")
        }}).then(
          alert("Post text successfully changed")
        );
        setPostObject({...postObject, postText: newPostText})
      }
    }
  return (
    <div className='postPage'>
      <div className='leftSide'>
        <div className='post'>
            <div className='title' onClick={()=>{
              if(authState.username===postObject.username){editPost("title")}
              }}>{postObject.title}</div>
            <div className='postText' onClick={()=>{
              if(authState.username===postObject.username){editPost("postText")}
              }}>{postObject.postText}</div>
            <div className='footer'>{"@"}{postObject.username}
            {authState.username===postObject.username &&
              (<button onClick={()=>{deletePost(postObject.id)}}>Delete Post
               </button>)}
            </div>
        </div>
      </div>
      <div className='rightSide'>
        <div className='addComment'>
          <input className='insertComment' type="text" placeholder='Comment...' value={newComment} required onChange={(event)=>{setNewComment(event.target.value)}}/>
          <button className='insertComment btn' onClick={addComment}>Add Comment</button>
        </div>
        <div className='listOfComments'>
          {
            comments.map((comment, key)=>{
              return( 
              <div className='comment' key={key}><p>{comment.commentBody}</p>
              {authState.username===comment.username &&(
                <div className='deleteBox'>
                    <button className='delete' onClick={()=>{deleteComment(comment.id)}}>delete</button>
                </div>
                )}
                  <div className='commentfooter'>Comment by: {`@${comment.username}`}</div>
                  
              </div>
              )
            })
          }
        </div>
      </div>
    </div> 
  )
}

export default Post;