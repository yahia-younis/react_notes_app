import React, { useEffect, useState } from 'react'
import startphoto from '../../assets/start-page.jpg'
import $ from 'jquery';
import axios  from 'axios';
import Joi from 'joi';
import {useNavigate} from 'react-router-dom'

export default function WelcomePage(props) {
  const [loadingup, setloadingup] = useState(false)
  const [loadingin, setloadingin] = useState(false)
  const [errormessage , seterror] = useState(null)
  const [errormessage2 , seterror2] = useState(null)
  const [errorlist , seterrorlist] = useState([]);
  const [user, setuser] = useState({
    first_name: "",
    last_name:"",
    email: "",
    password: "",
    age: 0
  });

  const [userdata, setuserdata] = useState({
    email: "",
    password: ""
  })
// -----------------------------------------  function to get user sign up information ---------------------------------------------------
  function getuserdata (e) {
    let newuser = {...user}
    newuser[e.target.name] = e.target.value;
    setuser(newuser);
    if ($("#first-name").val().length > 0 
    && $("#last-name").val().length > 0
    && $("#age").val().length > 0
    && $("#emailup").val().length > 0
    && $("#passwordup").val().length > 0
    ) {
      $("#btn-signup").attr("disabled", false)
    } else {
      $("#btn-signup").attr("disabled", true)
    }
  }
// -----------------------------------------  function to get user sign in information ---------------------------------------------------

  function getuserdatainfo (e) {
    let newuserdata = {...userdata}
    newuserdata[e.target.name] = e.target.value;
    setuserdata(newuserdata);
    if ($("#emailin").val().length > 0 && $("#passwordin").val().length > 0) {
      $("#btn-signin").attr("disabled", false)
    } else {
      $("#btn-signin").attr("disabled", true)
    }
  }
// -----------------------------------------  function to get user sgin in  ---------------------------------------------------

  let Navigate = useNavigate();
  async function submitsigninform(e) {
    e.preventDefault();
    setloadingin(true)
    let {data} = await axios.post("https://route-egypt-api.herokuapp.com/signin", userdata);
    if (data.message === "success") {
      localStorage.setItem("usernotesToken", data.token);
      Navigate("/home");
      setloadingin(false)
      props.saveuserdata();
    } else {
      seterror2(data.message);
      setloadingin(false)
    }
  }
// -----------------------------------------  function to submit form to database ---------------------------------------------------

  async function submitsignupform(e) {
    e.preventDefault();
    let validtereuslt = validdata();
    if (validtereuslt.error == null) {
      setloadingup(true)
      let {data} = await axios.post("https://route-egypt-api.herokuapp.com/signup", user);
      if (data.message === "success") {
        $("#signup-form").fadeOut(500, function () {
          $("#signin-form").fadeIn(500);
        });
        setloadingup(false)
      } else {
        if (data.message === "citizen validation failed: email: email already registered")
        seterror(data.errors.email.message);
        setloadingup(false)
      }
    } else {
      seterrorlist(validtereuslt.error.details);
    }
  } 
// -----------------------------------------  function valid data of user before submit it  ---------------------------------------------------

  function validdata() {
    let vailduser = Joi.object({
      first_name: Joi.string().min(3).max(10).required(),
      last_name: Joi.string().min(3).max(10).required(),
      email: Joi.string().email({tlds: ["net", "com", "org", "eg", "yahoo"]}).required(),
      // This regex will enforce these rules:
        // At least one upper case English letter, (?=.*?[A-Z])
        // At least one lower case English letter, (?=.*?[a-z])
        // At least one digit, (?=.*?[0-9])
        // At least one special character, (?=.*?[#?!@$%^&*-])
        // Minimum eight in length .{8,} (with the anchors)
      password: Joi.string().pattern( new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$") ),
      age: Joi.number().min(16).max(70).required()
    });
    return vailduser.validate(user, {abortEarly:false}); 
  }
// -----------------------------------------  flip between signin form and signup  ---------------------------------------------------
  
  useEffect(() => {
    $("#signin-btn").on("click", function () {
      $("#signup-form").fadeOut(500, function () {
        $("#signin-form").fadeIn(500)
      });
    });
    $("#signup-btn").on("click", function () {
      $("#signin-form").fadeOut(500, function () {
        $("#signup-form").fadeIn(500)
      });
    });
  }, [])
// -----------------------------------------  render xml code  ---------------------------------------------------

  return (
    <>
    <div className="parant d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row">
          <div className="col-md-6 d-none d-md-block"> <img className='w-100' src={startphoto} alt="startphoto" /> </div>
          <div className="col-md-6 d-flex justify-content-center align-items-center flex-column header">
            <h3 className='fw-bold text-center'>welcome in our notes app</h3>
            <p className='text-center text-muted fs-s'>our notes app dependencies on real database, so have fun and it's completely free. </p>
            <div className="sgin-box mt-4">
              {/* ------------------------------------------- sgin in form ------------------------------------------------------------ */}
              
              <div id="signin-form">
                <form onSubmit={submitsigninform}>
                  {errormessage2 ? <div className="alert alert-danger mt-3 p-2"> Email Doesn't Exist Or Password Incorrect </div> : ""}
                  <input id='emailin' onChange={getuserdatainfo} type="text" placeholder='Email' name='email' className='form-control mt-3'/>
                  <div className="password-box position-relative my-3">
                    <input id='passwordin' onChange={getuserdatainfo} type="password" name='password' placeholder='Password' className='form-control'/>
                    <i onClick={props.convertpassword} className="fa-solid fa-eye-slash password-convert"></i>
                  </div>
                  <button id='btn-signin' className='btn-sign' disabled > {(loadingin) ? <span> <i className='fa-solid fa-spinner fa-spin me-1'></i> Loading </span>  : " Sign In"}</button>
                  <p className='fs-sm text-center mt-3 mb-0'>dont have an account ? <span id="signup-btn">sign up now</span></p>
                </form>
              </div>
              {/* ------------------------------------------- sgin up form ------------------------------------------------------------ */}

              <div id="signup-form" onSubmit={submitsignupform} className='nd-none'>
                {(errormessage ? <div className="alert alert-danger mt-3 p-2">{errormessage}</div> : " ")}
                {errorlist.map((e, i)=> {
                  if (e.path[0] !== 'password') {
                    return <p key={i} className='my-1 text-danger'> * {e.message} </p>
                  } else {
                    return <p key={i} className='my-1 text-danger'> * password must be Minimum eight character <br /> at least one upper case, <br /> at least one number and <br />  at least one special character </p>
                  }
                  })}
                <form>
                  <div className="row">
                    <div className="col-md-6"><input id='first-name' onChange={getuserdata} type="text" placeholder='First Name' name='first_name' className='form-control mt-4'/></div>
                    <div className="col-md-6"><input id='last-name' onChange={getuserdata} type="text" placeholder='Last Name' name='last_name' className='form-control mt-4'/></div>
                  </div>
                  <input id='age' onChange={getuserdata} type="number" placeholder='Age' name='age' className='form-control mt-3' />
                  <input id='emailup' onChange={getuserdata} type="text" placeholder='Email' name='email' className='form-control mt-3' />
                  <div className="password-box position-relative my-3">
                    <input id='passwordup' onChange={getuserdata}  type="password" name='password' placeholder='Password' className='form-control'/>
                    <i onClick={props.convertpassword} className="fa-solid fa-eye-slash password-convert"></i>
                  </div>
                  <button id='btn-signup' className='btn-sign' disabled> {(loadingup) ? <span> <i className='fa-solid fa-spinner fa-spin me-1'></i> Loading </span> :  "Sign Up"}  </button>
                  <p className='fs-sm text-center mt-3 mb-0'>already have account ? <span id="signin-btn">sign in</span></p>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
