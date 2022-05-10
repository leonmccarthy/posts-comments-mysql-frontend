import './styles/App.css';

//importing pages
import Home from './pages/Home';
import CreatePost from "./pages/CreatePost";
import Post from './pages/Post';
import Login from './pages/Login';
import Register from './pages/Register';
import PageNotFound from './pages/PageNotFound';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';

import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import { AuthContext } from './helpers/AuthContext';
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  // 
  //login state
  const [ authState, setAuthState ] = useState({username: "", id: 0, status: false});
  //setting authstate to true when access token exist
  useEffect(()=>{
    //you have to pass the headers
    axios.get("https://react-nodejs-mysql-post-app.herokuapp.com/auth/auth", {headers:{
      accessToken: localStorage.getItem("accessToken")
    }}).then((response)=>{
      if(response.data.error){
        setAuthState({...authState, status: false});
      }else{
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true
        });
      }
    });
  },[]);
  
  //logout function
  const logout = ()=> {
      localStorage.removeItem("accessToken");
      setAuthState({username:"",id: 0, status: false});
  }
  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState}}>
      <Router>
        <div className='navbar'>
          {/* do not show login and rgister when user is logged in and
           show logout button on logged in user*/}
          {!authState.status ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            ):(
              <div className='loggedin'>
                <Link to="/">Homepage</Link>
                <Link to="/createpost">Create a post</Link>
                <div className='username'><p>Welcome, {authState.username}</p></div>
                  <button className='logout' onClick={logout}>Logout</button>
              </div>
            )}
        </div>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/createpost' element={<CreatePost/>}></Route>
          {/* accepts the post id parameter */}
          <Route path='/post/:id' element={<Post/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/register' element={<Register/>}></Route>
          {/* accepts the user id parameter */}
          <Route path="/profile/:id" element={<Profile></Profile>}></Route>
          <Route path='/changepassword' element={<ChangePassword></ChangePassword>}></Route>
          <Route path='*' element={<PageNotFound></PageNotFound>}></Route>
        </Routes>
      </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
