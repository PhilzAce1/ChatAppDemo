import React from 'react';
import './Landing.css';
import img from './Illustration.png';
import { Link } from 'react-router-dom';
export default function Landing(props) {
  return (
    <div className="container">
      <div className="welcome-text">
        <div className="text">
          I just decided to make this a little bit more Presentable ...since i
          know that i need a gig and i need money ....lol
        </div>
        <div className="buttons">
          <Link to="/signin">
            <button>Create a User</button>
          </Link>
        </div>
      </div>
      <div className="illustration">
        <img src={img} alt="Illustration" />
      </div>
    </div>
  );
}
