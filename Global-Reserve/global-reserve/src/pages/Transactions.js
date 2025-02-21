import React, { useState, useEffect, useCallback } from 'react';
import { db, auth } from '../firebaseConfig'; // Update path if needed
import { query, collection, where, onSnapshot, orderBy, getDoc, doc } from 'firebase/firestore';
import styled from 'styled-components';
import CryptoJS from 'crypto-js';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState(''); // e.g., 'deposit', 'withdraw', 'transfer'
  const [sortDirection, setSortDirection] = useState('desc');
  const sortField = 'date';
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
    if (!auth.currentUser) return;

    const qRef = query(
      collection(db, 'transactions'),
      where('userId', '==', auth.currentUser.uid),
      orderBy(sortField, sortDirection)
    );

    const qRefRecipient = query(
      collection(db, 'transactions'),
      where('recipientId', '==', auth.currentUser.uid),
      orderBy(sortField, sortDirection)
    );

    const unsubscribe = onSnapshot(qRef, async (snapshot) => {
      let txList = await Promise.all(snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        if (data.recipientId === auth.currentUser.uid) {
          const senderRef = doc(db, 'users', data.userId);
          const senderDoc = await getDoc(senderRef);
          if (senderDoc.exists()) {
            data.senderAccountNumber = decrypt(senderDoc.data().accountNumber) || senderDoc.data().plainAccountNumber || '';
          }
        }
        return { id: docSnap.id, ...data };
      }));
      if (filterType) {
        txList = txList.filter((tx) => tx.type === filterType);
      }
      setTransactions(txList);
    });

    const unsubscribeRecipient = onSnapshot(qRefRecipient, async (snapshot) => {
      let txList = await Promise.all(snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        if (data.recipientId === auth.currentUser.uid) {
          const senderRef = doc(db, 'users', data.userId);
          const senderDoc = await getDoc(senderRef);
          if (senderDoc.exists()) {
            data.senderAccountNumber = decrypt(senderDoc.data().accountNumber) || senderDoc.data().plainAccountNumber || '';
          }
        }
        return { id: docSnap.id, ...data };
      }));
      if (filterType) {
        txList = txList.filter((tx) => tx.type === filterType);
      }
      setTransactions(prevTransactions => [...prevTransactions, ...txList]);
    });

    return () => {
      unsubscribe();
      unsubscribeRecipient();
    };
  }, [filterType, sortDirection, decrypt]);

  const handleChangeFilter = (e) => {
    setFilterType(e.target.value);
  };

  const toggleSort = () => {
    setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };

  return (
    <TransactionsContainer>
      <h2>All Transactions</h2>
      <FilterSection>
        <label>Filter by Type:</label>
        <select value={filterType} onChange={handleChangeFilter}>
          <option value="">All</option>
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
          <option value="transfer">Transfer</option>
        </select>
        <SortButton onClick={toggleSort}>
          Sort by {sortField.toUpperCase()} ({sortDirection.toUpperCase()})
        </SortButton>
      </FilterSection>
      <TableContainer>
        <TransactionsTable>
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Recipient</th>
              <th>Sender Account</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.type}</td>
                <td>{tx.amount}</td>
                <td>{new Date(tx.date).toLocaleString()}</td>
                <td>{tx.recipientId || '-'}</td>
                <td>{tx.senderAccountNumber || '-'}</td>
              </tr>
            ))}
          </tbody>
        </TransactionsTable>
      </TableContainer>
    </TransactionsContainer>
  );
};

export default TransactionsPage;

const TransactionsContainer = styled.div`
  padding: 1rem;
  color: #ffffff;
  background-color: #1c2c4c;
  min-height: 10vh;
`;

const FilterSection = styled.div`
  margin-bottom: 1rem;
`;

const SortButton = styled.button`
  margin-left: 1rem;
`;

const TableContainer = styled.div`
  max-height: 78vh; /* Adjust the height as needed */
  overflow-y: auto;
  position: relative;
`;

const TransactionsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    border: 1px solid #ffffff;
    padding: 0.5rem;
    text-align: left;
    border radius: 0.25rem;
  }
  th {
    background-color: #2a2e47;
    position: sticky;
    top: 0;
    z-index: 1;
  }
`;