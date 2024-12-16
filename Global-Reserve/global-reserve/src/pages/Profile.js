// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut, sendPasswordResetEmail } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styled from 'styled-components';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log('No such document!');
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleResetPassword = async () => {
    if (auth.currentUser) {
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      alert('Password reset email sent!');
    }
  };

  const handleProfilePictureChange = (e) => {
    if (e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleUploadProfilePicture = async () => {
    if (profilePicture && auth.currentUser) {
      setUploading(true);
      const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, profilePicture);
      const downloadURL = await getDownloadURL(storageRef);
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        profilePicture: downloadURL,
      });
      setUserData((prevData) => ({ ...prevData, profilePicture: downloadURL }));
      setUploading(false);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <ProfileContainer>
      <Title>Profil</Title>
      <ProfileDetails>
        <DetailItem>
          <Label>Username:</Label>
          <Value>{userData.username}</Value>
        </DetailItem>
        <DetailItem>
          <Label>Email:</Label>
          <Value>{userData.email}</Value>
        </DetailItem>
        {userData.profilePicture && (
          <DetailItem>
            <Label>Profile Picture:</Label>
            <ProfileImage src={userData.profilePicture} alt="Profile" />
          </DetailItem>
        )}
        <DetailItem>
          <Label>Upload Profile Picture:</Label>
          <input type="file" onChange={handleProfilePictureChange} />
          <button onClick={handleUploadProfilePicture} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </DetailItem>
      </ProfileDetails>
      <Button onClick={handleLogout}>Logout</Button>
      <Button onClick={handleResetPassword}>Reset Password</Button>
    </ProfileContainer>
  );
};

export default Profile;

const ProfileContainer = styled.div`
  padding: 2rem;
  background-color: #12172b;
  color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin-bottom: 1rem;
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const DetailItem = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.span`
  font-weight: bold;
`;

const Value = styled.span`
  margin-left: 0.5rem;
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-left: 0.5rem;
`;

const Button = styled.button`
  margin-top: 1rem;
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