import React from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../../assets/logo.png'
import useravatar from '../../assets/profile.png';

export default function Navbar({userinfo, signOut}) {

  return (
    <>
      <nav className="navbar navbar-dark navbar-expand-lg bg-transparent pt-3">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            <img className='w-100' src={logo} alt="logo" />
          </NavLink>

            <ul className="navbar-nav ms-auto mb-2 mb-0  d-flex justify-content-center align-items-center">
              {/* check if user sgin in first or not */}
              {(userinfo ? 
              <>
                <li className='nav-item p-2'> 
                <div className='d-sm-none d-lg-flex none'> welcome {userinfo.first_name}</div> 
                </li>
                <li className="nav-item dropdown">
                  <div className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <img className='useravater' src={useravatar} alt="useravater" />
                  </div>
                  <ul className="dropdown-menu text-center pb-0 overflow-hidden">
                    <p className="fw-bold mb-0"> {userinfo.first_name + " " + userinfo.last_name} </p>
                    <li><button onClick={signOut} className="dropdown-item Sign-out mt-2">Sign out</button></li>
                  </ul>
                </li>
              </> : " " )}

            </ul>

        </div>
      </nav>
    </>
  )
}
