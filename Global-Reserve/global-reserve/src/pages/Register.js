import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import CryptoJS from 'crypto-js';

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const encrypt = (text) => {
        return CryptoJS.AES.encrypt(text, 'encryptionKey').toString();
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Generate a unique account number
            const accountNumber = `ACC-${user.uid}-${Math.floor(Math.random() * 1000000)}`;

            // Encrypt the account number
            const encryptedAccountNumber = encrypt(accountNumber);

            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                uid: user.uid,
                username: username,
                balance: 0,
                accountNumber: encryptedAccountNumber,
                plainAccountNumber: user.uid,
                accountNumber: CryptoJS.AES.encrypt(user.uid, 'encryptionKey').toString()
            });
            navigate('/'); // Redirect to dashboard or any other page after registration
        } catch (error) {
            setError('Failed to register user');
            console.error('Error registering user:', error);
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;