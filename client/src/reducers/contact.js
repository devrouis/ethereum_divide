import {
    GET_CONTACTS,
    CREATE_CONTACT,
    CONTACT_ERROR,
  } from '../actions/types';
  
  const initialState = {
    contacts: [],
    loading: true,
    error: {}
  };
  
  function contactReducer(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GET_CONTACTS:
        return {
          ...state,
          contacts: payload,
          loading: false
        };
      case CREATE_CONTACT:
        return {
          ...state,
          contacts: payload,
          loading: false
        };
      case CONTACT_ERROR:
        return {
          ...state,
          error: payload,
          loading: false,
          contacts: []
        };
      default:
        return state;
    }
  }
  
  export default contactReducer;
  