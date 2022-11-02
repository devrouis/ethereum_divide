import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import Web3 from "web3";

import {  NotificationContainer, NotificationManager } from "react-notifications";
import "react-notifications/dist/react-notifications.css";

import { getContacts, createContact } from '../../actions/contact';

const ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT;
const MINT_PRICE = process.env.REACT_APP_MINT_PRICE;
const acceptedChains = ENVIRONMENT === "development" ? [3, 4, 5, 42] : [1];
const injected = new InjectedConnector({ supportedChainIds: acceptedChains });

const NFT_ADDRESS = ENVIRONMENT === "development" ? process.env.REACT_APP_TESTNET_ADDRESS : process.env.REACT_APP_MAINNET_ADDRESS;

const web3 = new Web3(Web3.givenProvider);
const contractABI = require("../../helper/abi.json");

const contract = new web3.eth.Contract(contractABI, NFT_ADDRESS);

const Dashboard = () => {
  const dispatch = useDispatch();
  const contacts = useSelector(state => state.contact.contacts)
  const [data, setData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(MINT_PRICE);
  const [totalPercent, setTotalPercent] = useState(0);
  const { active, account, activate } = useWeb3React();

  const [sending, setSending] = useState(false);
  
  useEffect(() => {
    dispatch(getContacts())
  }, [dispatch]);

  useEffect(() => {
    if(contacts !== null)
      setData(contacts);
      let total_price = 0;
      contacts.map(item=>
        total_price += Number(item['value'])
      )
      setTotalPercent(total_price)
  }, [contacts])

  const navigate = useNavigate();
  

  const onAddClick = () => {
      setData([...data, {address:'', value:''}]);
  }
  
  const onConnectClick = async () => {
    var total = 0;
    data.forEach(item => 
      total += Number(item.value)
    )

    if(totalPrice <= 0) {
      NotificationManager.warning('Warning message', 'Total Price should be greather than 0', 3000);
      return ;
    }
    if(total > 100 || total < 1 ) {
      NotificationManager.warning('Warning message', 'Total Value should be less than 100', 3000);
      return ;
    }
    else {
      dispatch(createContact({data: data}, navigate));
    }

    try {
      await activate(injected);
      NotificationManager.success('Success message', 'Wallet is connected');
    } catch (ex) {
      NotificationManager.error('Error message', ex, 2000);
    }
  }

  const onSendClick = async() => {
    let fieldError = 0, addressError = 0;
    data.forEach(item=>{
      if(item.value === '' || item.address === '')
        fieldError ++;
      if(!web3.utils.isAddress(item.address))
        addressError ++;
      
    })

    if(fieldError > 0){
      NotificationManager.error('Error message', 'All fields must be entered.', 2000);
      return ;
    }

    if(addressError > 0){
      NotificationManager.error('Error message', 'You munst input valid address.', 2000);
      return ;
    }

    if(Number(totalPercent) !== 100){
      NotificationManager.error('Error message', 'Total Percent must be 100', 5000);
      return ;
    }

    if(totalPrice <= 0) {
      NotificationManager.warning('Warning message', 'Total Price should be greather than 0', 3000);
      return ;
    }

    dispatch(createContact({data: data}, navigate));
    
    // var total_amount = 0;
    var contractData = [];

    data.forEach(item=>{
      let sendEth = totalPrice / 100 * Number(item.value);
      // total_amount += Number(sendEth.toFixed(18))
      let weiValue = web3.utils.toWei(Number(sendEth).toFixed(18).toString(), "ether");
      let contractUnit={
        receiver: item.address,
        amount: weiValue
      }
      contractData.push(contractUnit)
    })

    // const amountToWei = web3.utils.toWei(Number(total_amount).toFixed(18).toString(), "ether");
    const amountToWei = web3.utils.toWei(totalPrice.toString(), "ether");

    const { success, status } = await SendETH(account, contractData, amountToWei );
    if(success)
      NotificationManager.success('Success message', status);
    else
      NotificationManager.error('Error message', status, 5000);
  }

  const SendETH = async(account, contractData, amountToWei) => {
    setSending(true);

    return contract.methods
    .batchSendETH(contractData) // [{address, value}]
    .send({ from: account, value: amountToWei }) //total eth
    .then((result) => {
      setSending(false);
      return {
        success: true,
        status:
          `✅ Check out your transaction on Etherscan: https://etherscan.io/tx/` +
          result,
      };
    })
    .catch((err) => {
      console.log('----err----')
      console.log(err)

      setSending(false);
      return {
        success: false,
        status: "😥 Something went wrong: " + err.message,
      };
    });
  }


  const onDelClick = (index) => {
    let tmp = [...data];
    tmp.splice(index, 1)
    setData(tmp)
    let total_price = 0;
    tmp.map(item=>
      total_price += Number(item['value'])
    )
    setTotalPercent(total_price)
  }

  const handleTotalValueChange = (value) => {
    setTotalPrice(value)
  }

  const handleValueChange = (index, value) => {
    let tmp = [...data];
    tmp[index]['value'] = value;
    setData(tmp)
    let total_price = 0;
    tmp.map(item=>
      total_price += Number(item['value'])
    )
    setTotalPercent(total_price)
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
      <i className="fas fa-trash cursor-pointer" onClick={()=>onDelClick(index)}   />
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
              <input name="value" type="number" step="any" className="form-control" min="0" value={totalPrice} onChange={(e)=>handleTotalValueChange(e.target.value)} />
              <div className="input-group-append">
                <span className="input-group-text">ETH</span>
              </div>
            </div>
          </div>
          { todosList }
          <div className="row justify-content-between mt-4">
              <button className="btn btn-primary" onClick={()=>onAddClick()} >Add Address</button>
              {
                active ?
                <button 
                  className="btn btn-primary" 
                  onClick={()=>onSendClick()} 
                  disabled={sending}
                >
                    {
                      sending ? 'Sending ...' : 'Send'
                    }
                </button>
                :
                <button className="btn btn-primary" onClick={()=>onConnectClick()} >Connect</button>
              }
              <label><b>Total:&nbsp;&nbsp;{totalPercent}%</b></label>
          </div>
        </div>
      </div>
      <NotificationContainer />
    </section>
  );
};

export default Dashboard;