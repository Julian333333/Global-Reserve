// src/pages/Profile.js
import React from 'react';
import styled from 'styled-components';

const Profile = () => {
  return (
    <ProfileContainer>
      <Title>Profil</Title>
      <ProfileDetails>
        <DetailItem>
          <Label>Name:</Label>
          <Value>John Doe</Value>
        </DetailItem>
        <DetailItem>
          <Label>Email:</Label>
          <Value>john.doe@example.com</Value>
        </DetailItem>
        {/* Weitere Profilinformationen hier hinzufügen */}
      </ProfileDetails>
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
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #ffd700;
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Label = styled.span`
  font-weight: bold;
`;

const Value = styled.span`
  color: #ffd700;
`;