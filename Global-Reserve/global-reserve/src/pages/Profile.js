import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig'; // No need for Firebase storage anymore
import { doc, getDoc } from 'firebase/firestore';
import { signOut, sendPasswordResetEmail } from 'firebase/auth'; 
import styled from 'styled-components';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

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

    const storedProfilePicture = localStorage.getItem('profilePicture');
    if (storedProfilePicture) {
      setProfilePicture(storedProfilePicture);
    }
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
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64Image = reader.result;
        setProfilePicture(base64Image);
        localStorage.setItem('profilePicture', base64Image);
      };

      reader.readAsDataURL(file);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileImageWrapper>
          {profilePicture ? (
            <ProfileImage 
              src={profilePicture} 
              alt="Profile" 
            />
          ) : (
            <NoProfilePicture>No profile picture available</NoProfilePicture>
          )}
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
        <ActionButton>Upload Picture</ActionButton>
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
  background-color: #0d1117; /* Dark background */
  color: #f0f6fc; /* Light text */
  min-height: 100vh;
  overflow: hidden; 
`;

const ProfileCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #161b22; /* Darker card background */
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  text-align: center;
  color: #f0f6fc;
`;

const ProfileImageWrapper = styled.div`
  width: 150px;
  height: 150px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const NoProfilePicture = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #444c56; /* Neutral background for missing image */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f0f6fc;
  font-size: 0.9rem;
  font-weight: bold;
`;

const ProfileInfo = styled.div`
  margin-top: 1rem;
`;

const Username = styled.h2`
  font-size: 1.5rem;
  color: #f0f6fc;
  margin-bottom: 0.5rem;
`;

const Email = styled.p`
  font-size: 1rem;
  color: #8b949e;
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
  background-color: #238636; /* Green button */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2ea043; /* Darker green on hover */
  }
`;

const UploadSection = styled.div`
  margin-top: 2rem;
`;
