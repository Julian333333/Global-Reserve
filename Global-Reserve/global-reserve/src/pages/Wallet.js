import React, { useState, useEffect, useCallback } from 'react';
import { auth, db } from '../firebaseConfig';
import { 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc,
  onSnapshot,
  writeBatch,
  orderBy,
  limit 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import styled from 'styled-components';
import CryptoJS from 'crypto-js';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY || 'encryptionKey';

  const decrypt = useCallback((ciphertext) => {
    try {
      if (!ciphertext || typeof ciphertext !== 'string') {
        return null;
      }
      const bytes = CryptoJS.AES.decrypt(ciphertext, encryptionKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      if (!decrypted) {
        throw new Error('Failed to decrypt data');
      }
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }, [encryptionKey]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log("User not authenticated; clearing data.");
        setTransactions([]);
        setBalance(0);
        setAccountNumber('');
        setIsLoading(false);
        return;
      }

      // Listen for user document changes (balance, accountNumber)
      const userRef = doc(db, 'users', user.uid);
      const unsubscribeBalance = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setBalance(userData.balance || 0);
          if (userData.accountNumber) {
            setAccountNumber(decrypt(userData.accountNumber));
          } else {
            setAccountNumber(userData.plainAccountNumber || '');
          }
        }
        setIsLoading(false);
      });

      // Listen for the last five transactions in real time
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', user.uid),
        orderBy('date', 'desc'),
        limit(5)
      );
      const unsubscribeTransactions = onSnapshot(q, (snapshot) => {
        const txList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTransactions(txList);
      });

      // Cleanup watchers when user logs out or component unmounts
      return () => {
        unsubscribeBalance();
        unsubscribeTransactions();
      };
    });

    // Cleanup for onAuthStateChanged
    return () => unsubscribeAuth();
  }, [decrypt]);

  const handleTransaction = async (type) => {
    if (!auth.currentUser) {
      setError('Please sign in to perform transactions');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const currentBalance = userDoc.data().balance || 0;
      const transactionAmount = parseFloat(amount);

      if (type === 'deposit') {
        // Update balance for deposit
        await updateDoc(userRef, {
          balance: currentBalance + transactionAmount,
        });
        // Create transaction document for deposit
        await addDoc(collection(db, 'transactions'), {
          userId: auth.currentUser.uid,
          type: 'deposit',
          amount: transactionAmount,
          date: new Date().toISOString(),
        });
      } else if (type === 'withdraw') {
        if (currentBalance < transactionAmount) {
          throw new Error('Insufficient balance');
        }
        // Update balance for withdraw
        await updateDoc(userRef, {
          balance: currentBalance - transactionAmount,
        });
        // Create transaction document for withdraw
        await addDoc(collection(db, 'transactions'), {
          userId: auth.currentUser.uid,
          type: 'withdraw',
          amount: transactionAmount,
          date: new Date().toISOString(),
        });
      } else if (type === 'transfer') {
        if (!recipientAccount) {
          throw new Error('Please enter recipient account number');
        }

        // Create batch
        const batch = writeBatch(db);

        // Get recipient's document
        const q = query(collection(db, 'users'), where('plainAccountNumber', '==', recipientAccount));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          throw new Error('Recipient not found');
        }
        const recipientDoc = snapshot.docs[0];
        const recipientBalance = recipientDoc.data().balance || 0;

        if (currentBalance < transactionAmount) {
          throw new Error('Insufficient balance');
        }

        // Create transaction document first
        const transactionRef = doc(collection(db, 'transactions'));
        batch.set(transactionRef, {
          userId: auth.currentUser.uid,
          recipientId: recipientAccount,
          type: 'transfer',
          amount: transactionAmount,
          date: new Date().toISOString(),
          transactionId: transactionRef.id
        });

        // Update balances
        batch.update(userRef, {
          balance: currentBalance - transactionAmount,
          transactionId: transactionRef.id
        });

        batch.update(recipientDoc.ref, {
          balance: recipientBalance + transactionAmount,
          transactionId: transactionRef.id
        });

        await batch.commit();
      }

      setAmount('');
      setRecipientAccount('');
    } catch (error) {
      console.error(`Error performing ${type}:`, error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!db) {
    console.error('Firestore is not initialized. Check your firebaseConfig.js file.');
    return <div>Loading...</div>;
  }

  return (
    <WalletContainer>
      <h1>Wallet</h1>
      {isLoading ? (
        <LoadingMessage>Loading wallet data...</LoadingMessage>
      ) : (
        <>
          <AccountNumberSection>
            <h2>Account Number: {accountNumber}</h2>
          </AccountNumberSection>
          <BalanceSection>
            <h2>Balance: ${balance.toFixed(2)}</h2>
          </BalanceSection>
          <TransactionSection>
            <h2>Transactions</h2>
            <TransactionList>
              {transactions.map((transaction) => (
                <TransactionItem key={transaction.id}>
                  <span>{transaction.type}</span>
                  <span>${transaction.amount.toFixed(2)}</span>
                  <span>
                    {new Date(transaction.date).toLocaleDateString()}{' '}
                    {new Date(transaction.date).toLocaleTimeString()}
                  </span>
                  {transaction.recipientId && (
                    <span>Recipient: {transaction.recipientId}</span>
                  )}
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
              disabled={isLoading}
            />
            <Button 
              onClick={() => handleTransaction('deposit')}
              disabled={isLoading}
            >
              Deposit
            </Button>
            <Button 
              onClick={() => handleTransaction('withdraw')}
              disabled={isLoading}
            >
              Withdraw
            </Button>
            <Input
              type="text"
              value={recipientAccount}
              onChange={(e) => setRecipientAccount(e.target.value)}
              placeholder="Recipient Account"
              disabled={isLoading}
            />
            <Button 
              onClick={() => handleTransaction('transfer', decrypt(recipientAccount))}
              disabled={isLoading}
            >
              Transfer
            </Button>
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </ActionSection>
        </>
      )}
    </WalletContainer>
  );
};

export default Wallet;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ffffff;
`;

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