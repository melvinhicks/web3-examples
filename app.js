// Require Web3 Module
var Web3 = require('web3');

// Show web3 where it needs to look for the Ethereum node
web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

web3.eth.net.isListening()
    .then(function (res) {
        if (res) {
            console.log('You are connected, nigga!');
        }
        else {
            console.log('Not connected, nigga...');
        }
    })
    .catch(function (e) {
        console.log('Error is: ' + e)
    });

web3.eth.defaultAccount = '0x79701C87e02194380aE10039636ed95f63c52E37';


// An extra module is required for this, use npm to install before running
var Tx = require('ethereumjs-tx');

// Used to sign the transaction. Obviously you SHOULD better secure this than just plain text
var privateKey = new Buffer('852434b70fe9e36a1bb9406aacd4ad906bfa3385a3444a6b1feb54e949cde52b', 'hex');

// The reciviing address of the transaction
var receivingAddr = ('0xd6Eb1E5f53Dfd344428672C3eB3A7b7470f333Fe').toLowerCase();

// Value to be sent, converted to wei and then into a hex value
var txValue = web3.utils.numberToHex(web3.utils.toWei('20', 'ether'));

// Data to be sent in transaction, converted into a hex value. Normal tx's do not need this and use '0x' as default, but who wants to be normal?
var txData = web3.utils.asciiToHex('oh hai mark');

var rawTx = {
    from: web3.eth.defaultAccount,
    nonce: '0x0', // Nonce is the times the address has transacted, should always be higher than the last nonce 0x0#
    gasPrice: '0x14f46b0400', // Normal is '0x14f46b0400' or 90 GWei
    gasLimit: '0x55f0', // Limit to be used by the transaction, default is '0x55f0' or 22000 GWei
    to: receivingAddr, // The receiving address of this transaction
    value: txValue, // The value we are sending '0x16345785d8a0000' which is 0.1 Ether
    data: txData // The data to be sent with transaction, '0x6f6820686169206d61726b' or 'oh hai mark' 
}

//console.log(rawTx); // This is used for testing to see if the rawTx was formmated created properly, comment out the code below to use.

async function doIt(_privateKey, _rawTx) {
    var tx = new Tx(_rawTx);
    tx.sign(_privateKey) // Here we sign the transaction with the private key
        .then(result => { return result.serialize() }) // Clean things up a bit
        .then(result => { console.log('Serialized Tx: ' + result); web3.eth.sendSignedTransaction(result.toString('hex')) })
        .on('receipt',console.log("Transaction receipt: ", result))
        .catch(err =>   { console.error(err) });
}

doIt(privateKey, rawTx).then(console.log).catch(e => {console.log});
//result.then(console.log).catch(e => { console.log });