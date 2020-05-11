import React from 'react';
import './assist/main.css';
export default function Nav(props) {
  return (
    <nav>
      <div classNameName="logo">
        <img src="/Logo.png" alt="" srcset="" />
      </div>
      <div classNameName="nav">
        <span>Listing</span>
        <span>Message</span>
        <span>Notification</span>
      </div>
      <div classNameName="username">Peter</div>
    </nav>
  );
}
