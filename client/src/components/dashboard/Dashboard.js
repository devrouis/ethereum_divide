import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';

const Dashboard = ({ getCurrentProfile, deleteAccount, auth: { user }, profile: { profile }}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);
  
  const [data, setData] = useState([]);

  const AddClick = () => {
      setData([...data, {address:'', value:''}]);
  }
  
  const SendClick = () => {
    var total = 0;
    data.forEach(item => 
      total += Number(item.value)
    )

    if(total > 100 || total < 1 )
      alert('Danger! Total Value should be less than 100', '');
    else
      alert('Success! Success');
  }
  const DelClick = (index) => {
    let tmp = [...data];
    tmp.splice(index, 1)
    setData(tmp)
  }

  const handleValueChange = (index, value) => {
    let tmp = [...data];
    tmp[index]['value'] = value;
    setData(tmp)
  }
 
  const handleAddressChange = (index, value) => {
    let tmp = [...data];
    tmp[index]['address'] = value;
    setData(tmp)
  }

  

  const todosList = data.map((item, index) => (
    <div className="row justify-content-between align-items-center mb-2" key={index}>
      <input name="address" type="text" className="form-control col-md-8" onChange={(e)=>handleAddressChange(index, e.target.value)} />
      <div className="d-flex">
      <input name="value" type="number" className="form-control" min="1" max="100" value={item.value} onChange={(e)=>handleValueChange(index, e.target.value)} />
        <div className="input-group-append">
          <span className="input-group-text">%</span>
        </div>
      </div>
      <i className="fas fa-trash cursor-pointer" onClick={()=>DelClick(index)}   />
    </div>
  ));

  return (
    <section className="container">
      <div className="card mt-4">
        <h4 className="card-header">ETH Distribution SYSTEM</h4>
        <div className="card-body ml-4 mr-4">
          { todosList }
          <div className="row justify-content-between mt-4">
              <button className="btn btn-primary" onClick={()=>AddClick()} >Add Address</button>
              <button className="btn btn-primary" onClick={()=>SendClick()} >Send</button>
              <label><b>Total:</b></label>
              {/* <input name="username" type="text" className="form-control col-md-3" /> */}
          </div>
        </div>
      </div>
      
      {/* <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user" /> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <>
          <DashboardActions />
          <Experience experience={profile.experience} />
          <Education education={profile.education} />

          <div className="my-2">
            <button className="btn btn-danger" onClick={() => deleteAccount()}>
              <i className="fas fa-user-minus" /> Delete My Account
            </button>
          </div>
        </>
      ) : (
        <>
          <p>You have not yet setup a profile, please add some info</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </>
      )} */}

    </section>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  Dashboard
);