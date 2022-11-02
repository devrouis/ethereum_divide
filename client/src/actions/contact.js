import api from '../utils/api';
import { setAlert } from './alert';

import {
  GET_CONTACTS,
  CONTACT_ERROR,
  CREATE_CONTACT,
} from './types';

/*
  NOTE: we don't need a config object for axios as the
 default headers in axios are already Content-Type: application/json
 also axios stringifies and parses JSON for you, so no need for 
 JSON.stringify or JSON.parse
*/

// Get contacts
export const getContacts = () => async (dispatch) => {
  try {
    const res = await api.get('/contact');

    dispatch({
      type: GET_CONTACTS,
      payload: res.data[0].contacts
    });
  } catch (err) {
    dispatch({
      type: CONTACT_ERROR,
      payload: { msg: err.response, status: err.response}
    });
  }
};

// Create or update contact
export const createContact = (data, navigate, edit = false) =>
  async (dispatch) => {
    try {
      const res = await api.post('/contact', data);

      dispatch({
        type: CREATE_CONTACT,
        payload: res.data.contacts
      });

      dispatch(
        setAlert('Delivery is Saved', 'success')
      );

      if (!edit) {
        navigate('/dashboard');
      }
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: CONTACT_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
