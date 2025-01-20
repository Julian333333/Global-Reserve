// Updated Profile.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut, sendPasswordResetEmail } from 'firebase/auth'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styled from 'styled-components';
import placeholderImage from '../assets/placeholder.png'; // Add a placeholder image in your assets

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
      <ProfileCard>
        <ProfileImageWrapper>
          <ProfileImage 
            src={userData.profilePicture || placeholderImage} 
            alt="Profile" 
          />
        </ProfileImageWrapper>
        <ProfileInfo>
          <Username>{userData.username}</Username>
          <Email>{userData.email}</Email>
          <Actions>
            <ActionButton onClick={handleLogout}>Logout</ActionButton>
            <ActionButton onClick={handleResetPassword}>Reset Password</ActionButton>
          </Actions>
        </ProfileInfo>
      </ProfileCard>
      <UploadSection>
        <input type="file" onChange={handleProfilePictureChange} />
        <ActionButton onClick={handleUploadProfilePicture} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Picture'}
        </ActionButton>
      </UploadSection>
    </ProfileContainer>
  );
};

export default Profile;

// Styled components
const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const ProfileCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ProfileImageWrapper = styled.div`
  width: 150px;
  height: 150px;
  margin-bottom: 1rem;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const ProfileInfo = styled.div`
  margin-top: 1rem;
`;

const Username = styled.h2`
  font-size: 1.5rem;
  color: #333333;
  margin-bottom: 0.5rem;
`;

const Email = styled.p`
  font-size: 1rem;
  color: #777777;
  margin-bottom: 1rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: #ffffff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const UploadSection = styled.div`
  margin-top: 2rem;
`;
