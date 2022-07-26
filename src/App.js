/* eslint-disable react-hooks/exhaustive-deps */
import './App.css';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import PageNotFound from './components/PageNotFound/PageNotFound';
import WelcomePage from './components/WelcomePage/WelcomePage';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import $ from 'jquery';
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';

export default function App() {

  // function to convert password input to text 
  function convertpassword () {
    let input = $(".password-convert").parent(".password-box").find("input");
    if (input.attr("type") === "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
    $(".password-convert").toggleClass("fa-eye-slash fa-eye");
  }

  // check if there is token on local storage or not
  const [userinfo, setuserinfo] = useState(null)
  useEffect(()=>{
    if (localStorage.getItem("usernotesToken") != null) {
      saveuserdata();
    }
  },[])

  // function to get user info from token
  function saveuserdata () {
    let usertoken = localStorage.getItem("usernotesToken");
    let userjsoninfo = jwtDecode(usertoken);
    setuserinfo(userjsoninfo);
  }

  // function to home page without sginin
  let navigatem = useNavigate();
  function ProdectData ({children}) {
    if (localStorage.getItem("usernotesToken") == null ) {
      return <Navigate to="/"/>
    } else {
      return children;
    }
  }

  // function to Prodect Register page
  function ProdectRegister ({children}) {
    if (localStorage.getItem("usernotesToken") != null) {
      return <Navigate to='/home'/>
    } else {
      return children;
    }
  }
  
  // function to signOut 
  function signOut () {
    localStorage.removeItem("usernotesToken");
    setuserinfo(null)
    navigatem("/")
  }

  return (
    <>
      <Navbar userinfo={userinfo} signOut={signOut}/>
      <Routes>
        <Route path='/' element={ <ProdectRegister> <WelcomePage convertpassword={convertpassword} saveuserdata={saveuserdata} /> </ProdectRegister> } />
        <Route path='/home' element={ <ProdectData> <Home userinfo={userinfo} saveuserdata={saveuserdata} /> </ProdectData> } />
        <Route path='*' element={<PageNotFound /> } />
      </Routes>
    </>
  );
}
