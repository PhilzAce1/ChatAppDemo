import React, { useState, Fragment, useReducer } from 'react';
import {
  createConvo as CreateConvo,
  createConvoLink,
  listUsers,
  getUser,
} from '../others/GraphQl';
import { API, graphqlOperation } from 'aws-amplify';
// import {

// } from '../../graphql/mutations';

export const initialState = {
  username: '',
  convoId: '',
  convoLinkId: '',
};
export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USERNAME':
      return {
        ...state,
        username: action.username,
      };
    case 'SET_CONVOID':
      console.log(action.convoId);

      return {
        ...state,
        convoId: action.convoId,
      };
    case 'SET_CONVOLINKID':
      return {
        ...state,
        convoLinkId: action.convoLinkId,
      };

    // case 'ADD_MESSAGE':
    //   return {
    //     ...state,
    //     messages: [...state.messages, action.messages],
    //   };
    default:
      return state;
  }
};
export default function SearchBar(props) {
  const userId = props.props.match.params.user;
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(false);
  async function createConversation(e) {
    const data = e.currentTarget.id.split(',');
    // return console.log(data[0]);
    try {
      const otherUser = data[0];
      // const username = props.props.match.params.userId;
      const {
        data: {
          getUser: {
            username,
            conversations: { items: conversations },
          },
        },
      } = await API.graphql(graphqlOperation(getUser, { id: userId }));
      // return console.log(w);
      const members = [`${username}`, otherUser].sort();
      const conversationName = members.join(' and ');
      const convo = { name: conversationName, members };
      const conversation = await API.graphql(
        graphqlOperation(CreateConvo, { input: convo })
      );
      const {
        data: {
          createConvo: { id: convoLinkConversationId },
        },
      } = conversation;
      dispatch({ type: 'SET_CONVOID', convoId: convoLinkConversationId });
      dispatch({ type: 'SET_USERNAME', username: otherUser });

      const relation1 = { convoLinkUserId: userId, convoLinkConversationId };
      const relation2 = {
        convoLinkUserId: data[1],
        convoLinkConversationId,
      };
      await API.graphql(
        graphqlOperation(createConvoLink, { input: relation1 })
      );
      await API.graphql(
        graphqlOperation(createConvoLink, { input: relation2 })
      );
      return props.props.history.push(
        `/chat/${userId}/${convoLinkConversationId}`
      );
    } catch (err) {
      // if (err.errors[0].message) return console.log(err.errors[0].message);
      console.log(err);
    }
  }

  async function getUsers(e) {
    if (e.target.value === '') {
      setUsers([]);
      return setModal(false);
    }
    try {
      const userData = await API.graphql(
        graphqlOperation(listUsers, {
          limit: 1000,
          filter: { username: { beginsWith: e.target.value } },
        })
      );
      const {
        data: {
          listUsers: { items },
        },
      } = userData;
      if (items.length > 0) {
        setModal(true);
        setUsers(items);
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Fragment>
      <input
        type="text"
        name=""
        id=""
        placeholder="Search"
        onChange={getUsers}
      />
      <div
        style={{
          top: '120px',
          maxHeight: '400px',
          width: '80%',
          background: 'white',
          border: '1px solid black',
          position: 'absolute',
          visibility: `${modal ? 'visible' : 'hidden'}`,
          overflowY: 'auto',
        }}
      >
        {users.map((x, i) => {
          if (!users) return <div>NO user with that name</div>;
          console.log(x.id);
          return (
            <div
              style={{
                height: '30px',
                width: '100%',
                textAlign: 'center',
                borderBottom: '1px solid gray',
              }}
              key={i}
              id={[x.username, x.id]}
              onClick={createConversation}
            >
              {x.username}
            </div>
          );
        })}
      </div>
    </Fragment>
  );
}
