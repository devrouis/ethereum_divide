import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";

import {  NotificationContainer, NotificationManager } from "react-notifications";
import "react-notifications/dist/react-notifications.css";

import { getContacts, createContact } from '../../actions/contact';

const ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT;
const MINT_PRICE = process.env.REACT_APP_MINT_PRICE;
const acceptedChains = ENVIRONMENT === "development" ? [3, 4, 5, 42] : [1];
const injected = new InjectedConnector({ supportedChainIds: acceptedChains });

const Dashboard = () => {
  const dispatch = useDispatch();
  const contacts = useSelector(state => state.contact.contacts)
  const [data, setData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(MINT_PRICE);
  const { active, account, activate } = useWeb3React();
  
  useEffect(() => {
    dispatch(getContacts());
  }, []);

  useEffect(() => {
    if(contacts !== null)
      setData(contacts);
  }, [contacts])

  const navigate = useNavigate();
  

  const AddClick = () => {
      setData([...data, {address:'', value:''}]);
  }
  
  const SendClick = async () => {
    var total = 0;
    data.forEach(item => 
      total += Number(item.value)
    )

    if(total > 100 || total < 1 ) {
      alert('Danger! Total Value should be less than 100', '');
      return ;
    }
    else {
      let tmp = [...data];
      dispatch(createContact({data: data}, navigate));
    }

    try {
      await activate(injected);

      NotificationManager.success("Wallet is connected");
    } catch (ex) {
      console.log(ex);
    }
  }
  const DelClick = (index) => {
    let tmp = [...data];
    tmp.splice(index, 1)
    setData(tmp)
  }

  const handleTotalValueChange = (value) => {
    setTotalPrice(value)
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
      <input name="address" type="text" className="form-control col-md-8" value={item.address} onChange={(e)=>handleAddressChange(index, e.target.value)} />
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
          <div className="row align-items-center mt-4 mb-4">
            <span><b>Total:</b></span>&nbsp;&nbsp;&nbsp;
            <div className="d-flex">
              <input name="value" type="number" step="any" className="form-control" min="0" onChange={(e)=>handleTotalValueChange(e.target.value)} />
              <div className="input-group-append">
                <span className="input-group-text">ETH</span>
              </div>
            </div>
          </div>
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

export default Dashboard;