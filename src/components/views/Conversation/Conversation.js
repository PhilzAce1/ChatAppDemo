import React, { useReducer, useEffect, useRef, useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import {
  onCreateMessage as OnCreateMessage,
  getConvo,
  getUser,
  createMessage as CreateMessage,
} from '../../others/GraphQl';
const initialState = {
  message: '',
  messages: [],
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MESSAGE':
      return {
        ...state,
        messages: action.messages,
      };
    case 'SET_INPUT':
      return {
        ...state,
        [action.key]: action.value,
      };
    case 'CLEAR_INPUT':
      return {
        ...state,
        message: action.message,
      };

    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.messages],
      };
    default:
      return state;
  }
};

export default function Conversation(props) {
  const messagesEndRef = useRef(null);
  const userId = props.match.params.user;
  const [usern, setUsern] = useState('');
  const {
    match: {
      params: { conversationId },
    },
  } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const [otherUser, setOtherUser] = useState('@user');
  const scrollToBottomm = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  const [message, setMessage] = useState('');
  async function getMessages() {
    const {
      data: {
        getUser: { username },
      },
    } = await API.graphql(graphqlOperation(getUser, { id: userId }));
    const {
      data: {
        getConvo: {
          members,
          messages: { items },
        },
      },
    } = await API.graphql(graphqlOperation(getConvo, { id: conversationId }));
    if (members.length < 1) return alert('this conversationlink is invalid');
    const user = members.filter((x) => x !== username).join('');
    setOtherUser(user);
    dispatch({ type: 'SET_MESSAGE', messages: items });
  }

  async function createMessage(e) {
    if (message === '') return;
    const messageData = {
      createdAt: `${Date.now()}`,
      messageConversationId: conversationId,
      content: message,
      authorId: userId,
    };
    try {
      await API.graphql(
        graphqlOperation(CreateMessage, { input: messageData })
      );
      setMessage('');
    } catch (error) {
      console.log(error);
    }
  }
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      createMessage();
    }
  };
  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  useEffect(() => {
    getMessages();
    const subscription = API.graphql(
      graphqlOperation(OnCreateMessage, {
        messageConversationId: conversationId,
      })
    ).subscribe({
      next: (eventData) => {
        const message = eventData.value.data.onCreateMessage;
        setUsern(message);
        // dispatch({ type: 'ADD_MESSAGE', messages: message });
      },
    });
    scrollToBottomm();
    return () => subscription.unsubscribe();
  }, [conversationId, usern]);
  return (
    <section className="chat">
      <div className="title">@{otherUser}</div>
      <div className="body">
        <div className="body-content" id="bodyd">
          {' '}
          {state.messages.map((x, i, se) => {
            return (
              <div
                style={{
                  position: 'relative',
                  minHeight: '80px',
                }}
                className={x.authorId === userId ? 'mine' : 'others'}
                key={i}
              >
                <div
                  className="text"
                  style={
                    {
                      // height: '100px',
                    }
                  }
                >
                  {x.content}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 4,
                    right: 20,
                    fontSize: '0.8rem',
                    color: 'gray',
                  }}
                >
                  {x.createdAt}
                </div>
              </div>
            );
          })}
          {/* <div id="ccChatBoxEnd" /> */}
          <div ref={messagesEndRef} />
        </div>
        <div className="input">
          <div className="input-content">
            <input
              type="text"
              name="message"
              onKeyPress={handleKeyPress}
              id="message"
              placeholder="Write a message"
              value={message}
              onChange={handleChange}
            />
            <button type="submit" onClick={createMessage}>
              Send
            </button>
          </div>
          <div className="quick-actions">
            <button type="submit">Quick Action</button>
          </div>
        </div>
      </div>
    </section>
  );
}
