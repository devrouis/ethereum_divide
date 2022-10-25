import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <section className="container">
      <div className="d-flex flex-column vh-100 justify-content-center">
        <div className='row login-background min-height-300'>
          <div className="col-md-6 bg-white d-flex justify-content-center flex-column">
            <div className='container '>
              <h4>LOGIN</h4>
              {/* <p className="lead">
                <i className="fas fa-user" /> Sign Into Your Account
              </p> */}
              <form className="form" onSubmit={onSubmit}>
                <div className="form-group d-flex">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fas fa-envelope" />
                    </span>
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    value={email}
                    onChange={onChange}
                  />
                </div>
                <div className="form-group d-flex">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fas fa-lock" />
                    </span>
                  </div>
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    minLength="6"
                  />
                </div>
                <input type="submit" className="btn btn-login" value="Login" />
              </form>
              <p className="my-1">
                Don't have an account? <Link to="/register">Sign Up</Link>
              </p>
            </div>
          </div>
          <div className="col-md-6 blue-background text-white d-flex justify-content-center align-items-center">
            <h4>ETH Distribution SYSTEM</h4>
          </div>
        </div>
      </div>
    </section>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);
