import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import post from './post';
import contact from './contact';

export default combineReducers({
  alert,
  auth,
  profile,
  post,
  contact
});
