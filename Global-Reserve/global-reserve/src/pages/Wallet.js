import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, collection, addDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';
import styled from 'styled-components';
import CryptoJS from 'crypto-js';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [error, setError] = useState('');

  const encryptionKey = 'encryptionKey'; // Ensure this key is consistent

  const encrypt = (text) => {
    return CryptoJS.AES.encrypt(text, encryptionKey).toString();
  };

  const decrypt = (ciphertext) => {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, encryptionKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Error decrypting data:', error);
      setError('Failed to decrypt data');
      return null;
    }
  };

  useEffect(() => {
    const fetchWalletData = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('User data:', userData);
            setBalance(userData.balance || 0);
            setAccountNumber(decrypt(userData.accountNumber));
          } else {
            console.log('No such document!');
          }

          const q = query(collection(db, 'transactions'), where('userId', '==', auth.currentUser.uid));
          const querySnapshot = await getDocs(q);
          const transactionsList = querySnapshot.docs.map(doc => doc.data());
          setTransactions(transactionsList);
        } catch (error) {
          setError('Failed to fetch wallet data');
          console.error('Error fetching wallet data:', error);
        }
      }
    };

    fetchWalletData();
  }, []);

  const handleDeposit = async () => {
    if (amount <= 0) {
      setError('Amount must be greater than zero');
      return;
    }

    try {
      const newBalance = balance + parseFloat(amount);
      console.log('Updating balance to:', newBalance);
      await updateDoc(doc(db, 'users', auth.currentUser.uid), { balance: newBalance });
      console.log('Balance updated in Firestore');
      await addDoc(collection(db, 'transactions'), {
        userId: auth.currentUser.uid,
        type: 'deposit',
        amount: parseFloat(amount),
        date: new Date().toISOString()
      });
      console.log('Transaction added to Firestore');
      setBalance(newBalance);
      setTransactions([...transactions, { type: 'deposit', amount: parseFloat(amount), date: new Date().toISOString() }]);
      setAmount('');
      setError('');
      console.log('Deposit successful:', newBalance);
    } catch (error) {
      setError('Failed to deposit funds');
      console.error('Error depositing funds:', error);
    }
  };

  const handleWithdraw = async () => {
    if (amount <= 0) {
      setError('Amount must be greater than zero');
      return;
    }

    if (amount > balance) {
      setError('Insufficient balance');
      return;
    }

    try {
      const newBalance = balance - parseFloat(amount);
      await updateDoc(doc(db, 'users', auth.currentUser.uid), { balance: newBalance });
      await addDoc(collection(db, 'transactions'), {
        userId: auth.currentUser.uid,
        type: 'withdraw',
        amount: parseFloat(amount),
        date: new Date().toISOString()
      });
      setBalance(newBalance);
      setTransactions([...transactions, { type: 'withdraw', amount: parseFloat(amount), date: new Date().toISOString() }]);
      setAmount('');
      setError('');
      console.log('Withdrawal successful:', newBalance);
    } catch (error) {
      setError('Failed to withdraw funds');
      console.error('Error withdrawing funds:', error);
    }
  };

  const handleTransfer = async () => {
    if (amount <= 0) {
      setError('Amount must be greater than zero');
      return;
    }

    if (amount > balance) {
      setError('Insufficient balance');
      return;
    }

    try {
      const recipientId = decrypt(recipientAccount);
      if (!recipientId) {
        setError('Invalid recipient account');
        return;
      }
      const recipientDocRef = doc(db, 'users', recipientId);
      const recipientDoc = await getDoc(recipientDocRef);
      if (!recipientDoc.exists()) {
        setError('Recipient account not found');
        return;
      }

      const recipientData = recipientDoc.data();
      const newRecipientBalance = recipientData.balance + parseFloat(amount);
      const newBalance = balance - parseFloat(amount);

      await updateDoc(doc(db, 'users', auth.currentUser.uid), { balance: newBalance });
      await updateDoc(recipientDocRef, { balance: newRecipientBalance });

      await addDoc(collection(db, 'transactions'), {
        userId: auth.currentUser.uid,
        recipientId: recipientId,
        type: 'transfer',
        amount: parseFloat(amount),
        date: new Date().toISOString()
      });

      setBalance(newBalance);
      setTransactions([...transactions, { type: 'transfer', amount: parseFloat(amount), date: new Date().toISOString(), recipientId: recipientId }]);
      setAmount('');
      setRecipientAccount('');
      setError('');
      console.log('Transfer successful:', newBalance);
    } catch (error) {
      setError('Failed to transfer funds');
      console.error('Error transferring funds:', error);
    }
  };

  return (
    <WalletContainer>
      <h1>Wallet</h1>
      <AccountNumberSection>
        <h2>Account Number: {accountNumber}</h2>
      </AccountNumberSection>
      <BalanceSection>
        <h2>Balance: ${balance.toFixed(2)}</h2>
      </BalanceSection>
      <TransactionSection>
        <h2>Transactions</h2>
        <TransactionList>
          {transactions.map((transaction, index) => (
            <TransactionItem key={index}>
              <span>{transaction.type}</span>
              <span>${transaction.amount.toFixed(2)}</span>
              <span>{new Date(transaction.date).toLocaleDateString()} {new Date(transaction.date).toLocaleTimeString()}</span>
              {transaction.recipientId && <span>Recipient: {transaction.recipientId}</span>}
            </TransactionItem>
          ))}
        </TransactionList>
      </TransactionSection>
      <ActionSection>
        <h2>Actions</h2>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
        <Button onClick={handleDeposit}>Deposit</Button>
        <Button onClick={handleWithdraw}>Withdraw</Button>
        <Input
          type="text"
          value={recipientAccount}
          onChange={(e) => setRecipientAccount(e.target.value)}
          placeholder="Recipient Account"
        />
        <Button onClick={handleTransfer}>Transfer</Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </ActionSection>
    </WalletContainer>
  );
};

export default Wallet;

const WalletContainer = styled.div`
  padding: 2rem;
  background-color: #12172b;
  color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const AccountNumberSection = styled.div`
  margin-bottom: 2rem;
`;

const BalanceSection = styled.div`
  margin-bottom: 2rem;
`;

const TransactionSection = styled.div`
  margin-bottom: 2rem;
`;

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
`;

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #ffffff;
`;

const ActionSection = styled.div`
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  margin-right: 1rem;
  border-radius: 4px;
  border: 1px solid #ffffff;
  background-color: #1c2c4c;
  color: #ffffff;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 1rem;
`;