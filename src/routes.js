import React from 'react';
import Nav from './components/views/Nav/Nav';
import UserList from './components/views/UserList/UserList';
import Conversation from './components/views/Conversation/Conversation';
import Other from './components/views/Other/Other';
import { Switch, Route } from 'react-router-dom';
export default function Routes(props) {
  console.log(props);

  return (
    <React.Fragment>
      {/* <Nav /> */}
      <main>
        <UserList props={{ ...props }} />
        <Route path="/chat/:conversationId" component={Conversation} />
        {/* <Conversation /> */}
        <Other />
      </main>
    </React.Fragment>
  );
}
