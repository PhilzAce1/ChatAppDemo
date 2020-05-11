import React from 'react';
// import Routes from './routes';
import { Route, Switch } from 'react-router-dom';
// import { withAuthenticator } from 'aws-amplify-react';
import UserList from './components/views/UserList/UserList';
import Conversation from './components/views/Conversation/Conversation';
import Other from './components/views/Other/Other';
import Landing from './components/views/Landing/Landing';
import Signin from './components/views/Signin/Signin';
function App() {
  return (
    <div>
      <Switch>
        <Route path="/" exact component={Landing} />
        <Route path="/signin" component={Signin} />
        <main>
          <Route path="/chat/:user" component={UserList} />
          <Route path="/chat/:user/:conversationId" component={Conversation} />
          <Other />
        </main>
        {/* <Route path="*" component={() => <p>Not Found</p>} /> */}
      </Switch>
    </div>
  );
}

export default App;
//  withAuthenticator(App);
