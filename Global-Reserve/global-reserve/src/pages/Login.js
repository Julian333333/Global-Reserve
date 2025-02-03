import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, query, where, collection, getDocs } from 'firebase/firestore';

const Login = () => {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState(''); // Can be email or username
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            let email = identifier;
            if (!identifier.includes('@')) {
                // If identifier is not an email, assume it's a username
                const q = query(collection(db, 'users'), where('username', '==', identifier));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    email = userDoc.data().email;
                } else {
                    throw new Error('No user found with this username');
                }
            }
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    console.log('User data:', userDoc.data());
                    navigate('/'); // Redirect to dashboard after successful login
                } else {
                    setError('User data not found');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message);
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/register');
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="identifier">Email or Username:</label>
                    <input
                        type="text"
                        id="identifier"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
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
                <button type="submit">Login</button>
            </form>
            <button onClick={handleRegisterRedirect}>Register</button>
        </div>
    );
};

export default Login;