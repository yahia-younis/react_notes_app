import React from 'react';
import photo404 from '../../assets/404.jpg';
import {Link} from 'react-router-dom'

export default function PageNotFound() {
  return (
    <div>
      <div className="container d-flex justify-content-center align-items-center parant">
        <div className="photobox text-center">
          <img src={photo404} alt="404photo" /> 
          <p className='my-5 text-muted fw-bold'>sorry we can't find this page</p>
          <Link className='backto' to='/'> Back to home</Link>
        </div>
      </div>
    </div>
  )
}
