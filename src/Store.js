export const initialState = {};
export function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_MESSAGES':
      return {
        ...state,
        talks: action.talks,
      };
    case 'SET_INPUT':
      return {
        ...state,
        [action.key]: action.value,
      };

    case 'CLEAR_INPUT':
      return {
        ...initialState,
        talks: state.talks,
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        talks: [...state.talks, action.talk],
      };

    default:
      return state;
  }
}
