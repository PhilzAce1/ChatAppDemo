import React, { useState, useEffect } from 'react';
import SearchBar from '../../others/SearchBar';
import { Link } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import {
  getUser,
  onCreateConvoLink as OnCreateConvoLink,
} from '../../others/GraphQl';

export default function UserList(props) {
  const [userConversations, setUserConversations] = useState([]);
  const [usern, setUsern] = useState('');
  const { conversationId } = props.match.params;
  const [currentUserId, setCurrentUserId] = useState(props.match.params.user);
  const [i, setI] = useState('');
  const changeCurrentUserId = (userId) => {
    console.log(userId);
    setCurrentUserId(userId);
    console.log(currentUserId);
    return 'user has been changed';
  };
  const userId = props.match.params.user;
  useEffect(() => {
    getUserInfo();
    const subscription = API.graphql(
      graphqlOperation(OnCreateConvoLink, {
        convoLinkUserId: currentUserId,
      })
    ).subscribe({
      next: (eventData) => {
        setI(eventData);
      },
    });
    return () => subscription.unsubscribe();
  }, [currentUserId, i]);
  async function getUserInfo() {
    try {
      const {
        data: {
          getUser: {
            username,
            conversations: { items: conversations },
          },
        },
      } = await API.graphql(graphqlOperation(getUser, { id: userId }));
      setUsern(username);
      setUserConversations(conversations);
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <section className="conversation" style={{ position: 'relative' }}>
      <div className="header">Conversation</div>
      <SearchBar props={{ ...props }} fn={changeCurrentUserId} />
      <div className="users">
        {userConversations.map((x, i) => (
          <Link
            to={`/chat/${userId}/${x.convoLinkConversationId}`}
            style={{
              height: '80px !important',
              marginBottom: '10px',
              fontFamily: 'GT Walsheim',
              fontStyle: 'normal',
              fontHeight: 'normal',
              fontSize: '1.3rem',
              lineHeight: '30px',
              display: 'flex',
              flexFlow: 'row',
              alignItems: 'center',
              paddingLeft: '34px',
              borderBottom: '1px solid rgba(0, 0, 0, 0.103)',
              textDecoration: 'none',
              color: 'black',
            }}
            key={i}
          >
            {x.conversation.members.filter((x) => x !== usern).join('')}
          </Link>
        ))}
      </div>
    </section>
  );
}
