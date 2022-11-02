import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { Web3ReactProvider } from '@web3-react/core'
import Web3 from 'web3'

function getLibrary(provider) {
    return new Web3(provider)
}

// function getLibrary(provider) {
//     const web3Provider = new Web3.providers.HttpProvider(
//       "https://eth-goerli.public.blastapi.io"
//     );
//     const web3 = new Web3(web3Provider);
//     return web3;
// }

ReactDOM.render(
    <Web3ReactProvider getLibrary={getLibrary}>
        <App />
    </Web3ReactProvider>, 
    document.getElementById('root')
);
