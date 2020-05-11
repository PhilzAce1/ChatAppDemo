import React, { useReducer, useEffect, useState } from 'react';
// import { reducer, initialState } from '../../../Store';
import { API, graphqlOperation } from 'aws-amplify';
// , Auth
import {
  onCreateMessage as OnCreateMessage,
  getConvo,
  getUser,
  createMessage as CreateMessage,
} from '../../others/GraphQl';
// import {  } from '../../../graphql/queries';
// import { onCreateMessage as OnCreateMessage } from '../../../graphql/subscriptions';
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
  const userId = props.match.params.user;
  const [usern, setUsern] = useState('');
  const {
    match: {
      params: { conversationId },
    },
  } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const [otherUser, setOtherUser] = useState('@user');

  // const [message, setMessage] = useState('');
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
          name,
          createdAt,
        },
        getConvo: Something,
      },
    } = await API.graphql(graphqlOperation(getConvo, { id: conversationId }));
    if (members.length < 1) return alert('this conversationlink is invalid');
    console.log(members, items, name, createdAt);
    console.log(Something);
    const user = members.filter((x) => x !== username).join('');
    setOtherUser(user);
    dispatch({ type: 'SET_MESSAGE', messages: items });
  }
  async function createMessage() {
    if (state.message === '') return;
    // const user = await Auth.currentAuthenticatedUser();
    const messageData = {
      createdAt: `${Date.now()}`,
      messageConversationId: conversationId,
      content: state.message,
      authorId: userId,
    };
    try {
      // const messageSent =
      await API.graphql(
        graphqlOperation(CreateMessage, { input: messageData })
      );

      // dispatch({ type: 'CLEAR_INPUT', message: '' });
      console.log('item created');
    } catch (error) {
      error.errors[0].message
        ? console.log(error.errors[0].message)
        : console.log(error);
    }
  }
  const handleChange = (e) => {
    dispatch({
      type: 'SET_INPUT',
      key: e.target.name,
      value: e.target.value,
    });
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
        dispatch({ type: 'ADD_MESSAGE', messages: message });
        console.log(message);
      },
    });
    return () => subscription.unsubscribe();
  }, [conversationId]);
  return (
    <section className="chat">
      <div className="title">@{otherUser}</div>
      <div className="body">
        <div className="body-content">
          {state.messages.map((x, i) => {
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
          })}{' '}
          {/* <div className="mine">
            <div className="text">
              There is a message that you are going to use Lorem ipsum, dolor
              sit amet consectetur adipisicing elit. Ea incidunt hic aliquid
              ipsa. Quas vel ipsum aperiam animi veniam quod unde dolores autem
              quam illo inventore, obcaecati repellat dolorum placeat?
            </div>
          </div>
          <div className="others">
            <div className="text">
              There is a message that you are going to use
            </div>
          </div> */}
          {/* <div className="extra-content others-extra-content">
            <div>
              <div>
                <span>Have</span> $1500
              </div>
              <div>
                <span>Need</span> [NGN] Nigerian Naira
              </div>
            </div>
          </div> */}
          {/* <div></div> */}
          {/* <div className="extra-content mine-extra-content">
            <div></div>
          </div> */}
          {/* <div></div> */}
          {/* <div className="extra-content mine-extra-content">
            <div></div>
          </div> */}
          {/* <div></div> */}
        </div>
        <div className="input">
          <div className="input-content">
            <input
              type="text"
              name="message"
              id="message"
              placeholder="Write a message"
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
