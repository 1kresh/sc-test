import Web3 from 'web3';
import {useState } from 'react';
import styles from '../styles/Test.module.css';
import contract from '../blockchain/contract'

const Test = () => {
    const [error, setError] = useState('');
    const [ethBalance, setEthBalance] = useState('');
    const [web3, setWeb3]  = useState(null);
    const [address, setAddress]  = useState(null);
    const [cntr, setContract]  = useState(null);


    const setEthBalanceHandler = async () => {
        try {
            const balance = await cntr.methods.balanceOf(address).call();
            setEthBalance(balance);
            setError('');
        } catch(err) {
            setError(err.message);
        }
    }

    const transferTokens = async () => {
        try {
            const value = parseInt(document.getElementsByName('numTokens')[0].value);
            const toAcc = document.getElementsByName('toAccount')[0].value;
            console.log(value);
            console.log(toAcc);
            if (await cntr.methods.transfer(toAcc, value).send({
                from: address, 
                gas: 0x00, 
                gasPrice: 0x00,
                value: 343000000000000
             })) {
                setError("Success!");
            } else {
                setError("Try again!");
            }
        } catch(err) {
            setError(err.message);
        }
        
    }

    const connectWalletHandler = async () => {
        
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                await window.ethereum.request({ method: "eth_requestAccounts" });
                web3 = new Web3(window.ethereum);
                setWeb3(web3);

                const accounts = await web3.eth.getAccounts();
                setAddress(accounts[0]);

                const cntr =  contract(web3);
                setContract(cntr);

            } catch(err) {
                setError(err.message);
            }
        } else {
            setError(err.message);
        }
    }


    return (
        <div id="root">
        <h1><b>Sport Complex Coin</b></h1>
        <div id="balance_div">
            <div className={styles.balance_check} id="balanceCheck">
                <button className={styles.labely} type="button" onClick={setEthBalanceHandler}>Check balance</button>
                <div className={styles.balance_text} id="balance_text">Your current balance: {ethBalance}</div>
            </div>
        </div>
        <div id="transaction_form">
            <div className={styles.gridy}>
            <label className={styles.labely}>
                <div>To Account</div>
                <input id="toAccount" name="toAccount" type="text"/>
            </label>
            <label className={styles.labely}>
                <div className={styles.num_tokens} id="num_tokens"># of tokens</div>
                <div className={styles.transfer_tokens} id="transfer_tokens">
                <input className={styles.num_tokens} name="numTokens" type="number"/>
                <button onClick={transferTokens}>Transfer tokens</button>
                </div>
            </label>
            </div>
        </div>
        <div id="balance_div" className={styles.danger}>
            <p>{error}</p>
        </div>
        <button onClick={connectWalletHandler} className={styles.enableEthereumButton}>Connect wallet</button>
        </div>
    )
}

export default Test;