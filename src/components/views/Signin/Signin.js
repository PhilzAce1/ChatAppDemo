import React, { useState } from 'react';
import './signin.css';
import img from '../Landing/Illustration.png';
import { API, graphqlOperation } from 'aws-amplify';
import { listUsers, createUser as CreateUser } from '../../others/GraphQl';
// import {  } from '../../../graphql/queries';
export default function Signin(props) {
  const [val, setVal] = useState('');
  const onChange = (e) => {
    setVal(e.target.value);
  };
  const createUser = async (e) => {
    e.preventDefault();
    if (val === '') return;
    try {
      const newUser = {
        username: val.toLowerCase(),
      };

      const {
        data: {
          listUsers: { items },
        },
      } = await API.graphql(
        graphqlOperation(listUsers, {
          filter: { username: { eq: newUser.username } },
        })
      );
      // if (items[0].username) {
      //   if (newUser.username === items[0].username)
      //     return props.history.push(`/chat/${items[0].id}`);
      // }
      // const userExist = await Api.graphql(graphqlOperation())
      const {
        data: { createUser: user },
      } = await API.graphql(graphqlOperation(CreateUser, { input: newUser }));
      return props.history.push(`/chat/${user.id}`);
    } catch (errors) {
      console.log(errors);
    }
  };
  return (
    <div className="container">
      <div className="form">
        <div>
          <input
            id="username"
            type="text"
            onChange={onChange}
            value={val}
            placeholder="Input Username"
          />
          <button onClick={createUser} type="submit">
            Create User
          </button>
        </div>
      </div>
      <div className="illustration">
        <img src={img} alt="ill" />
      </div>
    </div>
  );
}
