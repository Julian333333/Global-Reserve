import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <Container>
      <Title>Global Reserve</Title>
      <Menu>
        <MenuItem>🏠 Dashboard</MenuItem>
        <MenuItem>⏱️ Transactions</MenuItem>
        <MenuItem>💳 Payments</MenuItem>
        <MenuItem>👤 Profile</MenuItem>
        <Divider />
        <MenuItem>⚙️ Settings</MenuItem>
        <MenuItem onClick={handleLoginRedirect}>🔐 Log In</MenuItem>
      </Menu>
    </Container>
  );
};

export default Sidebar;

const Container = styled.div`
  width: 250px;
  background-color: #0b0f22;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  color: #f1c40f;
  font-size: 24px;
`;

const Menu = styled.div`
  margin-top: 20px;
`;

const MenuItem = styled.div`
  padding: 12px;
  font-size: 16px;
  color: #ffffff;
  cursor: pointer;
  &:hover {
    background-color: #1c2c4c;
    border-radius: 5px;
  }
`;

const Divider = styled.hr`
  border: 0.5px solid #ffffff;
  margin: 20px 0;
`;
